require('dotenv').config();
const Discord = require('discord.js');
const bot = new Discord.Client();
const snoowrap = require('snoowrap');
const reddit = new snoowrap({
  userAgent: process.env.REDDIT_USER_AGENT,
  clientId: process.env.REDDIT_APPLI_ID,
  clientSecret: process.env.REDDIT_APPLI_SECRET,
  username: process.env.REDDIT_USER,
  password: process.env.REDDIT_PASSWORD
});
const fs = require('fs');

var key = function(obj){
  return obj.id;
};

var flipedTablesByChannel = {};
var girlplsCounter = {};
var girlplsDettes = {};


const prefix ="!";
// the ready event is vital, it means that your bot will only start reacting to information
// from Discord _after_ ready is emitted.
bot.on('ready', () => {
  console.log('I am ready!');
  var channels = bot.channels.array();
  for(channel of channels)
	{
		flipedTablesByChannel[key(channel)] = 0;
	}
});

// create an event listener for messages
bot.on('message', message => {


/* ############################## */
/* ########## COMMANDS ########## */
/* ############################## */

// !girlpls ou !chicasexy give a random link from your subsribed subreddit
  if (message.content.startsWith(prefix + "girlpls") || message.content.startsWith(prefix + "chicasexy")) {
		message.channel.sendMessage('Je vais vous sélectionner une de nos meilleures filles, je reviens.');
	if(girlplsCounter[message.author.id] != null)
		{
			girlplsCounter[message.author.id]++;
			girlplsDettes[message.author.id]+= Math.floor((Math.random() * 150) + 50);
		}else{
			girlplsCounter[message.author.id]=1;
			girlplsDettes[message.author.id]=Math.floor((Math.random() * 150) + 50);
		}
		var args = message.content.split(" ").slice(1);
		if(args[0] != null)
		{
			var whoreType = args[0];
		}else{
			reddit.getSubscriptions({limit: 50}).then(
			list =>{
				randomIndex = Math.floor((Math.random() * list.length));
				reddit.getRandomSubmission(list[randomIndex].display_name).then(
					randomSub =>{
						message.channel.sendMessage(randomSub.url);
					});
			});
		}
	}
	
// !dettes give the money you need to pay to José
	
	if (message.content.startsWith(prefix + "dettes") || message.content.startsWith(prefix + "deuda")) 
	{
		for(guildmember of bot.guilds.array()[0].members.array())
		{
			if( guildmember.user == message.author && guildmember.highestRole.name == "Patron" && girlplsCounter[message.author.id] != null)
			{
				message.channel.sendMessage('Vous avez passé '+girlplsCounter[message.author.id]+'h avec nos filles. Vous ne me devez rien bien sur car vous êtes le Patron.');
				return;
			}else if(guildmember.user == message.author && guildmember.highestRole.name == "Patron"){
				message.channel.sendMessage("Vous n'avez jamais profité du service de nos filles. À tout moment je peux aller vous en chercher une, appelez moi avec la commande !chicasexy. Passez une bonne journée !");
				return;
			}
		}
	
		if(girlplsCounter[message.author.id] != null && girlplsDettes[message.author.id]!=0)
		{
		message.channel.sendMessage('Vous avez passé '+girlplsCounter[message.author.id]+'h avec nos filles. Vous me devez donc '+girlplsDettes[message.author.id]+' pesos');
		}else if(girlplsDettes[message.author.id]==0){
			message.channel.sendMessage('Vous avez passé '+girlplsCounter[message.author.id]+'h avec nos filles. Votre dette est à jour, vous ne me devez rien.');
		}else{
			message.channel.sendMessage("Vous n'avez jamais profité du service de nos filles. À tout moment je peux aller vous en chercher une, appelez moi avec la commande !chicasexy. Passez une bonne journée !");
		}
	}

// !payer or ! pagar set the dettes to 0
	if (message.content.startsWith(prefix + "payer") || message.content.startsWith(prefix + "pagar")) 
	{
		
		for(guildmember of bot.guilds.array()[0].members.array())
		{
			if( guildmember.user == message.author && guildmember.highestRole.name == "Patron")
			{
				message.channel.sendMessage('Vous ne me devez rien bien sur car vous êtes le Patron. En vous souhaitant la bonne journée.');
				return;
			}
		}
		
		if(girlplsCounter[message.author.id] != null && girlplsDettes[message.author.id]!=0)
		{
			girlplsDettes[message.author.id]=0;
			message.channel.sendMessage("Merci bien, j'espère que vous avez passé un bon moment.");
		}else if(girlgirlplsDettes[message.author.id]==0){
			message.channel.sendMessage("Votre dettes est à jour, vous ne me devez rien.");
		}else{
			message.channel.sendMessage("Vous n'avez jamais profité du service de nos filles. À tout moment je peux aller vous en chercher une, appelez moi avec la commande !chicasexy. Passez une bonne journée !");
		}
	}
	
// !slap #user José will slap #user
if (message.content.startsWith(prefix + "slap") || message.content.startsWith(prefix + "bofetada")) {
		var args = message.content.split(" ").slice(1);
		if(args[0] == null)
		{
			message.channel.sendMessage("*gifle un petit peu "+message.author.username+" avec une grosse truite*\nLa prochaine fois précisez qui vous voulez que je gifle !");
		}else{
			var target = args[0];
			if(target != null && target.substring(0, 1) == "<" )
			{
			message.channel.sendMessage("*gifle un petit peu "+target+" avec une grosse truite.*");
			}else{
				message.channel.sendMessage("Je ne peux pas gifler cette personne voyons, elle n'est même pas ici.");
			}
		}
	}

// !2dcutie sends a random link from r/pantsu
if (message.content.startsWith(prefix + "2dcutie")) {
	message.channel.sendMessage("Ah, vous voulez quelque chose d'exotique ! Je vais voir ce que je peux faire pour vous, je reviens.");
	if(girlplsCounter[message.author.id] != null) {
		girlplsCounter[message.author.id]++;
		girlplsDettes[message.author.id] += Math.floor((Math.random() * 100) + 35);
	} else {
		girlplsCounter[message.author.id] = 1;
		girlplsDettes[message.author.id] = Math.floor((Math.random() * 100) + 35);
	}
	reddit.getRandomSubmission("pantsu").then(
		randomSub =>{
			message.channel.sendMessage(randomSub.url);
		});
} 

// !waifu shows you the true way of the waifu
if (message.content.startsWith(prefix + "waifu")) {
	fs.readFile("kumiko", function(err, data) {
		if(err) throw err;
		data += '';
		var lines = data.split('\n');
		message.channel.sendMessage("Voyons "+message.author.username+", on sait tous que la vraie waifu c'est Kumiko Oumae.");
		message.channel.sendMessage(lines[Math.floor(Math.random()*lines.length)]);
	})
}

/* ############################### */
/* ########## CARETAKER ########## */
/* ############################### */

// send "pong" to the same channel.
	 if (message.content === '(╯°□°）╯︵ ┻━┻') {
		flipedTablesByChannel[key(message.channel)]++;
		if(Math.floor((Math.random() * 10) + 1) == 10)
		{
			message.channel.sendMessage('Calmez vous je vous prie, nous ne sommes pas des animaux');
			while(flipedTablesByChannel[key(message.channel)] > 0)
				{
					message.channel.sendMessage('┬─┬﻿ ノ( ゜-゜ノ)');
					flipedTablesByChannel[key(message.channel)]--;
				}
		}
	}	
});

/* ############################### */
/* ########## CARETAKER ########## */
/* ############################### */

//Check every (int minutes) if tables are flipped and unflipp them
function checkTable(minutes) {
	var timeout = setInterval(function() {
		console.log("I'm checking tables");
		var channels = bot.channels.array();
		for(channel of channels)
		{
			if(flipedTablesByChannel[key(channel)]>0)
			{
				channel.sendMessage("C'est encore un sacré bordel ici ...\nJe vais encore devoir tout ranger...");
				while(flipedTablesByChannel[key(channel)] > 0)
				{
					channel.sendMessage('┬─┬﻿ ノ( ゜-゜ノ)');
					flipedTablesByChannel[key(channel)]--;
				}
			}
		}
	}, minutes * 60 * 1000);
}

checkTable(5);
// log our bot in
bot.login(process.env.DISCORD_BOT_TOKEN);
