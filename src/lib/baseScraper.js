import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { OutputHandler } from '../cmd/output.js';
import { PromptUtils } from '../utils/prompt.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class BaseScraper {
    constructor(scraperName, options = {}) {
        this.browser = null;
        this.page = null;
        this.scraperName = scraperName;
        this.options = {
            pages: options.pages || 1,
            startUrl: options.startUrl || null,
            outputDir: options.outputDir || null,
            headless: options.headless !== undefined ? options.headless : true,
            delay: options.delay || 2000
        };
        
        if (!this.options.headless) {
            PromptUtils.info('Running in debug mode (browser visible)');
        }
        
        this.screenshotDir = OutputHandler.getOutputPath(scraperName, this.options.outputDir);

        if (!fs.existsSync(this.screenshotDir)) {
            fs.mkdirSync(this.screenshotDir, { recursive: true });
        }
    }

    async init(startUrl) {
        this.browser = await puppeteer.launch({
            headless: this.options.headless ? 'new' : false,
            defaultViewport: { width: 1512, height: 823 }
        });
        this.page = await this.browser.newPage();
        await this.page.goto(startUrl || this.options.startUrl, { waitUntil: 'networkidle0' });
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