import { BaseScraper } from './baseScraper.js';
import { PromptUtils } from '../utils/prompt.js';
import fs from 'fs';
import path from 'path';

export class VychodoCeskeArchivyScraper extends BaseScraper {
  constructor(options = {}) {
    super('vychodoceskearchivy', options);
    this.options.startUrl =
      this.options.startUrl ||
      'https://aron.vychodoceskearchivy.cz/apu/b6b1cb45-9b30-40f6-b413-9a0d7947c29c/dao/b6b1cb45-9b30-40f6-b413-9a0d7947c29c/file/e3b8f12a-b4b5-4c60-873c-62b5ec83b93a';

    // Define selectors for download buttons
    this.selectors = {
      downloadButtons: [
        '.makeStyles-flex-33:nth-child(1) > div:nth-child(5) > .MuiSvgIcon-root',
        '.makeStyles-flex-33:nth-child(2) > div:nth-child(7) > .MuiSvgIcon-root',
      ],
      nextButton: '.makeStyles-flex-33:nth-child(2) > div:nth-child(7) > .MuiSvgIcon-root',
    };
  }

  async tryDownload(selector) {
    try {
      await this.page.waitForSelector(selector, { timeout: 5000 });
      await this.page.click(selector);
      await this.delay(5000); // Wait for download to start
      return true;
    } catch (error) {
      PromptUtils.warning(`Failed to use download button ${selector}`);
      return false;
    }
  }

  async downloadPage(pageNumber, isFirstPage = false) {
    try {
      PromptUtils.info(`Processing page ${pageNumber}`);

      // Extra delay for first page load
      if (isFirstPage) {
        PromptUtils.info('Waiting for initial page load...');
        await this.delay(4000);
      }

      // Wait for the page to be fully loaded
      await this.page.waitForSelector('.makeStyles-flex-33');

      // Try each download button until one works
      let downloadSuccess = false;
      for (const selector of this.selectors.downloadButtons) {
        PromptUtils.info(`Trying download button: ${selector}`);
        downloadSuccess = await this.tryDownload(selector);
        if (downloadSuccess) {
          PromptUtils.success(`Successfully used download button: ${selector}`);
          break;
        }
      }

      if (!downloadSuccess) {
        throw new Error('All download attempts failed');
      }

      // Find and rename the downloaded file
      const files = fs
        .readdirSync(this.screenshotDir)
        .filter(file => file.endsWith('.jpg') || file.endsWith('.jpeg') || file.endsWith('.png'))
        .map(file => ({
          name: file,
          time: fs.statSync(path.join(this.screenshotDir, file)).mtime.getTime(),
        }))
        .sort((a, b) => b.time - a.time);

      if (files.length > 0) {
        const oldPath = path.join(this.screenshotDir, files[0].name);
        const newPath = path.join(this.screenshotDir, `page_${pageNumber}.jpg`);

        if (fs.existsSync(oldPath)) {
          fs.renameSync(oldPath, newPath);
          PromptUtils.success(`Saved page ${pageNumber}`);
        }
      } else {
        throw new Error('No downloaded file found');
      }

      // Only click next if not on the last page
      if (pageNumber < this.options.pages) {
        await this.page.waitForSelector(this.selectors.nextButton);
        await this.page.click(this.selectors.nextButton);
        await this.delay(3000); // Reduced wait time between pages
      }

      PromptUtils.success(`Completed page ${pageNumber}`);
    } catch (error) {
      PromptUtils.error(`Error processing page ${pageNumber}: ${error.message}`);
      throw error;
    }
  }

  async scrapePages(totalPages = 36) {
    try {
      await this.init();
      PromptUtils.info(`Downloads will be saved to: ${this.screenshotDir}`);

      // Process first page with extra delay
      await this.downloadPage(1, true);
      PromptUtils.progress(1, totalPages);

      // Process remaining pages
      for (let pageNum = 2; pageNum <= totalPages; pageNum++) {
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
