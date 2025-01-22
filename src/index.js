import inquirer from 'inquirer';
import { HelpCommand } from './cmd/help.js';
import { Logger } from './utils/logging.js';
import { VademecumScraper } from './lib/vademecum.js';
import { VychodoCeskeArchivyScraper } from './lib/vychodoceskearchivy.js';

const logger = new Logger('main');

const SCRAPERS = {
  vademecum: VademecumScraper,
  vychodoceskearchivy: VychodoCeskeArchivyScraper,
  // Add other scrapers here as they're implemented
};

async function promptScraper() {
  const { scraper } = await inquirer.prompt([
    {
      type: 'list',
      name: 'scraper',
      message: 'Select a scraper to run:',
      choices: Object.keys(SCRAPERS),
    },
  ]);
  return scraper;
}

async function promptOptions(scraperType) {
  const questions = [
    {
      type: 'input',
      name: 'pages',
      message: 'Number of pages to scrape (default: 1):',
      default: '1',
      validate: input => !isNaN(input) || 'Please enter a number',
    },
    {
      type: 'input',
      name: 'startUrl',
      message: 'Starting URL (optional):',
    },
    {
      type: 'input',
      name: 'output',
      message: 'Custom output directory (optional):',
    },
  ];

  const answers = await inquirer.prompt(questions);
  return {
    pages: parseInt(answers.pages),
    startUrl: answers.startUrl || null,
    outputDir: answers.output || null,
    headless: !process.argv.includes('--dev'),
  };
}

async function main() {
  if (process.argv.includes('--help')) {
    HelpCommand.showHelp();
    process.exit(0);
  }

  try {
    const scraperType = await promptScraper();
    const options = await promptOptions(scraperType);

    logger.info(`Starting ${scraperType} scraper`, options);

    const ScraperClass = SCRAPERS[scraperType];
    const scraper = new ScraperClass(options);

    await scraper.run();

    logger.info(`${scraperType} scraper completed successfully`);
    process.exit(0);
  } catch (error) {
    logger.error('Scraping failed:', { error: error.message });
    process.exit(1);
  }
}

main();
