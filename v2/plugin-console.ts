import ReadLine from 'node:readline/promises';
import { BotEvent, BotPlugin } from './lib';

export class ConsolePlugin implements BotPlugin {
    rl?: ReadLine.Interface;

    emit(_: BotEvent) {};

    start() {
        this.rl = ReadLine.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
        this.rl.on('line', (line) => {
            // [room] <user> text
            const m = line.match(/(?:\[(.*)\])?\s*(?:<(.*)>)?\s*(.*)/);
            if (m) {
                const [_, room, user, text] = m;
                this.emit({ 
                    source: 'console', 
                    type: 'chat', 
                    room, 
                    user, 
                    text,
                });
            }
        });
    }
    
    send(event: BotEvent) {
        if (event.type == 'chat') {
            const room = event.room || 'CONSOLE';
            const user = event.user || 'USER';
            const text = event.text;
            console.log(`[${room}] <${user}> ${text}`);
        } else if (event.type == 'quit') {
            this.rl?.close();
            console.log('shutting down.');
        }
    }
}