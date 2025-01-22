import { VademecumScraper } from './lib/vademecum.js';
// Import other scrapers as needed

async function main() {
    const scraperType = process.argv[2] || 'vademecum';
    let scraper;
    
    switch(scraperType) {
        case 'vademecum':
            scraper = new VademecumScraper();
            break;
        // Add other cases as needed
    }

    if (scraper) {
        await scraper.run();
    }
}

main();