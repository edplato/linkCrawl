const fetch = require('node-fetch');

// URL status check function makes get requests to provided list of URLs to get status codes / errors

// Delay helper to prevent too many requests at once
const sleeper = (ms) => (x) => new Promise(resolve => setTimeout(() => resolve(x), ms));

// Checks status code of provided links and return object organized by errors / statuscodes
const requestCheck = async (urls) => {
  const parsedUrls = {
    ERROR: [],
    STATUSCODE: {}
  };
  for (let i = 0; i < urls.length; i++) {
    let linkName = Object.keys(urls[i])[0];
    let url = Object.values(urls[i])[0];

    // Skip for mailto email links
    if(url[0] !== 'h') {
      continue;
    }
    const status = await fetch(url)
      .then(async (res) => {
        let statusCode = await res.status;
        if(!parsedUrls['STATUSCODE'][statusCode]) {
          parsedUrls['STATUSCODE'][statusCode] = [];
        }
        parsedUrls['STATUSCODE'][statusCode].push({[linkName]: url});
      })
      .then(sleeper(500))
      .catch((err) => {
        parsedUrls['ERROR'].push({[linkName]: url});
      })
  }
  return await parsedUrls;
}

// Get links from nested object and process to get new object
const getUrlLinks = async (linkList) => {
   const urls = [];
   const searchNestedObject = (obj) => {
    if(Array.isArray(obj)) {
      for(let linkSet of obj) {
        urls.push(linkSet);
      }
    } else {
      for(let url in obj) {
        if(typeof obj[url] === 'object') {
          searchNestedObject(obj[url]); 
        } else {
          urls.push({[url] : obj[url]});
        }
      }
    }
   }
   searchNestedObject(linkList);
   const checked = await requestCheck(urls);
   return checked;
};

// Get urls with errors/status codes organized into an object
const	getURLStatusCodeCollection = async function(urls) {
	const parsedUrls = await getUrlLinks(urls);
  // Log out number of links with errors/status codes
  console.log(`

URL STATUSCODE RESULTS:
${'-'.repeat(66)}
  ERRORS: ${parsedUrls['ERROR'].length}
  STATUSCODE:`);
  for(let code in parsedUrls['STATUSCODE']) {
    console.log(`    ${code}: ${parsedUrls['STATUSCODE'][code].length}`);
  }
  return parsedUrls;
};

module.exports = getURLStatusCodeCollection;