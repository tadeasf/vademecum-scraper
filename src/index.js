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
        .argv;

    if (argv.help) {
        HelpCommand.showHelp();
        return;
    }

    const scraperType = argv._[0] || 'vademecum';
    const options = {
        pages: argv.pages,
        startUrl: argv['start-url'],
        outputDir: argv.output
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
            return;
    }

    if (scraper) {
        try {
            await scraper.run();
            PromptUtils.success('Scraping completed successfully!');
        } catch (error) {
            PromptUtils.error(`Scraping failed: ${error.message}`);
        }
    }
}

main();