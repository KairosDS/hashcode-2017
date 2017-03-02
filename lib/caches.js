/**
 * Return savings and requests for each cache
 * @return object like {cacheId: [{saving: number, videoRequestId: number}]}
 */
module.exports = function getVideoCaches(data) {

  return data.videoRequests.reduce((acc, request, requestId) => {
    let endpointObj = data.endpoints[request.endpoint];
    for (let cacheId in endpointObj.caches) {
      acc[cacheId] = (acc[cacheId] || []).concat({videoRequestId: requestId, saving: endpointObj.latency / endpointObj.caches[cacheId]});
    };
    return acc;
  }, {});
};
