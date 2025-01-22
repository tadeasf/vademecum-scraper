import chalk from 'chalk';

export class HelpCommand {
  static showHelp() {
    const help = `
${chalk.bold('Available Commands:')}
${chalk.cyan('npm run start')} - Interactive scraper selection
${chalk.cyan('npm run dev')}   - Interactive scraper selection (debug mode)
${chalk.cyan('npm run help')}  - Show this help message

${chalk.bold('Available Scrapers:')}
${chalk.green('✓')} vademecum
${chalk.green('✓')} vychodoceskearchivy
${chalk.gray('⋯ portafontium (coming soon)')}
${chalk.gray('⋯ mza (coming soon)')}
${chalk.gray('⋯ ceskearchivy (coming soon)')}
${chalk.gray('⋯ ebadatelna (coming soon)')}

${chalk.bold('Interactive Options:')}
- Number of pages to scrape
- Starting URL
- Custom output directory

${chalk.bold('Features:')}
- Automatic logging to ./logs directory
- Debug mode with visible browser (npm run dev)
- Interactive scraper selection
- Progress tracking
- Error handling and reporting

${chalk.bold('Examples:')}
${chalk.cyan('npm run start')}  - Start interactive scraper selection
${chalk.cyan('npm run dev')}    - Start in debug mode (browser visible)
`;
    console.log(help);
  }
}
