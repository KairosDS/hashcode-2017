let score = require('./lib/score');
let prc = require('./lib/process');

let data;
// llamada al parser

data = {
  "videos": [50, 50, 80, 30, 100],
  "endpoints": [{
      "latency": 1000,
      "caches": [100, 300, 200]
    }, {
      "latency": 500,
      "caches": []
    }
  ],
  "videoRequests": [{
    "video": 3,
    "endpoint": 0,
    "requests": 1500
  }, {
    "video": 0,
    "endpoint": 1,
    "requests": 1000
  }, {
    "video": 4,
    "endpoint": 0,
    "requests": 500
  }, {
    "video": 1,
    "endpoint": 0,
    "requests": 1000
  }]
}


let s = score(data, 0);

let timeSaved = data.videos.map((val, idx) => {
  //console.log(idx, score(data, idx));
  return {size: val, score: score(data, idx)};
});

let p = prc(data, timeSaved);

//console.log(p);
