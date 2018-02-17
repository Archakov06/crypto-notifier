import fetch from 'node-fetch';
import map from 'lodash/map';
import find from 'lodash/find';
import differenceBy from 'lodash/differenceBy';

const getTicker = (currency, arr) =>
  fetch(`https://api.coinmarketcap.com/v1/ticker/${currency}/`)
    .then(response => response.json())
    .then(json => arr.push(json[0]));

const getReached = (prices, arr) =>
  arr.map(o => ({
    name: o.name,
    id: o.id,
    reached:
      parseFloat(o.price_usd) >= parseFloat(find(prices, { id: o.id }).max),
    max: parseFloat(o.price_usd)
  }));

const makePromises = (currencies, arr) =>
  currencies.map(currency => getTicker(currency, arr));

const checkPrices = (prices, arr, callback) => {
  const promises = makePromises(prices.map(o => o.id), arr);
  Promise.all(promises).then(() => {
    const result = getReached(prices, arr);
    callback(result);
  });
};

const updateMaxPrice = (data, newData, callback) => {
  return map(data, o => {
    const newObj = find(newData, { id: o.id });
    if (o.id === newObj.id && newObj.reached) {
      o.max = newObj.max;
      if (callback) {
        callback(newObj);
      }
    }
    return o;
  });
};

export {
  getTicker,
  getReached,
  makePromises,
  checkPrices,
  updateMaxPrice,
  map,
  find
};
