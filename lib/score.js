/**
 * Return savings for each endpoint given a video
 * @return array like [[{savings: number, cacheId: number}, {savings: 4, cacheId: 17}], ...]
 */

var cache = {};

module.exports = function getScores(data, video) {
  //video = 3
  return data.videoRequests
  // [{
  //   "video": 3,
  //   "endpoint": 0,
  //   "requests": 1500
  // }, {
  //   "video": 0,
  //   "endpoint": 1,
  //   "requests": 1000
  // }, {
  //   "video": 4,
  //   "endpoint": 0,
  //   "requests": 500
  // }, {
  //   "video": 1,
  //   "endpoint": 0,
  //   "requests": 1000
  // }]
  .filter(item => item.video === video)
  // [{
  //   "video": 3,
  //   "endpoint": 0,
  //   "requests": 1500
  // }]
  .reduce((acc,item) => {
    var endpoint = data.endpoints[item.endpoint];
    // {
    //   "latency": 1000,
    //   "caches": {0: 100, 1: 300, 2: 200}
    // }
    acc[item.endpoint] = [];
    Object.keys(endpoint.caches).forEach((id) => {
      var key = item.endpoint + '-' + id;
      acc[item.endpoint][id] = cache[key] ? cache[key] : cache[key] = endpoint.latency/endpoint.caches[id]
    });

    // acc[item.endpoint] = Object.keys(endpoint.caches).map((id) => {
    //   var key = item.endpoint + '-' + id;
    //   return cache[key] ? cache[key] : cache[key] = {saving: endpoint.latency/endpoint.caches[id], cacheId: id};
    // });
    //[[{saving: 1000/100, cacheId: 0}, {saving: 1000/300, cacheId: 1}, {saving: 1000/200, cacheId: 2}]] ===> savings from endpoint 0 (no requested from endpoint 1)
    // other [,[{saving: 2000/50, cacheId: 4}, {saving: 2000/600, cacheId: 2}, {saving: 2000/100, cacheId: 1}]] ===> savings from endpoint 1 (no requested from enpoint 0)
    return acc;
  //}, data.endpoints.map(i => []));
  }, []);
};
