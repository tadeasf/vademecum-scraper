import chalk from 'chalk';
import { PromptUtils } from '../utils/prompt.js';

export class HelpCommand {
    static showHelp() {
        const help = `
${chalk.bold('Available Commands:')}

${chalk.cyan('npm run help')} - Show this help message
${chalk.cyan('npm run start [scraper]')} - Run a specific scraper

${chalk.bold('Available Scrapers:')}
- vademecum
- vychodoceskearchivy
${chalk.gray('- portafontium (coming soon)')}
${chalk.gray('- mza (coming soon)')}
${chalk.gray('- ceskearchivy (coming soon)')}
${chalk.gray('- ebadatelna (coming soon)')}

${chalk.bold('Options:')}
--pages=<number>     Number of pages to scrape
--start-url=<url>    Starting URL for scraping
--output=<path>      Custom output directory

${chalk.bold('Examples:')}
npm run start vademecum --pages=100
npm run start vychodoceskearchivy --start-url="https://example.com"
`;
        console.log(help);
    }
}
