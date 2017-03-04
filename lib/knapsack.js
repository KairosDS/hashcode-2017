'use strict';

function knapsack(items, capacity) {
  var bag = items
  // sort items by most value per decagram first
  .sort(function (item1, item2) {
    var item1ValuePerWeight = item1.score / item1.size;
    var item2ValuePerWeight = item2.score / item2.size;
    return item1ValuePerWeight < item2ValuePerWeight ? 1 : -1;
  })
  // push items in the bag as long as the weight doesn't exceed 400 decagrams
  .reduce(function (bag, item) {
    var currentBagWeight = bag.reduce(function (weight, item) {
      weight += item.size;
      return weight;
    }, 0);
    if (currentBagWeight + item.size < capacity) {
      bag.push(item);
    }
    return bag;
  }, []);
  return {
    // compute bag value
    value: bag.reduce(function (value, item) {
      value += item.score;
      return value;
    }, 0),
    // compute bag weight
    weight: bag.reduce(function (weight, item) {
      weight += item.size;
      return weight;
    }, 0),
    set: bag
  };
};

module.exports = knapsack;
