import { BotEvent, BotPlugin } from "./lib";

export class CommandsPlugin implements BotPlugin {
    prefix = '!';
    app?: { name: string };

    appsAvailable = ['calvinball', 'wordle'];

    emit(_: BotEvent) {};

    start() {}

    send(event: BotEvent) {
        if (event.type == 'chat') {
            if (!event.text.startsWith(this.prefix)) return;

            const args = event.text.slice(this.prefix.length).split(/\s+/);
            const command = args[0].toLowerCase();

            if (command == 'quit' || command == 'exit') {
                this.emit({ type: 'quit' });
            } else if (command == 'reboot') {
                this.emit({ type: 'reboot' });
            } else if (command == 'start') {
                return this.commandPlay(args);
            } else if (command == 'stop') {
                return this.commandStop(args);
            } else if (command == 'help') {
                this.announce('available commands: start, stop, help, quit.');
            }
        }
    }

    announce(text: string) {
        this.emit({
            type: 'chat',
            source: 'bot',
            room: 'main',
            user: 'bot',
            text,
        })
    }

    commandPlay(args: string[]) {
        if (args.length != 2) {
            this.announce('usage: start <app>');
            return;
        }
        if (this.app) {
            this.announce(`cannot start ${args[1]}, already running ${this.app.name}.`);
            return;
        }
        if (this.appsAvailable.includes(args[1])) {
            this.announce(`starting ${args[1]}.`);
            this.app = { name: args[1] };
            return;
        }
        this.announce(`unknown app. available: ${this.appsAvailable.join(', ')}.`);
    }

    commandStop(args: string[]) {
        if (args.length != 2) {
            this.announce('usage: stop <app>');
            return;
        }
        if (!this.app) {
            this.announce('there are no apps running.');
            return;
        }
        if (args[1] != this.app.name) {
            this.announce(`${args[1]} is not running.`);
            return;
        }
        this.announce(`stopping ${this.app.name}`);
        this.app = undefined;
    }
}
