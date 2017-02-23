'use estrict';

function Parser() {
  this.data = {
    summary: {},
    videos: {},
    endpoints: {},
    caches: 0,
    videoRequests: []
  };
};

Parser.prototype.parseFile = function(file) {
  return new Promise(function (success, reject) {
    require('fs').readFile(file, function(err, data) {
      if (err) reject(err);
      this.lines = data.toString().split('\n');
      this.init(this.lines[0]);
      this.parseVideosLine(this.lines[1]);
      const endpointsLineStart = 2;
      this.parseEndpoints(0, endpointsLineStart, this.data.summary.endpoints);
      const videoRequestsLineStart = endpointsLineStart + this.data.summary.endpoints + this.data.summary.caches;
      this.parseVideoRequests(0, videoRequestsLineStart)
      success(this.data);
    }.bind(this));
  }.bind(this));
}

Parser.prototype.getLineDataAsNumber = function(data) {
  return data.split(' ').map(function(value){
    return Number(value);
  });
}

Parser.prototype.init = function(data) {
  data = data.split(' ');
  this.data.summary.videos = data[0];
  this.data.summary.endpoints = data[1];
  this.data.summary.videoRequests = data[2];
  this.data.summary.caches = data[3];
  this.data.cacheSize = data[4];
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

Parser.prototype.parseVideRequestLine = function(data, videoRequest) {
  data = data.split(' ');
  this.data.videoRequests[videoRequest] = {
    video: data[0],
    endpoint: data[1],
    requests: data[2],
  };
}

Parser.prototype.parseEndpoints = function(endpoint, nextEndpointLine, endpointsLeft) {
  if (endpointsLeft) {
    this.parseEndpointLine(this.lines[nextEndpointLine], endpoint);
    let cachesLeft = this.data.endpoints[endpoint].cacheLength;
    this.parseCaches(endpoint, ++nextEndpointLine, cachesLeft)
    nextEndpointLine += cachesLeft;
    this.parseEndpoints(++endpoint, nextEndpointLine, --endpointsLeft);
  }
};

Parser.prototype.parseCaches = function(endpoint, start, length) {
  if (length) {
    this.parseCacheLine(this.lines[start++], endpoint);
    this.parseCaches(endpoint, start, --length);
  }
};

Parser.prototype.parseVideoRequests = function(videoRequest, line) {
  if(this.lines[line]) {
    this.parseVideRequestLine(this.lines[line++], videoRequest++)
    this.parseVideoRequests(videoRequest, line);
  }
};

module.exports = new Parser();