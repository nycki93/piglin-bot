import { Bot } from "./lib";
import { CommandsPlugin } from "./plugin-commands";
import { ConsolePlugin } from "./plugin-console";

async function main() {
    while (true) {
        const bot = new Bot;
        bot.plugins = [
            new ConsolePlugin,
            new CommandsPlugin,
        ]
        bot.start();
        await bot.done;
        if (!bot.reboot) break;
    }
}

main();