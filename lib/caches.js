/**
 * Return savings for each endpoint given a video
 * @return array like [[{savings: number, cacheId: number}, {savings: 4, cacheId: 17}], ...]
 */

var cache = {};

module.exports = function getVideoCaches(data) {

  return data.videoRequests.reduce((acc, item) => {

    let endpointObj = data.endpoints[item.endpoint];
    for (let cacheId in endpointObj.caches) {
      let mi = {};
      mi.video = item.video;
      mi.endpoint = item.endpoint;
      mi.request = item.requests;

      mi.size = data.videos[item.video];
      mi.saving = endpointObj.latency / endpointObj.caches[cacheId];
      acc[cacheId] = (acc[cacheId] || []).concat(mi);
    };
    return acc;
  }, {});
};
