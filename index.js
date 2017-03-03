'use estrict';
const path = require('path');
const fs = require('fs');
const parser = require('./lib/parser');

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

function saveFile(output, data, prettify) {
  const pathParsed = path.parse(output);
  if (!fs.existsSync(pathParsed.dir)){
    fs.mkdirSync(pathParsed.dir);
  }
  if (prettify) {
    data = JSON.stringify(data, null, 2);
  } else {
    data = JSON.stringify(data);
  }
  return new Promise(function (success, reject) {
    fs.writeFile(output, data, (err) => {
      if (err) reject(err);
      success(output);
    });
  });
};

function parseInput(input, output, prettify) {
  const time = new Date();
  parser.parseFile(input)
    .then(function(data) {
      if (output) {
        saveFile(output, data, prettify).then(function(){
          const processTime = new Date() - time;
          console.log(`${output} processed in ${processTime} ms.`);
        })
      }
      return data;
    })
    .then(data => {
      console.log('caches >>>>',require('./lib/score')(data));
    })
    .catch(console.error.bind(console));
};
console.log(options);
parseInput(options.input, options.output, options.prettify);
