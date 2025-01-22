import { BaseScraper } from './baseScraper.js';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

export class VademecumScraper extends BaseScraper {
    constructor(options = {}) {
        super('vademecum', options);
    }

    async downloadPage(pageNumber) {
        let tempPath = null;
        try {
            // Expand the view
            await this.page.waitForSelector('.icon-expand');
            await this.page.click('.icon-expand');
            
            await this.page.setViewport({ width: 1512, height: 945 });
            
            // Wait for content to load
            await this.delay(2000);
            
            // Take screenshot
            tempPath = path.join(this.screenshotDir, `temp_${pageNumber}.png`);
            const finalPath = path.join(this.screenshotDir, `page_${pageNumber}.png`);
            
            await this.page.screenshot({
                path: tempPath,
                fullPage: true
            });

            // Process the image with sharp
            const image = sharp(tempPath);
            const metadata = await image.metadata();
            
            // Calculate dimensions for cropping
            const trimPercentage = 0.28; // 28% from each side
            const trimAmount = Math.floor(metadata.width * trimPercentage);
            const newWidth = metadata.width - (2 * trimAmount);

            console.log(`Processing page ${pageNumber}:`, {
                originalWidth: metadata.width,
                originalHeight: metadata.height,
                trimAmount,
                newWidth
            });

            // Validate dimensions and crop
            if (trimAmount > 0 && newWidth > 0 && metadata.height > 0) {
                try {
                    await sharp(tempPath)
                        .extract({
                            left: trimAmount,
                            top: 0,
                            width: newWidth,
                            height: metadata.height
                        })
                        .toFile(finalPath);
                    console.log(`Successfully cropped image for page ${pageNumber}`);
                } catch (cropError) {
                    console.error(`Error cropping image for page ${pageNumber}:`, cropError);
                    // If cropping fails, save original
                    await sharp(tempPath).toFile(finalPath);
                }
            } else {
                console.warn(`Invalid dimensions detected, saving original for page ${pageNumber}`);
                await sharp(tempPath).toFile(finalPath);
            }

            // Cleanup temporary file
            if (fs.existsSync(tempPath)) {
                fs.unlinkSync(tempPath);
            }
            
            console.log(`Screenshot saved for page ${pageNumber}`);
            
            // Reset view
            await this.page.keyboard.press('Escape');
            await this.page.setViewport({ width: 1512, height: 823 });
            await this.delay(1000);

            // Navigate to next page
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
                throw new Error('Navigation failed - next button not found');
            }

        } catch (error) {
            console.error(`Failed to take screenshot of page ${pageNumber}:`, error);
            try {
                if (tempPath && fs.existsSync(tempPath)) {
                    const finalPath = path.join(this.screenshotDir, `page_${pageNumber}.png`);
                    await sharp(tempPath).toFile(finalPath);
                    fs.unlinkSync(tempPath);
                    console.log(`Saved original image for page ${pageNumber} due to error`);
                }
            } catch (saveError) {
                console.error(`Failed to save original image for page ${pageNumber}:`, saveError);
            }
            throw error; // Re-throw to handle in scrapePages
        }
    }

    async scrapePages(totalPages = 401, startUrl) {
        try {
            await this.init(startUrl);
            
            for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
                await this.downloadPage(pageNum);
                console.log(`Processed page ${pageNum}/${totalPages}`);
                await this.delay(2000);
            }
            console.log('Scraping completed successfully!');
        } catch (error) {
            console.error('Error during scraping:', error);
            throw error;
        } finally {
            await this.close();
        }
    }

    async run() {
        await this.scrapePages(this.options.pages, this.options.startUrl);
    }
}

// Main execution
const startUrl = 'https://vademecum.nacr.cz/vademecum/permalink?xid=ff8fc441b4737cb36aebbb653842bb74&scan=592712bc-015f-4a37-a6f2-86c5bb9227dc';

async function main() {
    const scraper = new VademecumScraper();
    try {
        await scraper.scrapePages(401, startUrl);
    } catch (error) {
        console.error('Error during scraping:', error);
    }
}

main();
