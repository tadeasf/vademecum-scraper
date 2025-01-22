import { BaseScraper } from './baseScraper.js';

class VychodoCeskeArchivyScraper extends BaseScraper {
    constructor() {
        super('vychodoceskearchivy');
    }

    async downloadPage(pageNumber) {
        try {
            // Click download button
            await this.page.waitForSelector('.makeStyles-flex-33:nth-child(1) > div:nth-child(5) > .MuiSvgIcon-root');
            await this.page.click('.makeStyles-flex-33:nth-child(1) > div:nth-child(5) > .MuiSvgIcon-root');
            
            // Wait for download to trigger
            await this.delay(10000);

            // Click next image button
            await this.page.waitForSelector('.makeStyles-flex-33:nth-child(2) > div:nth-child(7) > .MuiSvgIcon-root');
            await this.page.click('.makeStyles-flex-33:nth-child(2) > div:nth-child(7) > .MuiSvgIcon-root');

            // Wait before next action
            await this.delay(5000);

            console.log(`Processed page ${pageNumber}`);
        } catch (error) {
            console.error(`Error processing page ${pageNumber}:`, error);
        }
    }

    async scrapePages(startUrl, totalPages = 36) {
        try {
            await this.init(startUrl);
            
            for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
                await this.downloadPage(pageNum);
                console.log(`Completed ${pageNum}/${totalPages}`);
            }
        } catch (error) {
            console.error('Error during scraping:', error);
        } finally {
            await this.close();
        }
    }
}

// Main execution
const startUrl = 'https://aron.vychodoceskearchivy.cz/apu/b6b1cb45-9b30-40f6-b413-9a0d7947c29c/dao/b6b1cb45-9b30-40f6-b413-9a0d7947c29c/file/e3b8f12a-b4b5-4c60-873c-62b5ec83b93a';

async function main() {
    const scraper = new VychodoCeskeArchivyScraper();
    await scraper.scrapePages(startUrl);
}

main();
