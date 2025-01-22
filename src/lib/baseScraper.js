import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class BaseScraper {
    constructor(scraperName) {
        this.browser = null;
        this.page = null;
        this.scraperName = scraperName;
        this.screenshotDir = path.join(process.cwd(), 'downloads', scraperName);

        if (!fs.existsSync(this.screenshotDir)) {
            fs.mkdirSync(this.screenshotDir, { recursive: true });
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

    async delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async close() {
        if (this.browser) {
            await this.browser.close();
        }
    }
} 