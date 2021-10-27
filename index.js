const Discord = require("discord.js");
const client = new Discord.Client();
const fetch = require('node-fetch');
const axios = require("axios")
config = require("./config.json");
var help = ['./help.txt'];

client.on("ready", () => {


    console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`);


    client.user.setActivity(`Serving Lord Smith in ${client.guilds.size} servers`);

});


client.on("guildCreate", guild => {

    // This event triggers when the bot joins a guild.

    console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);

    client.user.setActivity(`Serving Lord Smith in ${client.guilds.size} servers`);

});


client.on("guildDelete", guild => {

    // this event triggers when the bot is removed from a guild.

    console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);

    client.user.setActivity(`Serving Lord Smith in ${client.guilds.size} servers`);

});


client.on("message", async message => {

    // This event will run on every single message received, from any channel or DM.


    // if the author of the message is a bot then ignore, to avoid botception.
    if (message.author.bot) return;


    if (message.content.indexOf(config.prefix) !== 0) return;


    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);

    const command = args.shift().toLowerCase();


    if (command === "ping") {

        // Calculates ping between sending a message and editing it, giving a nice round-trip latency.

        // The second ping is an average latency between the bot and the websocket server (one-way, not round-trip)

        const m = await message.channel.send("Ping?");

        m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`);

    }


    if (command === "rainbow") {
        const embed = new Discord.RichEmbed().setColor(0x1D82B6);
        embed.setFooter(`Picture by Lord Smith`);
        const m = message.channel.send({embed: {color: 0x1D82B6, description: `RAINBOW`, file: "./rainbow.gif"}});
        m.edit({embed: {color: 0xf7dc6f, description: `RAINBOW`, file: "./rainbow.gif"}});
        /*message.channel.send("RAINBOW", {
          file: "./rainbow.gif" // Or replace with FileOptions object
      });*/

    }

    if (command === "random") {
        number = 11;
        imageNm = Math.floor(Math.random() * (number - 1 + 1)) + 1;
        message.channel.send("random", {file: "./gifs/" + imageNm + ".gif"});
    }

    if (command === "searchimdb") {
        axios.get('http://localhost:8080/newMovieService_war_exploded/movies/search/'+args.join('+')).then(function(response) {
            const movies = response.data;
            
            let fields = [];
            let embed = new Discord.RichEmbed().setColor('#0099ff').setTitle("Found "+movies.length+ " results for: '"+args.join(" ")+"'").setFooter('Requested by: '+message.member.user.tag).setTimestamp();
            let count = 1;
            Object.values(movies).forEach(movie => {
                if (count<=5){
                    //fields.push({ name: movie.name, value: " "+movie.description+"/n Rating: "+movie.rating+"/10:star:", inline: true});
                    embed.addField(""+count+". "+movie.name, movie.description+"\n[visit IMDB]("+movie.imdbURL+") **Rating:** "+movie.rating+"/10:star:", false );
                    count+=1;
                }
               
            });
            /*
            movies.forEach(movie => {
                fields.push({ name: movie.name, value: ""+movie.description+"/n Rating: "+movie.rating+"/10:star:", inline: true});
            });*/
            
            
            message.channel.send(embed);
        });
    }

    if (command === "addtolist") {
        let listName = args[0];
        let movie = [];

        args.forEach(item => {
            if(item != args[0]) {
                movie.push(item);
            }
        })
        
        axios.post('http://localhost:8080/newMovieService_war_exploded/movies/'+args[0]+"/add/"+movie.join('+')).then(function(response) {
            console.log(response);
            message.channel.send("Added");
        })
    }

    if (command === "createlist") {
        axios.post('http://localhost:8080/newMovieService_war_exploded/movies/create/'+args.join('+')+"/"+message.member.user.tag).then(function(response) {
            message.channel.send("done");
        })
    }

    if (command === "showlist") {
        axios.get('http://localhost:8080/newMovieService_war_exploded/movies/list/'+args.join('+')).then(function(response) {
            message.channel.send("got it");
        })
    }
    
    if (command === "movie") {
        
        axios.get('http://localhost:8080/newMovieService_war_exploded/movies/title/'+args.join("+")).then(function(response) {
        const movie = response.data;  
        console.log(args);  
        console.log(response.data);
            message.channel.send(new Discord.RichEmbed().setColor('#0099ff').setTitle(movie.name).setURL(movie.imdbURL).setThumbnail(movie.pictureURL).setDescription(movie.description).addField('Rating', ' '+movie.rating+'/10 :star:', true).setFooter('Requested by: '+message.author.tag).setTimestamp());
        }).catch(function(error){
            console.log(error);
        })
        /*const { file } = await fetch('http://localhost:8080/newMovieService_war_exploded/movies/title/die+hard').then(response => {
        console.log(response);    
        response.json().then((data) => message.channel.send(data));
        
        });*/
        
    }

    if (command === "say") {

        if (!message.member.roles.some(r => ["Polish one stop car shop", "Lord Emperor"].includes(r.name))) {

            return message.reply("Sorry, you don't have permissions to use this!");
        }
        if (message.member.roles.some(r => ["Lord Emperor"].includes(r.name))) {
            const sayMessage = args.join(" ");


            message.delete().catch(O_o => {
            });


            const embed = new Discord.RichEmbed().setColor(0xFF00FF);
            message.channel.send({embed: {color: 0xFF00FF, description: sayMessage}});
            //message.channel.send(sayMessage);
        }
        if (message.member.roles.some(r => ["Polish one stop car shop"].includes(r.name))) {
            const sayMessage = args.join(" ");

            // Then we delete the command message (sneaky, right?). The catch just ignores the error with a cute smiley thing.

            message.delete().catch(O_o => {
            });


            const embed = new Discord.RichEmbed().setColor(0x008000);
            message.channel.send({embed: {color: 0x008000, description: sayMessage}});

        }


    }
    if (command === "rasputin") {
        var VC = message.member.voiceChannel;
        if (!VC)
            return message.reply("MESSAGE IF NOT IN A VOICE CHANNEL");
        VC.join()
            .then(connection => {
                const dispatcher = connection.playFile('./rasputin.mp3');
                dispatcher.on("end", end => {
                    VC.leave()
                });
            })
            .catch(console.error)
    }
    if (command === "giveitup") {
        var VC = message.member.voiceChannel;
        if (!VC)
            return message.reply("MESSAGE IF NOT IN A VOICE CHANNEL");
        VC.join()
            .then(connection => {
                const dispatcher = connection.playFile('./giveitup.mp3');
                dispatcher.on("end", end => {
                    VC.leave()
                });
            })
            .catch(console.error)
    }
    if (command === "bang") {
        var VC = message.member.voiceChannel;
        if (!VC)
            return message.reply("MESSAGE IF NOT IN A VOICE CHANNEL");
        VC.join()
            .then(connection => {
                const dispatcher = connection.playFile('./bang.mp3');
                dispatcher.on("end", end => {
                    VC.leave()
                });
            })
            .catch(console.error);
    }
    if (command === "help") {
        const embed = new Discord.RichEmbed().setColor(0x1D82B6);
        message.channel.send({embed: {color: 0x1D82B6, description: ` help ${help}`}});
    }
    if (command === "bang") {
        var VC = message.member.voiceChannel;
        if (!VC)
            return message.reply("MESSAGE IF NOT IN A VOICE CHANNEL");
        VC.join()
            .then(connection => {
                const dispatcher = connection.playFile('./bang.mp3');
                dispatcher.on("end", end => {
                    VC.leave()
                });
            })
            .catch(console.error);
    }
    if (command === "terra") {
        var VC = message.member.voiceChannel;
        if (!VC)
            return message.reply("MESSAGE IF NOT IN A VOICE CHANNEL");
        VC.join()
            .then(connection => {
                const dispatcher = connection.playFile('./civ.mp3');
                dispatcher.on("end", end => {
                    VC.leave()
                });
            })
            .catch(console.error);
    }
    if (command === "chaos") {
        var VC = message.member.voiceChannel;
        if (!VC)
            return message.reply("MESSAGE IF NOT IN A VOICE CHANNEL");
        VC.join()
            .then(connection => {
                const dispatcher = connection.playFile('./chaos.mp3');
                dispatcher.on("end", end => {
                    VC.leave()
                });
            })
            .catch(console.error);
    }
    if (command === "cominghome") {
        var VC = message.member.voiceChannel;
        if (!VC)
            return message.reply("MESSAGE IF NOT IN A VOICE CHANNEL");
        VC.join()
            .then(connection => {
                const dispatcher = connection.playFile('./cominghome.mp3');
                dispatcher.on("end", end => {
                    VC.leave()
                });
            })
            .catch(console.error);
    }
    if (command === "purgesiren") {
        var VC = message.member.voiceChannel;
        if (!VC)
            return message.reply("MESSAGE IF NOT IN A VOICE CHANNEL");
        VC.join()
            .then(connection => {
                const dispatcher = connection.playFile('./purge.mp3');
                dispatcher.on("end", end => {
                    VC.leave()
                });
            })
            .catch(console.error);
    }
	if (command === "sunisshining") {
        var VC = message.member.voiceChannel;
        if (!VC)
            return message.reply("MESSAGE IF NOT IN A VOICE CHANNEL");
        VC.join()
            .then(connection => {
                const dispatcher = connection.playFile('./sunisshing.mp3');
                dispatcher.on("end", end => {
                    VC.leave()
                });
            })
            .catch(console.error);
    }
    if (command === "flamingo") {
        var VC = message.member.voiceChannel;
        if (!VC)
            return message.reply("MESSAGE IF NOT IN A VOICE CHANNEL");
        VC.join()
            .then(connection => {
                const dispatcher = connection.playFile('./flamingo.mp3');
                dispatcher.on("end", end => {
                    VC.leave()
                });
            })
            .catch(console.error);
    }

    if (command === "stop") {
        var VC = message.member.voiceChannel;
        VC.leave();
    }


    if (command === "purge") {
        
        // This command removes all messages from all users in the channel, up to 100.


        // get the delete count, as an actual number.

        const deleteCount = parseInt(args[0], 10);


        // Ooooh nice, combined conditions. <3

        if (!deleteCount || deleteCount < 2 || deleteCount > 100)

            return message.reply("Please provide a number between 2 and 100 for the number of messages to delete");


        // So we get our messages, and delete them. Simple enough, right?

        const fetched = await message.channel.fetchMessages({limit: deleteCount});

        message.channel.bulkDelete(fetched)

            .catch(error => message.reply(`Couldn't delete messages because of: ${error}`));

    }

});


client.login(config.token);