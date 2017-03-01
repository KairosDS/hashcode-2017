module.exports = (data, timeSaved) => {
  //console.log(timeSaved);
  var r = [];
  var vr = data.videoRequests;
  var a = [];
  vr.forEach(function(o,i){ r[o.video] = o.requests; });


  data.cacheSize = 100;
  var cacheSize = data.cacheSize;
  

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

  for(let i=0; i<timeSaved.length; i++) {
    let x = timeSaved[i].score.reduce((acc,itm) => acc || itm.length !== 0, false);
    if (x) {
      a.push(timeSaved[i].score);
    }
  }
console.log(a);

var str = "";
data.endpoints.forEach( (itm ,i) => { 
  var z = data.videoRequests.filter(item=>item.endpoint === i);
  var result = hastaloshuevos(z);
  console.log('a',a[i], i);
  var kkk = a[i][0];
  console.log('kkk',kkk);
  var ma = Math.max(...kkk);
  console.log('ma',ma);
  var im = kkk.indexOf(ma);
  console.log('im',im);
  str += "" + i + " " + result[im].videos.toString().replace(',', ' ') + "\n";
  a[im] = 0;
});
console.log(str);


function hastaloshuevos(a) {
 var score = [];
  for(let i=0; i<a.length; i++) {
    var n = data.videos[a[i].video]
    a[i].requests = a[i].requests || 0;
    if ( n <= cacheSize ) {
      score.push({videos: a[i].video, size: n*a[i].requests, });
    }
  }

  for(let i=0; i<a.length; i++) {
    for(let j=0; j<a.length; j++) {
      if ( i !== j ) {
        var n = data.videos[a[i].video];
        var m = data.videos[a[j].video];
        if ( n + m <= cacheSize ) {
          let index = [a[i].video,a[j].video].sort();
          score.push({videos: index, size: n*a[i].requests+m*a[j].requests});
        }
      }
    }
  }


  var s = removeDuplicates(score, 'videos');

  scoreSorted = s.sort(function(a,b) {
      return a.size - b.size;
  });

  return scoreSorted.reverse();
}



//console.log(scoreSorted);
  //return scoreSorted;
}
