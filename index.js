const Spinner = require('cli-spinner').Spinner;

const spinner = new Spinner('Puppeteer headless Chromium crawl and link scraping in process.. %s');
spinner.setSpinnerString('|/-\\');
spinner.start();

const scrapeResults = require('./scrape');
scrapeResults.then(results => {
  spinner.stop(true);
  console.log(results);
});