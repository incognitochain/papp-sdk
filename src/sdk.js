import { setListener, getStore } from './base/store';
import Validator from './base/validator';
import log, { logError } from './base/log';
// import { sdkError, ERROR_CODE } from './base/error';
import { DATA_NAMES, COMMANDS } from './base/constants';

// keep request txs id to track tx status
const pendingRequestTxs = {};

export function onTokenInfoChange(callback) {
  setListener(DATA_NAMES.TOKEN_INFO, callback);
}

export function onPaymentAddressChange(callback) {
  setListener(DATA_NAMES.PAYMENT_ADDRESS, callback);
}

export function onSupportedTokenListChange(callback) {
  setListener(DATA_NAMES.LIST_TOKEN, callback);
}

export function onExtraInfoChange(callback) {
  setListener(DATA_NAMES.EXTRA_DATA, callback);
}


export function checkSDKCompatible() {
  if (typeof window !== 'undefined' && window.ReactNativeWebView && window.ReactNativeWebView) {
    return true;
  }
  return false;
}

export function __sendCommand(command, data) {
  new Validator('__sendCommand command', command).required().string();
  new Validator('__sendCommand data', data).object();
  new Validator('window.ReactNativeWebView.postMessage', window.ReactNativeWebView.postMessage).required().function();

  let payload = `${command}|${JSON.stringify(data)}`;

  if (payload) {
    window.ReactNativeWebView.postMessage(payload);
    log('[SEND COMMAND]', command, data);
  } else {
    logError('[SEND COMMAND] failed', command, data);
  }
}

export function _genPendingTxId(_id) {
  new Validator('_id', _id).string();

  let id = _id || Date.now();
  // existed, must create new id
  if (pendingRequestTxs[id]) {
    id = _genPendingTxId(id + 1);
  }

  if (!id) throw new Error('Can not generate ID for sending TX');

  return String(id);
}

export function changePrivacyTokenById (tokenID) {
  new Validator('tokenID', tokenID).required().string();

  __sendCommand(COMMANDS.SELECT_PRIVACY_TOKEN_BY_ID, { tokenID });
}

export function setListSupportTokenById(tokenIds) {
  new Validator('tokenIds', tokenIds).required().array();

  __sendCommand(COMMANDS.SET_LIST_SUPPORT_TOKEN_BY_ID, { tokenIds });
}

export function requestSendTx({ receivers, info }) {
  new Validator('info', info).string();
  new Validator('receivers', receivers).required().receivers();

  const pendingTxId = _genPendingTxId();
  return new Promise((resolve, reject) => {
    // // request timeout in 5 mins
    // const timeout = setTimeout(() => {
    //   delete pendingRequestTxs[pendingTxId];
    //   reject(sdkError(ERROR_CODE.REQUEST_SEND_TX_TIMEOUT, 'Request send TX timeout'));
    // }, 5 * 60 * 1000);
    __sendCommand(COMMANDS.SEND_TX, { pendingTxId, receivers, info });
    pendingRequestTxs[pendingTxId] = { resolve, reject, /* timeout */ };
  });
}

export function requestSingleSendTx(toAddress, nanoAmount, info) {
  new Validator('toAddress', toAddress).required().paymentAddress();
  new Validator('nanoAmount', nanoAmount).required().nanoAmount();
  new Validator('info', info).string();

  const pendingTxId = _genPendingTxId();
  return new Promise((resolve, reject) => {
    __sendCommand(COMMANDS.SINGLE_SEND_TX, { pendingTxId, toAddress, amount: nanoAmount, info });
    pendingRequestTxs[pendingTxId] = { resolve, reject, /* timeout */ };
  });
}

// Post event to Client
export function requestOpenCameraQRCode () {
  __sendCommand(COMMANDS.REQUEST_OPEN_CAMERA_QR_CODE, {});
}

export function _setData(name, data) {
  switch(name) {
  case DATA_NAMES.TOKEN_INFO:
    getStore().tokenInfo = data;
    break;
  case DATA_NAMES.PAYMENT_ADDRESS:
    getStore().paymentAddress = data;
    break;
  case DATA_NAMES.TX_PENDING_RESULT:
    // data: { pendingTxId: string, data: { txID: string }, error: { code: number, message: string } }
    if (data.pendingTxId && pendingRequestTxs[data.pendingTxId]) {
      // if (pendingRequestTxs[data.pendingTxId].timeout) {
      //   clearTimeout(pendingRequestTxs[data.pendingTxId].timeout);
      // }

      // success
      if (data.data) {
        pendingRequestTxs[data.pendingTxId].resolve(data.data);
      }

      // error
      if (data.error) {
        pendingRequestTxs[data.pendingTxId].reject(data.error);
      }

      delete pendingRequestTxs[data.pendingTxId];
    }
    break;
  case DATA_NAMES.LIST_TOKEN:
    getStore().supportedTokenList = data;
    break;
  case DATA_NAMES.EXTRA_DATA:
    getStore().extraData = data;
    break;
  default:
    return;
  }
}