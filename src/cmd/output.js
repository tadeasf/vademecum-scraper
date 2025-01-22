import { PromptUtils } from '../utils/prompt.js';
import path from 'path';
import fs from 'fs';

export class OutputHandler {
    static validateOutputDir(dir) {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
            PromptUtils.info(`Created output directory: ${dir}`);
        }
        return dir;
    }

    static getOutputPath(scraperName, customPath = null) {
        const basePath = customPath || path.join(process.cwd(), 'downloads');
        const outputPath = path.join(basePath, scraperName);
        return this.validateOutputDir(outputPath);
    }
}
