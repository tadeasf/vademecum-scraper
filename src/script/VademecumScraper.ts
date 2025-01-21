import * as puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

export class VademecumScraper {
    private browser: puppeteer.Browser | null = null;
    private page: puppeteer.Page | null = null;
    private readonly screenshotDir: string = path.join(process.cwd(), 'downloads');

    constructor() {
        if (!fs.existsSync(this.screenshotDir)) {
            fs.mkdirSync(this.screenshotDir);
        }
    }

    async init(startUrl: string) {
        this.browser = await puppeteer.launch({
            headless: true,
            defaultViewport: { width: 1512, height: 823 }
        });
        this.page = await this.browser.newPage();
        await this.page.goto(startUrl, { waitUntil: 'networkidle0' });
    }

    private async takeScreenshot(pageNumber: number) {
        try {
            // Wait for and click expand button
            await this.page!.waitForSelector('.icon-expand');
            await this.page!.click('.icon-expand');
            
            // Set viewport for expanded view
            await this.page!.setViewport({ width: 1512, height: 945 });
            
            // Wait for content to render
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Take full page screenshot
            await this.page!.screenshot({
                path: path.join(this.screenshotDir, `page_${pageNumber}.png`),
                fullPage: true
            });
            
            console.log(`Screenshot saved for page ${pageNumber}`);
            
            // Press Escape to exit full-screen
            await this.page!.keyboard.press('Escape');
            
            // Reset viewport
            await this.page!.setViewport({ width: 1512, height: 823 });
            
            // Wait a bit for the view to settle
            await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (error) {
            console.error(`Failed to take screenshot of page ${pageNumber}:`, error);
        }
    }

    async scrapePages(targetCount: number = 401, startUrl: string) {
        try {
            await this.init(startUrl);
            
            for (let pageNum = 1; pageNum <= targetCount; pageNum++) {
                // Take screenshot of the current page
                await this.takeScreenshot(pageNum);
                
                // Use the next button with specific class
                const nextButtonSelector = '.icon-next.icon.link';
                await this.page!.waitForSelector(nextButtonSelector, { timeout: 5000 });
                const nextButton = await this.page!.$(nextButtonSelector);
                
                if (nextButton) {
                    await Promise.all([
                        this.page!.click(nextButtonSelector),
                        this.page!.waitForNavigation({ waitUntil: 'networkidle0' })
                    ]);
                    
                    // Add debug logging
                    const currentUrl = this.page!.url();
                    console.log(`Navigated to: ${currentUrl}`);
                } else {
                    console.log('No next page button found, stopping...');
                    break;
                }
                
                // Log progress
                console.log(`Processed page ${pageNum}/${targetCount}`);
                
                // Add a small delay between pages
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