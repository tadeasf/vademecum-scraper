import cliSpinners from 'cli-spinners';
import chalk from 'chalk';

export class Spinner {
  constructor(message = '') {
    this.spinner = cliSpinners.dots;
    this.message = message;
    this.currentFrame = 0;
    this.interval = null;
  }

  start(message = this.message) {
    this.message = message;
    this.currentFrame = 0;
    this.interval = setInterval(() => {
      process.stdout.clearLine();
      process.stdout.cursorTo(0);
      const frame = this.spinner.frames[this.currentFrame];
      process.stdout.write(chalk.cyan(frame) + ' ' + this.message);
      this.currentFrame = (this.currentFrame + 1) % this.spinner.frames.length;
    }, this.spinner.interval);
  }

  stop(finalMessage = '') {
    if (this.interval) {
      clearInterval(this.interval);
      process.stdout.clearLine();
      process.stdout.cursorTo(0);
      if (finalMessage) {
        console.log(finalMessage);
      }
    }
  }
}
