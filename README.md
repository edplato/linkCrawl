
# LinkCrawl - Work In Progress

> Scrape site for urls to check their status codes using Chromium Puppeteer and JSON file system reading


LinkCrawl uses Puppeteer, a Node library which provides a high-level API to control headless Chrome or Chromium over the DevTools Protocol. It can also be configured to use full (non-headless) Chrome or Chromium (see line 10 in scrape.js). The Puppeteer functionality of LinkCrawl is used to navigate through the DOM triggering elements for the availability of urls to be collected.

LinkCrawl also uses the Node File System to scrape JSON by walking through a designated directory of JSON files to collects urls within JSON objects to be requested for additional links to check.


## Install

This tool uses Node JS. Clone the repo and run the following command to install :
```
npm install
```


## Usage

Scraping urls and making requests to check each url status will take some time to completed. Runs can take over ten minutes to complete and provide an exported JSON file with results. Delays are also added to the code to prevent too many simultaneous requests.  

**The two main functions of LinkCrawl, using Puppeteer and reading JSON files, are separated into two scripts:**

*To scrape urls and check their status for the Worldview site:*

```
npm run scrapewv
```

*To scrape JSON products used in Worldview:*

```
npm run scrapeprod
```
