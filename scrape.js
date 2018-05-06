const puppeteer = require('puppeteer');

// Puppeteer is a Node library which provides a high-level API
// to control headless Chrome or Chromium over the DevTools Protocol.
// It can also be configured to use full (non-headless) Chrome or Chromium.

// Scrape function crawls page through determined click events and collects links

const scrape = async () => {
    // TOGGLE {headless: false} FOR VISUAL NAVIGATION
    const browser = await puppeteer.launch({headless: true});
    const page = await browser.newPage();

    // ****************************************
    // PAGE INIT
    // ****************************************

    // LOADS PAGE
    await page.goto('https://worldview.earthdata.nasa.gov/');
    await page.setViewport({width: 1920, height: 1080});
    await page.waitFor(4000);
    // SKIPS TOUR
    await page.click('#skipTour');
    await page.waitFor(1000);

    // ****************************************
    // NATURAL EVENTS LINKS
    // ****************************************

    // Events links are saved in an object with a key value pair of link text and href:
    // 'Tye River Fire - Thursday, May 3': 'http://inciweb.nwcg.gov/incident/5783/'

    // HANDLES CLICK EVENTS FOR ACCESSING EVENTS
    await page.click('#ui-id-2');
    await page.waitFor(700);
    // SCRAPES ALL NATURAL EVENT LINKS
    const eventsLinks = await page.$$eval('.natural-event-link', links => links.reduce((combined, link) => {
        let href = link.href;
        let innerText = link.text;

        let parentTitle = link.parentElement.parentElement.innerText;
        parentTitle = parentTitle.replace('\n', ' - ').slice(0, -1);
        // parentTitle = parentTitle.substr(parentTitle.length -2);

        combined[parentTitle] = href
        return combined;
    }, {}));

    // ****************************************
    // LAYERS LINKS
    // ****************************************

    // layerLinks format is an object with each layer as an object with an array of links:
    // 'MODIS (Terra and Aqua) Combined Value-Added Aerosol Optical Depth': [ [Object], [Object] ],

    // Each link Object contains the link text and href:
    // {'NASA Earthdata - NRT Value-Added MODIS AOD Product': 'https://earthdata.nasa.gov/earth-observation-data/near-real-time/nrt-value-added-modis-aerosol-optical-depth-product-available'}

    // HANDLES CLICK EVENTS FOR ACCESSING LAYERS

    // GEOGRAPHIC LAYERS LINKS
    await page.click('#ui-id-1');
    await page.waitFor(700);
    await page.click('#layers-add');
    await page.waitFor(700);
    await page.click('.layer-category-name');
    await page.waitFor(3000);

    // SCRAPES ALL GEOGRAPHIC LAYERS LINKS
    const layerLinksGeo = await page.$$eval('.source-metadata a', links => links.reduce((combined, link, index) => {
        let href = link.href;
        let innerText = link.innerHTML;

        let parentTitle = link.parentElement.parentElement.innerText;
        parentTitle = parentTitle.split('\n')[1].trim();

        if(!combined[parentTitle]) {
          combined[parentTitle] = [];
        }

        combined[parentTitle].push({[innerText]: href});
        return combined;
    }, {}));

    await page.click('#layers-modal-close');
    await page.waitFor(700);

    // ARCTIC LAYERS LINKS
    await page.click('#wv-toolbar > li:nth-child(2)');
    await page.waitFor(700);
    await page.click('#wv-proj-menu > ul > li:nth-child(1)');
    await page.waitFor(2000);
    await page.click('#ui-id-1');
    await page.waitFor(700);
    await page.click('#layers-add');
    await page.waitFor(2000);

    // SCRAPES ALL ARCTIC LAYERS LINKS
    const layerLinksArctic = await page.$$eval('.source-metadata a', links => links.reduce((combined, link, index) => {
        let href = link.href;
        let innerText = link.innerHTML;

        let parentTitle = link.parentElement.parentElement.innerText;
        parentTitle = parentTitle.split('\n')[1].trim();

        if(!combined[parentTitle]) {
          combined[parentTitle] = [];
        }

        combined[parentTitle].push({[innerText]: href});
        return combined;
    }, {}));

    await page.click('#layers-modal-close');
    await page.waitFor(700);

    // ANTARCTIC LAYERS LINKS
    await page.click('#wv-toolbar > li:nth-child(2)');
    await page.waitFor(700);
    await page.click('#wv-proj-menu > ul > li:nth-child(3)');
    await page.waitFor(2000);
    await page.click('#ui-id-1');
    await page.waitFor(700);
    await page.click('#layers-add');
    await page.waitFor(2000);

    // SCRAPES ALL ANTARCTIC LAYERS LINKS
    const layerLinksAntarctic = await page.$$eval('.source-metadata a', links => links.reduce((combined, link, index) => {
        let href = link.href;
        let innerText = link.innerHTML;

        let parentTitle = link.parentElement.parentElement.innerText;
        parentTitle = parentTitle.split('\n')[1].trim();

        if(!combined[parentTitle]) {
          combined[parentTitle] = [];
        }

        combined[parentTitle].push({[innerText]: href});
        return combined;
    }, {}));

    await page.click('#layers-modal-close');
    await page.waitFor(700);

    // ****************************************
    // ABOUT LINKS
    // ****************************************

    // About links are saved in an object with a key value pair of link text and href:
    // 'EOSDIS': 'https://earthdata.nasa.gov/about'

    // HANDLES CLICK EVENTS FOR ACCESSING LAYERS
    await page.click('#wv-toolbar > li:nth-child(4)');
    await page.waitFor(2000);
    await page.click('#wv-info-menu > ul > li:nth-child(6)');
    await page.waitFor(700);

    // SCRAPES ALL ABOUT LINKS
    const aboutLinks = await page.$$eval('#page a', aboutLinksFull => aboutLinksFull.reduce((combined, link, index) => {

          let href = link.href;
          let innerText = link.text;

          if(combined[innerText]) {
            innerText += ' MULTIPLE LINK - INDEX: ' + index;
          }
          combined[innerText] = href
          return combined;
      }, {}));

    browser.close();

    // RETURN ARRAY OF LINKS FOR LAYERS, EVENTS (ALL THREE PROJECTIONS), AND ABOUT
    return {
      EVENTS: eventsLinks,
      LAYERS: {
        GEOGRAPHIC: layerLinksGeo,
        ARCTIC: layerLinksArctic,
        ANTARCTIC: layerLinksAntarctic
      },
      ABOUT: aboutLinks
    }
};

const scrapeResults = scrape().then((value) => {
    return value;
});

module.exports = scrapeResults;