import Validator from './validator';
import log from './log';
import { DATA_NAMES } from './constants';
import TokenInfoModel from './models/TokenInfo';

const initStore = {
  paymentAddress: '',
  deviceId: '',
  tokenInfo: {},
  supportedTokenList: [],
  extraData: {},
  pendingRequestTxs: {},
};

let LISTENERS = {};
let store;

export function setListener(key, callback) {
  new Validator('listener key', key)
    .required()
    .string()
    .inList(Object.values(DATA_NAMES));
  new Validator('listener callback', callback).required().function();

  LISTENERS[key] = callback;

  log('[LISTENER CHANGES]', key);
}

function isObjectParamsEqual(obj1, obj2, fields) {
  obj1 = obj1 || {};
  obj2 = obj2 || {};
  return fields && fields.every((field) => obj1[field] === obj2[field]);
}

function createStore() {
  return new Proxy(
    { ...initStore },
    {
      set: function (obj, prop, value) {
        let _value;
        let listener;

        switch (prop) {
        case 'paymentAddress':
          new Validator('paymentAddress', value).required().paymentAddress();
          _value = value;
          // nothing has changed
          if (_value === obj[prop]) {
            return true;
          } else {
            listener = LISTENERS[DATA_NAMES.PAYMENT_ADDRESS];
          }

          break;

        case 'tokenInfo':
          new Validator('tokenInfo', value).required();
          _value = new TokenInfoModel(value);

          // nothing has changed
          if (
            isObjectParamsEqual(_value, obj[prop], [
              'name',
              'symbol',
              'id',
              'pDecimals',
              'balance',
              'nanoBalance',
            ])
          ) {
            return true;
          } else {
            listener = LISTENERS[DATA_NAMES.TOKEN_INFO];
          }

          break;
        case 'deviceId':
          new Validator('deviceId', value).required().deviceId();
          _value = value;

          // nothing has changed
          if (_value === obj[prop]) {
            return true;
          } else {
            listener = LISTENERS[DATA_NAMES.DEVICE_ID];
          }
          break;
        case 'supportedTokenList':
          if (!(value instanceof Array)) {
            throw new TypeError(
              `supportedTokenList must be an array, found ${JSON.stringify(
                value
              )}`
            );
          }

          _value = value.map(
            (token) => new TokenInfoModel(token, { simple: true })
          );

          // nothing has changed
          if ((_value && _value.length) === (obj[prop] && obj[prop].length)) {
            return true;
          } else {
            listener = LISTENERS[DATA_NAMES.LIST_TOKEN];
          }

          break;
        case 'extraData':
          new Validator('extraData', value).required().object();
          _value = value;

          // nothing has changed
          if (isObjectParamsEqual(_value, obj[prop], ['userId'])) {
            return true;
          } else {
            listener = LISTENERS[DATA_NAMES.EXTRA_DATA];
          }
          break;
        case 'pendingRequestTxs':
          _value = value;
          // nothing has changed
          if (_value === obj[prop]) {
            return true;
          } else {
            listener = LISTENERS[DATA_NAMES.TX_PENDING_RESULT];
          }
          break;
        default:
          break;
        }
        obj[prop] = _value;
        log('[STORE CHANGES]', prop, '=', _value);
        if (typeof listener === 'function') {
          listener(_value);
        }

        return true;
      },
    }
  );
}

export function getStore() {
  if (!store) {
    store = createStore();
  }

  return store;
}

export function resetStore() {
  store = createStore();
}

export default store;
