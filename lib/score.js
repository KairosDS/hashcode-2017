/**
 * Return savings for each endpoint given a video
 * @return array like [[savings-0], [savings-1], ...]
 */
function getScores(data, video) {
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
    var endpoint = data.endpoints[item.endpoint]
    // {
    //   "latency": 1000,
    //   "caches": [100, 300, 200]
    // }
    acc[item.endpoint] = endpoint.caches.map((item, i) => (endpoint.latency - endpoint.caches[i]))
    //[[1000-100, 1000-300, 1000-200]] ===> savings from endpoint 0 (no requested from endpoint 1)
    // other [,[3,5,6]] ===> savings from endpoint 1 (no requested from enpoint 0)
    return acc;
  //}, data.endpoints.map(i => []));
  }, []);
};
