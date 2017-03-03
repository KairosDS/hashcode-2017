/**
 * Return savings and requests for each cache
 * @return object like {cacheId: [{saving: number, videoRequestId: number}]}
 */
module.exports = function getVideoCaches(data) {

  return data.videoRequests.reduce((acc, request, requestId) => {
    let endpointObj = data.endpoints[request.endpoint];
    for (let cacheId in endpointObj.caches) {
      let saving = (endpointObj.latency - endpointObj.caches[cacheId]) / endpointObj.latency;
      let totalSize = data.videos[request.video] * request.requests;
      acc[cacheId] = (acc[cacheId] || []).concat(
        {
          videoRequestId: requestId,
          score: totalSize * saving
        }
      );
    };
    return acc;
  }, {});
};
