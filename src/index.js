import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory when using ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class VademecumScraper {
    constructor() {
        this.browser = null;
        this.page = null;
        this.screenshotDir = path.join(process.cwd(), 'downloads');

        if (!fs.existsSync(this.screenshotDir)) {
            fs.mkdirSync(this.screenshotDir);
        }
    }

    async init(startUrl) {
        this.browser = await puppeteer.launch({
            headless: true,
            defaultViewport: { width: 1512, height: 823 }
        });
        this.page = await this.browser.newPage();
        await this.page.goto(startUrl, { waitUntil: 'networkidle0' });
    }

    async takeScreenshot(pageNumber) {
        try {
            await this.page.waitForSelector('.icon-expand');
            await this.page.click('.icon-expand');
            
            await this.page.setViewport({ width: 1512, height: 945 });
            
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            await this.page.screenshot({
                path: path.join(this.screenshotDir, `page_${pageNumber}.png`),
                fullPage: true
            });
            
            console.log(`Screenshot saved for page ${pageNumber}`);
            
            await this.page.keyboard.press('Escape');
            await this.page.setViewport({ width: 1512, height: 823 });
            await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (error) {
            console.error(`Failed to take screenshot of page ${pageNumber}:`, error);
        }
    }

    async scrapePages(targetCount = 401, startUrl) {
        try {
            await this.init(startUrl);
            
            for (let pageNum = 1; pageNum <= targetCount; pageNum++) {
                await this.takeScreenshot(pageNum);
                
                const nextButtonSelector = '.icon-next.icon.link';
                await this.page.waitForSelector(nextButtonSelector, { timeout: 5000 });
                const nextButton = await this.page.$(nextButtonSelector);
                
                if (nextButton) {
                    await Promise.all([
                        this.page.click(nextButtonSelector),
                        this.page.waitForNavigation({ waitUntil: 'networkidle0' })
                    ]);
                    
                    const currentUrl = this.page.url();
                    console.log(`Navigated to: ${currentUrl}`);
                } else {
                    console.log('No next page button found, stopping...');
                    break;
                }
                
                console.log(`Processed page ${pageNum}/${targetCount}`);
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
        } catch (error) {
            console.error('Error during scraping:', error);
            throw error;
        } finally {
            if (this.browser) {
                await this.browser.close();
            }
        }
    }
}

// Starting URL for scraping
const startUrl = 'https://vademecum.nacr.cz/vademecum/permalink?xid=ff8fc441b4737cb36aebbb653842bb74&scan=592712bc-015f-4a37-a6f2-86c5bb9227dc';

// Main function
async function main() {
    const scraper = new VademecumScraper();
    try {
        await scraper.scrapePages(401, startUrl);
        console.log('Scraping completed successfully!');
    } catch (error) {
        console.error('Error during scraping:', error);
    }
}

main();