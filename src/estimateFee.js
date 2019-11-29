const { getEstimateFee, getEstimateFeeForPToken } = require('incognito-chain-web-js/build/wallet');
const Validator = require('./utils/validator');
const { getConfig } = require('./config');
const { getDefaultAccount } = require('./account');
const rpcClient = require('./rpc');
const log = require('./utils/log');

const CONFIGS = getConfig();
const defaultAccount = getDefaultAccount();

async function estimateFeeForSendingPRV({ paymentAddressSender, paymentAddressReceiver, amount, account = defaultAccount, rpc = rpcClient }) {
  new Validator('paymentAddressSender', paymentAddressSender).required().paymentAddress();
  new Validator('paymentAddressReceiver', paymentAddressReceiver).paymentAddress();
  new Validator('amount', amount).required().amount();
  new Validator('account', account).required().accountWallet();
  new Validator('rpc', rpc).required();

  log('estimateFeeForSendingPRV', arguments);

  const isPrivacyForNativeToken = true;
  const isPrivacyForPrivateToken = false;

  return getEstimateFee(
    paymentAddressSender,
    paymentAddressReceiver || paymentAddressSender,
    amount,
    account,
    isPrivacyForNativeToken,
    isPrivacyForPrivateToken,
    rpc
  );
}


async function estimateFeeForSendingPToken({
  paymentAddressSender,
  paymentAddressReceiver,
  amount,
  account = defaultAccount,
  rpc = rpcClient,
  isUsePTokenFee = false,
  tokenName,
  tokenSymbol,
  tokenId
}) {
  new Validator('paymentAddressSender', paymentAddressSender).required().paymentAddress();
  new Validator('paymentAddressReceiver', paymentAddressReceiver).paymentAddress();
  new Validator('amount', amount).required().amount();
  new Validator('account', account).required().accountWallet();
  new Validator('rpc', rpc).required();
  new Validator('isUsePTokenFee', isUsePTokenFee).required().boolean();
  new Validator('tokenName', tokenName).string();
  new Validator('tokenSymbol', tokenSymbol).string();
  new Validator('tokenId', tokenId).required().string();

  log('estimateFeeForSendingPToken', arguments);

  const isPrivacyForNativeToken = false;
  const isPrivacyForPrivateToken = true;
  const tokenObject = {
    Privacy: true,
    TokenID: tokenId,
    TokenName: tokenName || '',
    TokenSymbol: tokenSymbol || '',
    TokenTxType: CONFIGS.CustomTokenTransfer,
    TokenAmount: amount,
    TokenReceivers: {
      PaymentAddress: paymentAddressReceiver,
      Amount: amount
    }
  };
  const feeToken = 0;

  return getEstimateFeeForPToken(
    paymentAddressSender,
    paymentAddressReceiver || paymentAddressSender,
    amount,
    tokenObject,
    account,
    rpc,
    isPrivacyForNativeToken,
    isPrivacyForPrivateToken,
    feeToken,
    isUsePTokenFee
  );
}

module.exports = {
  estimateFeeForSendingPRV,
  estimateFeeForSendingPToken
};