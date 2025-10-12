import { BasePlugin, Event } from "../lib";

export class Wordle extends BasePlugin {
    id = 'wordle';

    solution = '';
    guesses: string[] = [];
    mode = 'idle';

    start() {
        if (this.mode == 'playing') {
            this.write('a game is already started.');
            return false;
        } else {
            this.solution = 'boobs';
            this.mode = 'playing';
            this.write('game started. (!guess <word>)');
            return true;
        }
    }

    stop() {
        if (this.mode == 'idle') return false;
        this.write(`give up? the answer was ${this.solution}. See you next time!`);
        this.mode = 'idle';
        return true;
    }

    handleCommand(event: Event.Input, args: string[]): void {
        if (this.mode == 'idle') return;
        if (args[0] == 'guess') return this.commandGuess(event, args);
    }

    commandGuess(event: Event.Input, args: string[]) {
        if (args.length != 2) {
            this.write('usage: !guess <word>');
            return;
        }
        if (args[1].length != 5) {
            this.write(`${args[1]} is not a 5-letter word!`);
            return;
        }
        if (args[1].toLowerCase() == this.solution) {
            this.write(`that's right! the word was ${this.solution}.`);
            this.mode = 'idle';
            return;
        }
        this.guesses.push(args[1].toLowerCase());
        this.write(`nope, the word is not ${args[1]}. I should probably give you a hint, huh. Sorry about that.`)
    }
}