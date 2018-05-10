// *************************************************************************
// Scrape Worldview then process URLs to organize by errors and status codes
// *************************************************************************
const Spinner = require('cli-spinner').Spinner;
const getURLStatusCodeCollection = require('./urlCodeCheck');
const scrapePageURLs = require('./scrape');
const fs = require('fs');
const makeLine = () => {
  return process.stdout.write(`${'*'.repeat(66)}
`);
}

// Prevent majority of TLS SSL related errors
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"

// CLI progress text for initial page crawl
makeLine();
const sp = new Spinner('Puppeteer headless Chromium crawl and link scraping in process.. %s');
sp.setSpinnerString('|/-\\');
sp.start();

// Make get requests with URLs with node-fetch to check status codes and organize by errors and codes
const organizeURLStatus = async (scrapedURLS) => {
  // CLI progress text for status code check - longer process
  sp.stop(true);
  let sp2 = new Spinner('Now checking each URL for status codes.. %s');
  sp2.setSpinnerString('|/-\\');
  sp2.start();

  // Initiate './urlCodeCheck.js' function to get status codes
  let results = await getURLStatusCodeCollection(scrapedURLS);

  // Wait for URLs to be analyzed then stringify and save to JSON file
  let stringified = await JSON.stringify(results, null, 2);
  let now = new Date();
  let fileName = `urlStatusCodeCheck-${now.getFullYear()}-${now.getMonth()}-${now.getDate()}.json`;
  fs.writeFile(fileName, stringified, 'utf8', function() {
    sp2.stop(true);
    makeLine();
  });
}

// Scrape Worldview based on './scrape.js' and process to get status codes
scrapePageURLs.then((urlObject) => {
  process.stdout.write('\n');
  makeLine();
  organizeURLStatus(urlObject);
});

