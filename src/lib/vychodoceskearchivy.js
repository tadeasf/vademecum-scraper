import { BaseScraper } from './baseScraper.js';
import { PromptUtils } from '../utils/prompt.js';

export class VychodoCeskeArchivyScraper extends BaseScraper {
    constructor(options = {}) {
        super('vychodoceskearchivy', options);
        // Set default start URL if none provided
        this.options.startUrl = this.options.startUrl || 'https://aron.vychodoceskearchivy.cz/apu/b6b1cb45-9b30-40f6-b413-9a0d7947c29c/dao/b6b1cb45-9b30-40f6-b413-9a0d7947c29c/file/e3b8f12a-b4b5-4c60-873c-62b5ec83b93a';
    }

    async downloadPage(pageNumber) {
        try {
            PromptUtils.info(`Processing page ${pageNumber}`);
            
            // Click download button
            const downloadButtonSelector = '.makeStyles-flex-33:nth-child(1) > div:nth-child(5) > .MuiSvgIcon-root';
            await this.page.waitForSelector(downloadButtonSelector);
            await this.page.click(downloadButtonSelector);
            
            // Wait for download to trigger
            await this.delay(10000);

            // Click next image button
            const nextButtonSelector = '.makeStyles-flex-33:nth-child(2) > div:nth-child(7) > .MuiSvgIcon-root';
            await this.page.waitForSelector(nextButtonSelector);
            await this.page.click(nextButtonSelector);

            // Wait before next action
            await this.delay(5000);

            PromptUtils.success(`Completed page ${pageNumber}`);
        } catch (error) {
            PromptUtils.error(`Error processing page ${pageNumber}: ${error.message}`);
            throw error; // Re-throw to handle in scrapePages
        }
    }

    async scrapePages(totalPages = 36) {
        try {
            await this.init();
            
            for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
                await this.downloadPage(pageNum);
                PromptUtils.progress(pageNum, totalPages);
            }
            
            PromptUtils.success('Scraping completed successfully!');
        } catch (error) {
            PromptUtils.error(`Error during scraping: ${error.message}`);
            throw error;
        } finally {
            await this.close();
        }
    }

    async run() {
        await this.scrapePages(this.options.pages);
    }
}

// Main execution
const startUrl = 'https://aron.vychodoceskearchivy.cz/apu/b6b1cb45-9b30-40f6-b413-9a0d7947c29c/dao/b6b1cb45-9b30-40f6-b413-9a0d7947c29c/file/e3b8f12a-b4b5-4c60-873c-62b5ec83b93a';

async function main() {
    const scraper = new VychodoCeskeArchivyScraper();
    await scraper.scrapePages(this.options.pages);
}

main();
