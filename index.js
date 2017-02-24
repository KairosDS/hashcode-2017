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
}]);

function saveFile(output, data) {
  const pathParsed = path.parse(output);
  if (!fs.existsSync(pathParsed.dir)){
    fs.mkdirSync(pathParsed.dir);
  }
  data = JSON.stringify(data);
  return new Promise(function (success, reject) {
    fs.writeFile(output, data, (err) => {
      if (err) reject(err);
      success(output);
    });
  });i}

function parseInput(input, output) {
  const time = new Date();
  parser.parseFile(input)
    .then(function(data) {
      if (output) {
        saveFile(output, data).then(function(){
          const processTime = new Date() - time;
          console.log(`${output} processed in ${processTime} ms.`);
        })
       }
    })
    .catch(console.error.bind(console));
}
console.log(options);
parseInput(options.input, options.output);
