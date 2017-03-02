/**
 * Return savings for each endpoint given a video
 * @return array like [[{savings: number, cacheId: number}, {savings: 4, cacheId: 17}], ...]
 */

var cache = {};

module.exports = function getVideoCaches(data) {

  return data.videoRequests.reduce((acc, item) => {
    let endpointObj = data.endpoints[item.endpoint];
    for (let cacheId in endpointObj.caches) {
      item.size = data.videos[item.video];
      item.saving = Math.random() + '||' + (endpointObj.latency / endpointObj.caches[cacheId]); //this not work! some reference is involved
      console.log(cacheId,'>>', item);
      acc[cacheId] = (acc[cacheId] || []).concat(item);
    };
    return acc;
  }, {});
};
