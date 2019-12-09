import SDK from 'papp-sdk';
/**
 * 
 * SDK methods & constants
 * 
 * checkSDKCompatible
 * onPaymentAddressChange
 * onSupportedTokenListChange
 * onTokenInfoChange
 * changePrivacyTokenById
 * requestSendTx
 * Validator
 * ERROR_CODE
 */

export const { ERROR_CODE, SUPPORTED_TOKEN } = SDK;

// call this method as soon as posible
export function onSupportedTokenListChange(handler) {
  SDK.onSupportedTokenListChange(handler);
}

// call this method as soon as posible
export function onTokenInfoChange(handler) {
  SDK.onTokenInfoChange(handler);
}

// call this method as soon as posible
export function onPaymentAddressChange(handler) {
  SDK.onPaymentAddressChange(handler);
}

export function requestSendTx(toAddress, nanoAmount, symbol) {
  return SDK.requestSendTx(toAddress, nanoAmount, `[Rolldice] bet ${nanoAmount} nano ${symbol}`);
}

export function setSupportTokens() {
  SDK.setListSupportTokenById([/* SUPPORTED_TOKEN.pETH, SUPPORTED_TOKEN.pBTC, your_custom_token_id,.. */]);
}
