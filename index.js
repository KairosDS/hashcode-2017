'use estrict';
const path = require('path');
const fs = require('fs');
const parser = require('./lib/parser');
const score = require('./lib/score')
const knapsack = require('./lib/knapsack');

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
    .then((data) => {
      fs.writeFile('test', JSON.stringify(data, null, 2));
      return data;
    })
    .then(score)
    .then((data) => data.caches.map((cache, cacheId) => knapsack(cache, data.size)))
    .then(parser.outputFile)
    .then(saveFile.bind(this, output))
    .catch(console.error.bind(console));
};

parseInput(options.input, options.output || options.input.replace('.in', '.out'));
