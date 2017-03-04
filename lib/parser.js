'use estrict';

function Parser() {
  this.data = {
    summary: {},
    videos: {},
    endpoints: {},
    videoRequests: []
  };
};

Parser.prototype.parseFile = function(file) {
  return new Promise(function (success, reject) {
    require('fs').readFile(file, function(err, data) {
      if (err) reject(err);
      const time = new Date();
      this.lines = data.toString().split('\n');
      this.init(this.lines[0]);
      this.parseVideosLine(this.lines[1]);
      const endpointsLineStart = 2;
      this.parseVideoRequests(this.parseEndpoints(0, endpointsLineStart, this.data.summary.endpoints));
      const parseTime = new Date() - time;
      console.log(`${file} parsed in ${parseTime} ms.`);
      success(this.data);
    }.bind(this));
  }.bind(this));
}

Parser.prototype.getLineDataAsNumber = function(data) {
  return data.split(' ').map(Number);
}

Parser.prototype.init = function(data) {
  data = this.getLineDataAsNumber(data);
  this.data.summary.videos = data[0];
  this.data.summary.endpoints = data[1];
  this.data.summary.videoRequests = data[2];
  this.data.summary.caches = data[3];
  this.data.summary.cacheSize = data[4];
};

Parser.prototype.parseVideosLine = function(data) {
  this.data.videos = this.getLineDataAsNumber(data);
};

Parser.prototype.parseEndpointLine = function(data, endpoint) {
  data = this.getLineDataAsNumber(data);
  const endpointData = {
    latency: data[0],
    cacheLength: data[1],
    caches: {}
  };
  this.data.endpoints[endpoint] = endpointData;
};

Parser.prototype.parseCacheLine = function(data, endpoint) {
  data = data.split(' ');
  this.data.endpoints[endpoint].caches[data[0]] = data[1];
};

Parser.prototype.parseVideRequestLine = function(data) {
  data = data.split(' ');
  this.data.videoRequests.push({
    video: data[0],
    endpoint: data[1],
    requests: Number(data[2]),
  });
}

Parser.prototype.parseEndpoints = function(endpoint, start, length) {
  if (length) {
    this.parseEndpointLine(this.lines[start], endpoint);
    let cachesLeft = this.data.endpoints[endpoint].cacheLength;
    this.parseCaches(endpoint, ++start, cachesLeft)
    start += cachesLeft;
    return this.parseEndpoints(++endpoint, start, --length);
  } else {
    return start;
  }
};

Parser.prototype.parseCaches = function(endpoint, start, length) {
  if (length) {
    this.parseCacheLine(this.lines[start++], endpoint);
    process.nextTick(function(){
      this.parseCaches(endpoint, start, --length);
    }.bind(this));
  }
};

Parser.prototype.parseVideoRequests = function(line) {
  const total = this.lines.length;
  if(line < total && this.lines[line]) {
    this.parseVideRequestLine(this.lines[line++]);
    process.nextTick(function(){
      this.parseVideoRequests(line);
    }.bind(this));
  }
};

Parser.prototype.outputFile = function(data) {
  let result = [data.length];
  let cacheResult;
  for (let cacheId = 0; cacheId < data.length; cacheId++) {
    cacheResult = data[cacheId].set.map((video) => video.videoId);
    cacheResult.unshift(cacheId);
    result.push(cacheResult.join(' '));
  }
  return result.join('\n');
}

module.exports = new Parser();
