'use estrict';
const path = require('path');
const fs = require('fs');
const parser = require('./lib/parser');
const options = require('command-line-args')(
  {
    name: 'input',
    type: String,
    multiple: false,
    defaultOption: true
  }
);

function saveFile(inputFile, data) {
  const pathParsed = path.parse(inputFile);
  const dir = pathParsed.dir.replace('data', 'data_parsed');
  if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
  }
  const filename = path.join(dir, pathParsed.name + '.json');
  data = JSON.stringify(data);
  return new Promise(function (success, reject) {
    fs.writeFile(filename, data, (err) => {
      if (err) reject(err);
      success(filename);
    });
  });
}

function parseInput(input) {
  const time = new Date();
  parser.parseFile(input)
    .then(function(data) {
      return saveFile(input, data);
    })
    .then(function(filename){
      const processTime = new Date() - time;
      console.log(`${filename} processed in ${processTime} ms.`);
    })
    .catch(console.error.bind(console));
}

parseInput(options.input);
