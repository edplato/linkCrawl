const readFileAsync = require('read-file-async');
const fs = require('fs');

// helper function to find target key in nested object
const findProp = async (obj, key, out) => {
  let i;
  let proto = Object.prototype;
  let ts = proto.toString;
  let hasOwn = proto.hasOwnProperty.bind(obj);

  if ('[object Array]' !== ts.call(out)) {
    out = [];
  } 
  for (i in obj) {
    if (hasOwn(i)) {
      if (i === key) {
        out.push(obj[i]);
      } else if ('[object Array]' === ts.call(obj[i]) || '[object Object]' === ts.call(obj[i])) {
        findProp(obj[i], key, out);
      }
    }
  }
  return out;
}

// create collection of JSON file addresses from directory
const walk = (dir) => {
  let results = [];
  let list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = dir + '/' + file;
    let stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      /* Recurse into a subdirectory */
      results = results.concat(walk(file));
    } else { 
      // results.push(file);
      file_type = file.split(".").pop();
      file_name = file.split(/(\\|\/)/g).pop();
      if (file_type == "json") {
        results.push(file);
      }
    }
  });
  return results;
}

// get shortNames from JSON products
const getShortNames = (jsonArray) => {
  const scrapedJSON = [];

  for (let i = 0; i < jsonArray.length; i++) {
    let file = jsonArray[i];
    scrapedJSON.push(readFileAsync(file, 'utf8').then(buff => buff.toString()));
  }

  return Promise.all(scrapedJSON).then((results) => {
    const shortNames = [];
    for (let i = 0; i < results.length; i++) {
      let file = JSON.parse(results[i]);
      let m = findProp(file, "shortName").then((res => {
        shortNames.push(res);
      }));
    }
    return shortNames;
  })
}

// get JSON files and their shortNames
const main = async () => {
  const jsonFiles = await walk('./products');
  const shortNames = await getShortNames(jsonFiles);
  return (function flattenDeep(shortNames) {
    return shortNames.reduce((acc, val) => Array.isArray(val) ? acc.concat(flattenDeep(val)) : acc.concat(val), []);
  })(shortNames);
};

// add CMR search string for query
const jsonLinkMaker = main().then(results => {
  return results.map(shortName => {
    return `https://cmr.earthdata.nasa.gov/search/granules.json?shortName=${shortName}&temporal=1970-01-01T21%3A00%3A00.000Z%2C2018-05-11T02%3A59%3A59.000Z&pageSize=1`;
  });
});

module.exports = jsonLinkMaker;