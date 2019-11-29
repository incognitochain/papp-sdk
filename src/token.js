const { getDefaultAccount } = require('./account');
const rpc = require('./rpc');
const log = require('./utils/log');
const Validator = require('./utils/validator');

const defaultAccount = getDefaultAccount();

async function getPTokenBalanceById(tokenId, account = defaultAccount) {
  new Validator('tokenId', tokenId).required().string();
  new Validator('account', account).required().accountWallet();

  log('getPTokenBalanceById', arguments);

  return account.getBalance(tokenId);
}

async function canUseThisTokenForFee(tokenId) {
  new Validator('tokenId', tokenId).required().string();

  log('canUseThisTokenForFee', arguments);

  return rpc.isExchangeRatePToken(tokenId);
}

async function getPTokenHistoryById(tokenId, account = defaultAccount) {
  new Validator('tokenId', tokenId).required().string();
  new Validator('account', account).required().accountWallet();

  log('getPTokenHistoryById', arguments);

  return account.getPrivacyTokenTxHistoryByTokenID(tokenId);
}

module.exports = {
  getPTokenBalanceById,
  canUseThisTokenForFee,
  getPTokenHistoryById
};