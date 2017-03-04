'use estrict';
const path = require('path');
const fs = require('fs');
const parser = require('./lib/parser');
const score = require('./lib/score')
const knapsack = require('./lib/knapsack');
const VIDEOS_TO_RESCORING = 10;

const options = require('command-line-args')([{
  name: 'input',
  alias: 'i',
  type: String,
  multiple: false,
  defaultOption: true
}, {
  name: 'output',
  alias: 'o',
  type: String,
  multiple: false,
  defaultOption: false
}, {
  name: 'prettify',
  alias: 'p',
  type: Boolean
}]);

function saveFile(output, data) {
  const pathParsed = path.parse(output);
  if (!fs.existsSync(pathParsed.dir)){
    fs.mkdirSync(pathParsed.dir);
  }
  return fs.writeFile(output, data);
};

function parseInput(input, output) {
  const time = new Date();
  parser.parseFile(input)
    .then(data => {
      fs.writeFile('test', JSON.stringify(data, null, 2));
      return data;
    })
    .then(score)
    .then(data => data.caches.map((cache, cacheId) =>
      {
        var c =  knapsack(cache, data.size);
        process.stdout.write('Rescoring cache ' + cacheId + '/' + data.caches.length + '\r');
        var  until = Math.min(VIDEOS_TO_RESCORING, c.set.length);
        for (var set = 0; set < until; set++) {
          var videoId = c.set[set].videoId;
          var endpoints = c.set[set].endpoints
          for (let cac = cacheId + 1; cac < data.caches.length; cac = cac*2) {
            let cache = data.caches[cac];
            if (cache[videoId]) {
              var shared = cache[videoId].endpoints.some(i => endpoints.includes(i));
              if (shared) {
                //console.log('scored of video ', videoId, 'fall from ', cache[videoId].score ,'to', cache[videoId].score/2)
                cache[videoId].score = cache[videoId].score/2;
              }
            }
          }
        }
        return c;
      }
    ))
    .then(parser.outputFile)
    .then(saveFile.bind(this, output))
    .catch(console.error.bind(console));
};

parseInput(options.input, options.output || options.input.replace('.in', '.out'));
