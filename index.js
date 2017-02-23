'use estrict';

const options = require('command-line-args')(
  {
    name: 'input',
    type: String,
    multiple: false,
    defaultOption: true
  }
);

require('./lib/parser').parseFile(options.input)
  .catch(function(error){
    console.error(error);
  })
  .then(function(data){
    const filename = options.input
      .replace('data/', 'data_parsed/')
      .replace('.in', '.json')
    console.log(filename);
    require('fs').writeFile(filename, JSON.stringify(data, null, 2), (err) => {
      if (err) console.error(err);
      console.log('It\'s saved!');
    });
  });