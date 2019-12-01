import {
  checkSDKCompatible,
  onPaymentAddressChange,
  onSupportedTokenListChange,
  onTokenInfoChange,
  changePrivacyTokenById,
  requestSendTx,
  _setData
} from './src/sdk';
import store from './src/base/store';
import Validator from './src/base/validator';
import { DATA_NAMES, COMMANDS } from './src/base/constants';

if (window && !window.pappSdk) {
  window.pappSdk = {
    _setData
  };
}

export default {
  checkSDKCompatible,
  onPaymentAddressChange,
  onSupportedTokenListChange,
  onTokenInfoChange,
  changePrivacyTokenById,
  requestSendTx,
  store,
  Validator,
  DATA_NAMES,
  COMMANDS,
  _setData
};