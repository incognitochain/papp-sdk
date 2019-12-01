import SDK from 'papp-sdk';
/**
 * 
 * SDK methods & constants
 * 
 * checkSDKCompatible
 * onPaymentAddressChange
 * onSupportedTokenListChange
 * onTokenInfoChange
 *  changePrivacyTokenById
 *  requestSendTx
 *  store
 *  Validator
 *  DATA_NAMES
 *  COMMANDS
 *  _setData
 */

export function onSupportedTokenListChange(handler) {
  SDK.onSupportedTokenListChange(handler);
}

export function onTokenInfoChange(handler) {
  SDK.onTokenInfoChange(handler);
}

export function onPaymentAddressChange(handler) {
  SDK.onPaymentAddressChange(handler);
}

export function requestSendTx(toAddress, nanoAmount, symbol) {
  return SDK.requestSendTx(toAddress, nanoAmount, `[Rolldice] bet ${nanoAmount} nano ${symbol}`);
}