import { VademecumScraper } from './lib/vademecum.js';
import { VychodoCeskeArchivyScraper } from './lib/vychodoceskearchivy.js';
import { HelpCommand } from './cmd/help.js';
import { PromptUtils } from './utils/prompt.js';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

async function main() {
    const argv = yargs(hideBin(process.argv))
        .option('help', {
            alias: 'h',
            description: 'Show help'
        })
        .option('pages', {
            type: 'number',
            description: 'Number of pages to scrape'
        })
        .option('start-url', {
            type: 'string',
            description: 'Starting URL for scraping'
        })
        .option('output', {
            type: 'string',
            description: 'Custom output directory'
        })
        .option('debug', {
            type: 'boolean',
            description: 'Run in debug mode (browser visible)',
            default: false
        })
        .strict() // This ensures we error on unknown arguments
        .argv;

    if (argv.help) {
        HelpCommand.showHelp();
        process.exit(0);
    }

    const scraperType = argv._[0];
    if (!scraperType) {
        PromptUtils.error('No scraper type specified');
        HelpCommand.showHelp();
        process.exit(1);
    }

    const options = {
        pages: argv.pages,
        startUrl: argv['start-url'],
        outputDir: argv.output,
        headless: !argv.debug
    };

    let scraper;
    
    switch(scraperType) {
        case 'vademecum':
            scraper = new VademecumScraper(options);
            break;
        case 'vychodoceskearchivy':
            scraper = new VychodoCeskeArchivyScraper(options);
            break;
        default:
            PromptUtils.error(`Unknown scraper type: ${scraperType}`);
            HelpCommand.showHelp();
            process.exit(1);
    }

    try {
        await scraper.run();
        PromptUtils.success('Scraping completed successfully!');
        process.exit(0);
    } catch (error) {
        PromptUtils.error(`Scraping failed: ${error.message}`);
        process.exit(1);
    }
}

main().catch(error => {
    PromptUtils.error(`Unexpected error: ${error.message}`);
    process.exit(1);
});