import chalk from 'chalk';
import { Spinner } from './spinner.js';

export class PromptUtils {
  static spinner = new Spinner();

  static success(message) {
    console.log(chalk.green('✓ ' + message));
  }

  static error(message) {
    console.log(chalk.red('✗ ' + message));
  }

  static info(message) {
    console.log(chalk.blue('ℹ ' + message));
  }

  static warning(message) {
    console.log(chalk.yellow('⚠ ' + message));
  }

  static progress(current, total) {
    const percentage = Math.round((current / total) * 100);
    const progressBar = this.createProgressBar(percentage);
    process.stdout.write(`\r${progressBar} ${percentage}% (${current}/${total})`);
  }

  static createProgressBar(percentage) {
    const width = 20;
    const completed = Math.floor((width * percentage) / 100);
    const remaining = width - completed;
    return chalk.cyan('█'.repeat(completed)) + chalk.gray('░'.repeat(remaining));
  }

  static startSpinner(message) {
    this.spinner.start(message);
  }

  static stopSpinner(finalMessage) {
    this.spinner.stop(finalMessage);
  }
}
