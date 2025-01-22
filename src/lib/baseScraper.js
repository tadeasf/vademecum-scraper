import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { OutputHandler } from '../cmd/output.js';
import { PromptUtils } from '../utils/prompt.js';
import { Spinner } from '../utils/spinner.js';
import chalk from 'chalk';

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
      delay: options.delay || 2000,
    };

    if (!this.options.headless) {
      PromptUtils.info('Running in debug mode (browser visible)');
    }

    this.screenshotDir = OutputHandler.getOutputPath(scraperName, this.options.outputDir);
    this.spinner = new Spinner();
  }

  async init(startUrl) {
    this.spinner.start('Launching browser...');

    if (!fs.existsSync(this.screenshotDir)) {
      fs.mkdirSync(this.screenshotDir, { recursive: true });
    }

    this.browser = await puppeteer.launch({
      headless: this.options.headless ? 'new' : false,
      defaultViewport: { width: 1920, height: 1080 },
      args: ['--window-size=1920,1080', '--start-maximized'],
    });

    this.page = await this.browser.newPage();
    await this.page.setViewport({ width: 1920, height: 1080 });

    const client = await this.page.target().createCDPSession();
    await client.send('Page.setDownloadBehavior', {
      behavior: 'allow',
      downloadPath: this.screenshotDir,
    });

    this.spinner.stop();
    this.spinner.start('Loading page...');
    await this.page.goto(startUrl || this.options.startUrl, { waitUntil: 'networkidle0' });
    this.spinner.stop(chalk.green('✓ Browser ready'));
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
