import { VademecumScraper } from './script/VademecumScraper';

// ! if you want to scrape different document from vademecum.nacr.cz change this url
const startUrl = 'https://vademecum.nacr.cz/vademecum/permalink?xid=ff8fc441b4737cb36aebbb653842bb74&scan=592712bc-015f-4a37-a6f2-86c5bb9227dc';

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