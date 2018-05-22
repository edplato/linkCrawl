// *************************************************************************
// Scrape Worldview then process URLs to organize by errors and status codes
// 
// Current version targets urls collected from:
// Layers, Natural Events, About page, and Products (JSON)
// *************************************************************************
const Spinner = require('cli-spinner').Spinner;
const getJSONLinks = require('./js/extract-product-links');
const getURLStatusCodeCollection = require('./js/url-check');
const scrapePageURLs = require('./js/scrape');
const fs = require('fs');
const makeLine = (char = '*') => {
  return process.stdout.write(`${char.repeat(66)}
`);
}

// npm argument will be either 'worldview' or 'products' to select mode
const scriptArgument = process.argv[2];
const wvCheck = scriptArgument === 'worldview';

// Prevent majority of TLS SSL related errors
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"

// CLI progress text for initial page crawl
makeLine();
let spinnerMessageStart = wvCheck ? 'Puppeteer headless Chromium crawl and link scraping in process' : 'Gathering JSON links';
const sp = new Spinner(`${spinnerMessageStart}.. %s`);
sp.setSpinnerString('|/-\\');
sp.start();

// Make get requests with URLs with node-fetch to check status codes and organize by errors and codes
const organizeURLStatus = async (scrapedUrls) => {
  // CLI progress text for status code check - longer process
  sp.stop(true);
  let sp2 = new Spinner('Now checking each URL for status codes.. %s');
  sp2.setSpinnerString('|/-\\');
  sp2.start();

  // Initiate './urlCodeCheck.js' function to get status codes
  let results = await getURLStatusCodeCollection(scrapedUrls);

  // Wait for URLs to be analyzed then stringify and save to JSON file
  let stringified = await JSON.stringify(results, null, 2);
  let now = new Date();

  // Check for 'results' directory or make new one
  fs.existsSync('./results') || fs.mkdirSync('./results');

  let titlePrefix = wvCheck ? 'Worldview-' : 'Products-';
  let fileName = `./results/${titlePrefix}urlStatusCodeCheck-${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}.json`;
  fs.writeFile(fileName, stringified, 'utf8', function() {
    sp2.stop(true);
    makeLine('-');
    console.log(`
Results file created: ${fileName}
`);
    process.exit();
  });
}

if (wvCheck) {
  // Scrape Worldview based on './scrape.js' and process to get status codes
  scrapePageURLs.then((urlObject) => {
    process.stdout.write('\n');
    makeLine();
    organizeURLStatus(urlObject);
  });
} else {
  // Scrape JSON based from './products' and process to get status codes
  getJSONLinks.then((urlObject) => {
    process.stdout.write('\n');
    makeLine();
    organizeURLStatus(urlObject);
  });
}