import { AsyncQueue } from "../lib";

export type BotEvent = {
    type: 'chat';
    source: string;
    room: string;
    user: string;
    text: string;
} | {
    type: 'quit';
} | {
    type: 'reboot';
}

export type BotPlugin = {
    emit: (event: BotEvent) => void;
    start: () => void;
    send: (event: BotEvent) => void | boolean;
}

export class Bot implements BotPlugin { 
    plugins: BotPlugin[] = [];
    queue = new AsyncQueue<BotEvent>;
    reboot = true;
    done = Promise.resolve();
    stop = () => {};

    async start() {
        this.done = new Promise(r => this.stop = r);
        for (let i = 0; i < this.plugins.length; i++) {

        }
        for (const p of this.plugins) {
            p.emit = (ev) => this.queue.push(ev);
            p.start();
        }
        const loop = async () => {
            while (true) {
                const event = await this.queue.shift();
                let handled = false;
                for (const p of this.plugins) {
                    if (p.send(event)) {
                        handled = true;
                        break;
                    }
                }
                if (!handled) {
                    this.send(event);
                }
            }
        }
        loop();
    }

    emit() {}

    send(event: BotEvent) { 
        if (event.type == 'quit') {
            this.reboot = false;
            this.stop();
        } else if (event.type == 'reboot') {
            this.stop();
        }
    }
}
