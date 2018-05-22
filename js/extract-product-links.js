const jsonLinkMaker = require('./json-link-maker');
const fetch = require('node-fetch');

// delay helper to prevent too many requests at once
const sleeper = (ms) => (x) => new Promise(resolve => setTimeout(() => resolve(x), ms));

const scrapeLinks = async (productLinks) => {
  const parsedUrls = [];
  // track to prevent doubles
  const addedUrls = [];

  for (let i = 0; i < productLinks.length; i++) {
    let jsonLink = productLinks[i];

    const status = await fetch(jsonLink)
      .then(async (res) => {
        let status = await res.json();
        let links = await status.feed.entry[0].links;
        if(links) {
          for(let j = 0; j < links.length; j++) {
            let link = links[j];
            let linkName = link.rel;
            let url = link.href;

            if (linkName && url && addedUrls.includes(url) === false) {
              parsedUrls.push({[linkName]: url});
              addedUrls.push(url);
            }
          }
        }
      }).then(sleeper(500))
      .catch((err) => {
        // will get inital errors if on - TURN ON FOR LOGGING/FURTHER DEBUGGING
        // console.log(jsonLink, err);
      })
  }
  return await parsedUrls;
}

// get JSON links from CMR API and skip exact (rel and href) doubles of links
const jsonLinks = async () => {
  const links = await jsonLinkMaker;
  const results = await scrapeLinks(links);
  return results;
}

// scraped and parsed JSON url results are saved in an array of objects with a key value pair of link text and href:
// 'http://esipfed.org/ns/fedsearch/1.1/metadata#': 'http://dx.doi.org/10.5067/AMSR2/A2_DySno_NRT'
const getJSONLinks = jsonLinks().then((urlObject) => {
  return urlObject;
}).catch((err) => {
  console.log('ERROR: getJSONLinks - ', err);
});

module.exports = getJSONLinks;