/**
 * Return savings and requests for each cache
 * @return object like {cacheId: {videoId: {saving: number, videoRequestId: number}, ...}}
 */
module.exports = function getVideoScoresAtCaches(data) {

  return data.videoRequests.reduce((acc, request, requestId) => {
    let endpointObj = data.endpoints[request.endpoint];
    for (let cacheId in endpointObj.caches) {
      let saving = (endpointObj.latency - endpointObj.caches[cacheId]) / endpointObj.latency;
      let totalSize = data.videos[request.video] * request.requests;
      if (data.videos[request.video] < data.summary.cacheSize) {
        if (!acc.caches[cacheId]) {
          acc.caches[cacheId] = [];
        }
        if (!acc.caches[cacheId][request.video]) {
          acc.caches[cacheId][request.video] = {
            videoId: request.video,
            size: data.videos[request.video],
            endpoints: [request.endpoint],
            //videoRequestId: requestId,
            score: totalSize * saving
          };
        } else { //beter? go in.
          let videoCached = acc.caches[cacheId][request.video];
          videoCached.endpoints = videoCached.endpoints.concat(request.endpoint);
          let score = totalSize * saving;
          let oldScore = videoCached.score;
          if (score > oldScore) {
            videoCached.score = score;
          }
        }
      }
    }
    return acc;
  }, {
    caches: [],
    size: data.summary.cacheSize
  });
};
