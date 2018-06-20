"use strict";
exports.__esModule = true;
var dotenv = require("dotenv");
var discord = require("discord.js");
var snoowrap = require("snoowrap");
var fs = require("fs");
dotenv.config();
var reddit = new snoowrap({
    userAgent: process.env.REDDIT_USER_AGENT,
    clientId: process.env.REDDIT_APPLI_ID,
    clientSecret: process.env.REDDIT_APPLI_SECRET,
    username: process.env.REDDIT_USER,
    password: process.env.REDDIT_PASSWORD
});
var bot = new discord.Client();
var commandPrefix = '!';
var chambresChannel;
// const chambresChannel: discord.Channel = bot.channels.find((chan: discord.GuildChannel, key: string): boolean => {
// 	return chan.name === 'chambres';
// });
var girlplsCounter = {};
var girlplsDettes = {};
bot.on('ready', function () {
    console.debug('Bot connected');
    chambresChannel = bot.channels.find(function (chan, key) {
        return chan.name === 'chambres';
    });
});
bot.on('message', function (message) {
    /* ############################## */
    /* ########## COMMANDS ########## */
    /* ############################## */
    // !girlpls ou !chicasexy give a random picture from multireddit specified (Multis: girls, 2dcutie, cosplay)
    if (message.content.startsWith(commandPrefix + 'girlpls') || message.content.startsWith(commandPrefix + 'chicasexy')) {
        if (girlplsCounter[message.author.id]) {
            girlplsCounter[message.author.id]++;
            girlplsDettes[message.author.id] += Math.floor((Math.random() * 150) + 50);
        }
        else {
            girlplsCounter[message.author.id] = 1;
            girlplsDettes[message.author.id] = Math.floor((Math.random() * 150) + 50);
        }
        var args = message.content.split(" ").slice(1);
        if (args[0]) {
            var girlType_1 = args[0];
            reddit.getMyMultireddits().then(function (multis) {
                var multi = multis.find(function (item) {
                    return item.name === girlType_1;
                });
                if (!multi) {
                    message.channel.send("Malheureusement nous ne travaillons pas avec ce genre de femmes, vous pouvez contacter les patrons pour y remédier.");
                    return;
                }
                var randomSub = multi.subreddits[Math.floor(Math.random() * multi.subreddits.length)];
                randomSub.getRandomSubmission().then(function (randomPost) {
                    if (message.channel.id === chambresChannel.id) {
                        message.channel.send('Je vais vous sélectionner une de nos meilleures filles, je reviens.');
                    }
                    else {
                        message.channel.send("Je vais vous sélectionner une de nos meilleures filles et je vous l'envoie dans une chambre privée, je vous invite à aller la retrouver: " +
                            chambresChannel.name);
                    }
                    chambresChannel.send(randomPost.url);
                })["catch"](function (err) {
                    console.error("Error in getting a random post from " + randomSub.name +
                        " :" + err);
                });
            });
        }
        else {
            reddit.getMyMultireddits().then(function (multis) {
                var multi = multis.find(function (item) {
                    return item.name === 'girls';
                });
                var randomSub = multi.subreddits[Math.floor(Math.random() * multi.subreddits.length)];
                randomSub.getRandomSubmission().then(function (randomPost) {
                    if (message.channel.id === chambresChannel.id) {
                        message.channel.send('Je vais vous sélectionner une de nos meilleures filles, je reviens.');
                    }
                    else {
                        message.channel.send("Je vais vous sélectionner une de nos meilleures filles et je vous l'envoie dans une chambre privée, je vous invite à aller la retrouver: " +
                            chambresChannel.name);
                    }
                    chambresChannel.send(randomPost.url);
                })["catch"](function (err) {
                    console.error("Error in getting a random post from " + randomSub.name +
                        " :" + err);
                });
            });
        }
    }
    // !dettes/!deuda pay José for the girls
    if (message.content.startsWith(commandPrefix + "dettes") || message.content.startsWith(commandPrefix + "deuda")) {
        if (message.member.highestRole.name === "Patron") {
            if (girlplsCounter[message.author.id]) {
                message.channel.send('Vous avez passé ' +
                    girlplsCounter[message.author.id] +
                    'h avec nos filles. Vous ne me devez rien bien sur car vous êtes le Patron.');
                return;
            }
            else {
                message.channel.send("Vous n'avez jamais profité du service de nos filles.");
                return;
            }
        }
        else {
            if (girlplsCounter[message.author.id] && girlplsDettes[message.author.id]) {
                message.channel.send('Vous avez passé ' +
                    girlplsCounter[message.author.id] +
                    'h avec nos filles. Vous me devez donc ' +
                    girlplsDettes[message.author.id] +
                    ' pesos');
                return;
            }
            else if (girlplsDettes[message.author.id] === 0) {
                message.channel.sendMessage('Vous avez passé ' +
                    girlplsCounter[message.author.id] +
                    'h avec nos filles. Votre dette est à jour, vous ne me devez rien.');
                return;
            }
            else {
                message.channel.send("Vous n'avez jamais profité du service de nos filles.");
            }
        }
    }
    // !payer/!pagar set the dettes to 0
    if (message.content.startsWith(commandPrefix + "payer") || message.content.startsWith(commandPrefix + "pagar")) {
        if (message.member.highestRole.name === "Patron") {
            message.channel.send('Vous ne me devez rien bien sur car vous êtes le Patron. En vous souhaitant la bonne journée.');
            return;
        }
        if (girlplsCounter[message.author.id] && girlplsDettes[message.author.id]) {
            girlplsDettes[message.author.id] = 0;
            message.channel.sendMessage("Merci bien, j'espère que vous avez passé un bon moment.");
        }
        else if (girlplsDettes[message.author.id] === 0) {
            message.channel.sendMessage("Votre dettes est à jour, vous ne me devez rien.");
        }
        else {
            message.channel.sendMessage("Vous n'avez jamais profité du service de nos filles.");
        }
    }
    // !slap #user José will slap #user
    if (message.content.startsWith(commandPrefix + "slap") || message.content.startsWith(commandPrefix + "bofetada")) {
        var args = message.content.split(" ").slice(1);
        if (args[0] == null) {
            message.channel.sendMessage("*gifle un petit peu " +
                message.author +
                " avec une grosse truite*\nLa prochaine fois précisez qui vous voulez que je gifle !");
        }
        else {
            var targetString_1 = "";
            args.forEach(function (stringPieces) {
                targetString_1 += stringPieces + " ";
            });
            targetString_1 = targetString_1.replace(/ $/, "");
            var target = bot.guilds.array()[0].members.find(function (user) {
                return user.nickname === targetString_1 || user.user.username === targetString_1;
            });
            if (target) {
                message.channel.send("*gifle un petit peu " +
                    target +
                    " avec une grosse truite.*");
            }
            else {
                message.channel.send("Je ne peux pas gifler cette personne voyons, elle n'est même pas ici.");
            }
        }
    }
    // !waifu shows you the true way of the waifu
    if (message.content.startsWith(commandPrefix + "waifu")) {
        fs.readFile('kumiko', function (err, data) {
            if (err) {
                console.error("Error when reading file: " + err);
            }
            var lines = data.toString().split('\n');
            message.channel.send("Voyons " +
                message.author.username +
                ", on sait tous que la vraie waifu c'est Kumiko Oumae.");
            message.channel.send(lines[Math.floor(Math.random() * lines.length)]);
        });
    }
    /* ############################### */
    /* ########## CARETAKER ########## */
    /* ############################### */
    // Check TableFlip
    if (message.content.includes('(╯°□°）╯︵ ┻━┻')) {
        message.channel.send('Calmez vous je vous prie, nous ne sommes pas des animaux');
        // tslint:disable-next-line
        message.channel.send('┬─┬﻿ ノ( ゜-゜ノ)');
    }
    // Check Il est comment ... cette année ?
    var regIlEstComment = /.*(il|ils|Il|Ils|elle|elles|Elle|Elles) (est|sont) comment (.*) cette année \?/;
    if (regIlEstComment.test(message.content)) {
        var tabreg = regIlEstComment.exec(message.content);
        message.channel.send(tabreg[1] + " " +
            tabreg[2] + " " +
            "dégueulasse " +
            tabreg[3] +
            " cette année.");
    }
    // Check too much noise for neighbour
    var regNoise = /[A-Z\u00C0-\u00DC]([A-Z\u00C0-\u00DC]| ){2,}[A-Z\u00C0-\u00DC]/g;
    if (regNoise.test(message.content) && message.author.username !== "José Saint-Michel") {
        var toSend = "Eh, les voisins ils ont pas besoin de savoir";
        var messageReceived = message.content;
        var tab = messageReceived.match(regNoise);
        toSend += " que " + tab[0];
        for (var i = 1; i < tab.length; i++) {
            if (tab[i]) {
                toSend += " et que " + tab[i];
            }
        }
        toSend += " !";
        message.channel.send(toSend);
    }
    // Loucasse est un gros con
    if (message.content.includes('Loucasse')) {
        var loucasse = bot.guilds.array()[0].members.find(function (user) {
            return user.user.username === 'Loucasse';
        });
        message.channel.send('Je tiens à préciser que ' + loucasse + 'est un gros con, mais je lui dirai en vrai.');
    }
    // Merci à Ben Prunty
    if (message.content.includes('Ben Prunty') && message.author.username !== "José Saint-Michel") {
        message.channel.send("Merci à Ben Prunty pour l'OST.");
    }
});
bot.login(process.env.DISCORD_BOT_TOKEN);
