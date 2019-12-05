const { getDefaultAccount } = require('./account');
const Validator = require('./utils/validator');
const log = require('./utils/log');
const { getConfig } = require('./config');

const CONFIGS = getConfig();

const defaultAccount = getDefaultAccount();

/**
 * Transfer TOKEN in Incognito chain, fee must be defined (PRV fee or TOKEN fee)
 * @param {array} receivers array of receivers. [ [receiverPaymentAddress1, receiverAmount1], [receiverPaymentAddress2, receiverAmount2] ]
 * @param {string} tokenName name of the TOKEN
 * @param {string} tokenSymbol symbol of the TOKEN
 * @param {string} tokenId id of the TOKEN
 * @param {number} feePRV fee for sending, in nano PRV (must be integer number)
 * @param {number} feePToken fee for sending, in nano TOKEN (must be integer number)
 * @param {string} message sending message, this will be public on explorer
 */
async function sendPToken({ receivers, tokenName, tokenSymbol, tokenId, feePRV = CONFIGS.DEFAULT_PRV_FEE, feePToken, message } = {}) {
  new Validator('receivers', receivers).required().receivers();
  new Validator('tokenName', tokenName).string();
  new Validator('tokenSymbol', tokenSymbol).string();
  new Validator('tokenId', tokenId).required().string();
  new Validator('feePRV || feePToken', feePRV || feePToken).required().amount();
  new Validator('message', message).string();

  log('sendPToken', arguments);

  const accountSender = defaultAccount;

  // payment info for PRV
  let paymentInfos = [];

  // prepare token param for tx privacy token
  let tokenParams = {
    Privacy: true,
    TokenID: tokenId,
    TokenName: tokenName || '',
    TokenSymbol: tokenSymbol || '',
    TokenTxType: CONFIGS.CustomTokenTransfer,
    TokenAmount: 0,
    TokenReceivers: receivers.map(([PaymentAddress, Amount]) => ({ PaymentAddress, Amount }))
  };

  const infoStr = message ? JSON.stringify(message) : '';

  let hasPrivacyForToken = true;
  let hasPrivacyForNativeToken = true;
  
  return accountSender.createAndSendPrivacyToken(paymentInfos, tokenParams, feePRV || 0, feePToken || 0, hasPrivacyForNativeToken, hasPrivacyForToken, infoStr);
}

/**
 * Transfer PRV in Incognito chain
 * @param {string} paymentAddress Receiver Incognito address 
 * @param {number} amount amount want to send, in nano (must be integer number)
 * @param {number} feePRV fee for sending, in nano PRV (must be integer number)
 * @param {string} message sending message, this will be public on explorer
 * @param {array} receivers array of receivers. [ [receiverPaymentAddress1, receiverAmount1], [receiverPaymentAddress2, receiverAmount2] ]
 */
async function sendPRV({ feePRV = CONFIGS.DEFAULT_PRV_FEE, message, receivers } = {}) {
  new Validator('receivers', receivers).required().receivers();
  new Validator('feePRV', feePRV).required().amount();
  new Validator('message', message).string();

  log('sendPRV', arguments);

  const accountSender = defaultAccount;

  // payment info for PRV
  const paymentInfos = receivers.map(([paymentAddressStr, amount]) => ({ paymentAddressStr, amount }));

  const infoStr = message ? JSON.stringify(message) : '';

  const hasPrivacy = true;

  return accountSender.createAndSendNativeToken(paymentInfos, feePRV || 0, hasPrivacy, infoStr);
}

module.exports = {
  sendPToken,
  sendPRV
};