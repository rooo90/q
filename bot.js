const Discord = require('discord.js');
const client = new Discord.Client();
const prefix = '#';



client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});




client.on('message', (message) => {
    if(message.author.bot) return;
    if(message.content.startsWith(prefix + 'quran 1')) {
        let codes = message.content.split(' ').slice(1);
        let num;
        if(!codes[0] || isNaN(codes[0])) num = 1
        else num = parseInt(codes[0])
       
        // Embed Of Quran
        let embed = new Discord.RichEmbed()
        .setAuthor("Quran | القرآن", client.user.displayAvatarURL)
        .setTitle("صفحات القرآن الكريم")
        .setImage(getURLCodes(num))
        .setFooter(getFooterCodes(num))
        // Reactions
        let l = '⬅';
        let p = '⏹';
        let r = '➡';
        // Filters
        let lF = (reaction, user) => reaction.emoji.name == l && user.id == message.author.id;
        let pF = (reaction, user) => reaction.emoji.name == p && user.id == message.author.id;
        let rF = (reaction, user) => reaction.emoji.name == r && user.id == message.author.id;
        message.channel.send(embed).then(async msg => {
            await msg.react(r)
            await msg.react(p)
            await msg.react(l)
            // Collecters
            let lC = msg.createReactionCollector(lF)
            let pC = msg.createReactionCollector(pF)
            let rC = msg.createReactionCollector(rF)
            lC.on('collect', codes => {
                if(num == 604) return;
                num++;
                embed.setImage(getURLCodes(num))
                embed.setFooter(getFooterCodes(num))
                msg.reactions.forEach(reaction => {
                    reaction.fetchUsers().then(usersCodes => {
                        usersCodes.forEach(user => {
                            if(user.bot) return;
                            reaction.remove(user)
                        })
                    })
                })
                msg.edit(embed)
            })
            pC.on('collect', codes => {
                message.channel.send("سيتم اغلاق المصحف خلال 5 ثواني").then(codes => {
                    codes.delete(5000)
                    msg.delete(5000)
                    message.delete(5000)
                })
            })
            rC.on('collect', codes => {
                if(num == 1) return;
                num--;
                embed.setImage(getURLCodes(num))
                embed.setFooter(getFooterCodes(num))
                msg.reactions.forEach(reaction => {
                    reaction.fetchUsers().then(users => {
                        users.forEach(user => {
                            if(user.bot) return;
                            reaction.remove(user)
                        })
                    })
                })
                msg.edit(embed)
            })
        })
    }
})
function getURLCodes(num) {
    return `http://quran.ksu.edu.sa/ayat/safahat1/${num}.png`
}
function getFooterCodes(num) {
    return `الصفحة رقم ${num} من أصل 604 صفحة`
}




client.on('message',async message => {
    if(message.author.bot || message.channel.type === 'dm') return;
    let cmd = message.content.split(" ")[0].substring(prefix.length);
    let args = message.content.split(" ").slice(1);
 
    if(cmd === 'قران') {
        let items = [" الفاتحة", " البقرة", " آل عمران", " النساء", " المائدة", " الأنعام", " الأعراف", " الأنفال", " التوبة", " يونس", " هود", " يوسف", " الرعد", " إبراهيم", " الحجر", " النحل", " الإسراء", " الكهف", " مريم", " طه", " الأنبياء", " الحج", " المؤمنون", " النور", " الفرقان", " الشعراء", " النمل", " القصص", " العنكبوت", " الروم", " لقمان", " السجدة", " الأحزاب", " سبأ", " فاطر", " يس", " الصافات", " ص", " الزمر", " غافر", " فصلت", " الشورى", " الزخرف", " الدخان", " الجاثية", " الأحقاف", " محمد", " الفتح", " الحجرات", " ق", " الذاريات", " الطور", " النجم", " القمر", " الرحمن", " الواقعة", " الحديد", " المجادلة", " الحشر", " الممتحنة", " الصف", " الجمعة", " المنافقون", " التغابن", " الطلاق", " التحريم", " الملك", " القلم", " الحاقة", " المعارج", " نوح", " الجن", " المزمل", " المدثر", " القيامة", " الإنسان", " المرسلات", " النبأ", " النازعات", " عبس", " التكوير", " الإنفطار", " المطففين", " الإنشقاق", " البروج", " الطارق", " الأعلى", " الغاشية", " الفجر", " البلد", " الشمس", " الليل", " الضحى", " الشرح", " التين", " العلق", " القدر", " البينة", " الزلزلة", " العاديات", " القارعة", " التكاثر", " العصر", " الهمزة", " الفيل", " قريش", " الماعون", " الكوثر", " الكافرون", " النصر", " المسد", " الإخلاص", " الفلق", " الناس"];
        let sm    = require('string-similarity');
        let fetch = require('node-fetch');
        if(!args[0]) return message.reply('**# من فضلك اكتب اسم السورة من بعد الأمر**');
       
        let bestMatch  = sm.findBestMatch(args[0], items).bestMatch.target;
        let indexMatch = items.indexOf(bestMatch)+1;
       
        fetch(`https://unpkg.com/quran-json@latest/json/surahs/${indexMatch}.json`)
        .then(m => m.json())
        .then(async res => {
            let { verses } = res;
            let output = "";
 
            verses.forEach(async verse => {
               await (output += `\n` + verse.text);
            });
           
           
            let messages = [];
            let index = 0;
            let end = 1950;
           
            for(let i = 0; i < output.length; i++) {
                await messages.push(output.slice(index, end));
               
                await (index+=1950);
                await (end+=1950);
               
                if(output.length < end.length) break;
            }
           
            let counter = 0;
            let msg = await message.channel.send(messages[counter]);
       
            let left = await msg.react('⬅');
            let right = await msg.react('➡');
       
            let collector = await msg.createReactionCollector((reaction, user) => user.id === message.author.id, { time: 15000 });
       
            collector.on('collect',async collected => {
                let emoji = collected.emoji.name;
                let reaction = collected.emoji.name === "⬅" ? left : right;
                await reaction.remove(message.author).catch(e => {});
                if(emoji === "➡") {
                    if(counter >= 1) {
                        counter = 0;
                        msg.edit(messages[counter]);
                    } else if(counter <= 0) {
                        counter = 1;
                        msg.edit(messages[counter]);
                    }
                } else if(emoji === "⬅") {
                    if(counter >= 1) {
                        counter = 0;
                        msg.edit(messages[counter]);
                    } else if(counter <= 0) {
                        counter = 1;
                        msg.edit(messages[counter]);
                    }
                }
            });
            collector.on('end', () => msg.clearReactions());
        });
    }
});




















client.on("message", message => {
	var prefix = "#";
 if (message.content === "#help") {
  const embed = new Discord.RichEmbed()  
      .setColor("#000000") 
      .setDescription(`


**تحت الصيانة الان**

*-anas alharbi

`)
   message.channel.sendEmbed(embed)
    
   }
   }); 
  

















































client.login(process.env.BOT_TOKEN);