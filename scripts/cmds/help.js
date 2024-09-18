

const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");
const { getPrefix } = global.utils;
const { commands, aliases } = global.GoatBot;
const doNotDelete = "[ 🔥 | Uzuki Mikata Reborn]";

// Function to generate command details
async function getCommandDetails(commandName, langCode) {
    // Fetch details of a specific command based on its name
    const command = commands.get(commandName);
    if (!command) {
        return 'Command not found.';
    }

    // Customize the command details message based on language
    // You can access properties like command.config.name, command.config.shortDescription, etc., to display details

    return `Command Name: ${command.config.name}\nDescription: ${command.config.shortDescription[langCode]}`;
}

module.exports = {
    config: {
        name: "help",
        version: "1.17",
        author: "NTKhang",
        countDown: 5,
        role: 0,
        shortDescription: {
            vi: "Xem cách dùng lệnh",
            en: "View command usage"
        },
        longDescription: {
            vi: "Xem cách sử dụng của các lệnh",
            en: "View command usage"
        },
        category: "info",
        guide: {
            vi: "  {pn} [để trống | <số trang> | <tên lệnh>]"
        },
        priority: 1
    },

    langs: {},

    onStart: async function ({ message, args, event, threadsData, getLang, role }) {
        const langCode = await threadsData.get(event.threadID, "data.lang") || global.GoatBot.config.language;
        let customLang = {};
        const pathCustomLang = path.normalize(`${process.cwd()}/languages/cmds/${langCode}.js`);
        if (fs.existsSync(pathCustomLang))
            customLang = require(pathCustomLang);

        const { threadID } = event;
        const threadData = await threadsData.get(threadID);
        const prefix = getPrefix(threadID);

        // Retrieve the commands by category
        const commandsByCategory = {};

        for (const [, value] of commands) {
            const category = value.config.category || 'OTHER'; // Default category if not specified
            if (!commandsByCategory[category]) {
                commandsByCategory[category] = [];
            }
            commandsByCategory[category].push(value.config.name);
        }

        // Sort the commands alphabetically within each category
        for (const category in commandsByCategory) {
            commandsByCategory[category].sort();
        }

        // Check if a specific command is requested
        const requestedCommand = args.join(' ').toLowerCase();
        if (requestedCommand) {
            const commandDetails = await getCommandDetails(requestedCommand, langCode);
            return message.reply(commandDetails);
        }

        // Output the commands by category
        let output = '';
        for (const category in commandsByCategory) {
            output += `╭───────────\n│ 『 ${category.toUpperCase()} 』\n`;
            output += `│ ${commandsByCategory[category].map(cmd => `• *{cmd}`).join('\n│ ')}\n`;
            output += `╰────────────\n`;
        }

        // Add the header and footer
        output = `╔═══════════╗\n     Izumi miyamura\n╚═══════════╝\n${output}𝗧𝘆𝗽𝗲 *𝗵𝗲𝗹𝗽 𝗰𝗺𝗱𝗡𝗮𝗺𝗲 𝘁𝗼 𝘃𝗶𝗲𝘄 𝘁𝗵𝗲 𝗱𝗲𝘁𝗮𝗶𝗹𝘀 𝗼𝗳 𝘁𝗵𝗮𝘁 𝗰𝗼𝗺𝗺𝗮𝗻𝗱\nThank you for being with us for a year! Happy New Year Izumi miyamura users!\n`;

        // Output or send the 'output' string as needed
        message.reply(output);
    }
};
