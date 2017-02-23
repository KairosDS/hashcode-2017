var data = {
  "videos": [50, 50, 80, 30, 100],
  "endpoints": [{
      "latency": 1000,
      "caches": [100, 300, 200]
    }, {
      "latency": 500,
      "caches": {}
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
};

var r = [];
var vr = data.videoRequests;
vr.forEach(function(o,i){ r[o.video] = o.requests; });

var a = data.videos;
var cacheSize = 100;
var score = [];

function removeDuplicates(originalArray, prop) {
     var newArray = [];
     var lookupObject  = {};

     for(var i in originalArray) {
        lookupObject[originalArray[i][prop]] = originalArray[i];
     }

     for(i in lookupObject) {
         newArray.push(lookupObject[i]);
     }
      return newArray;
}

for(let i=0; i<a.length; i++) {
  var n = a[i];
  r[i] = r[i] || 0;
  if ( n <= cacheSize ) {
    score.push({videos: 'v'+i, size: n*r[i], });
    console.log('video ' + i + '(' + n + ')');
  }
}

for(let i=0; i<a.length; i++) {
  for(let j=0; j<a.length; j++) {
    if ( i !== j ) {
      var n = a[i];
      var m = a[j];
      if ( n + m <= cacheSize ) {
        let index = [i,j].sort();
        score.push({videos: 'v'+index, size: n*r[i]+m*r[j]});
        console.log('videos ' + i + ',' + j + '(' + (n+m) + ')');
      }
    }
  }
}

for(let i=0; i<a.length; i++) {
  for(let j=0; j<a.length; j++) {
    for(let k=0; k<a.length; k++) {
      if ( i !== j && i !== k && j !== k ) {
        var n = a[i];
        var m = a[j];
        var o = a[k];
        if ( n + m + o <= cacheSize ) {
          let index = [i,j,k].sort();
          score.push({videos: 'v'+index, size: n*r[i]+m*r[j]+o*r[k]});
          console.log('videos ' + i + ',' + j + ',' + k + '(' + (n+m+o) + ')');
        }
      }
    }    
  }
}

var s = removeDuplicates(score, 'videos');

scoreSorted = s.sort(function(a,b) {
    return a.size - b.size;
});

console.log(scoreSorted);