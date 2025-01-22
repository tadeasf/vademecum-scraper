import chalk from 'chalk';

export class PromptUtils {
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
        process.stdout.write(`\r${chalk.cyan('⟳')} Progress: ${percentage}% (${current}/${total})`);
    }
}
