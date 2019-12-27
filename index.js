import {
  checkSDKCompatible,
  onPaymentAddressChange,
  onSupportedTokenListChange,
  onTokenInfoChange,
  onExtraInfoChange,
  changePrivacyTokenById,
  setListSupportTokenById,
  requestSendTx,
  _setData
} from './src/sdk';
import { getStore, resetStore } from './src/base/store';
import Validator from './src/base/validator';
import { DATA_NAMES, COMMANDS, SUPPORTED_TOKEN } from './src/base/constants';
import { ERROR_CODE, sdkError } from './src/base/error';

if (window && !window.pappSdk) {
  window.pappSdk = {
    _setData
  };
}

export default {
  checkSDKCompatible,
  onPaymentAddressChange,
  onSupportedTokenListChange,
  setListSupportTokenById,
  onTokenInfoChange,
  onExtraInfoChange,
  changePrivacyTokenById,
  requestSendTx,
  getStore,
  resetStore,
  Validator,
  DATA_NAMES,
  COMMANDS,
  ERROR_CODE,
  SUPPORTED_TOKEN,
  sdkError,
  _setData
};