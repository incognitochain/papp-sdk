const { KeyWallet, AccountWallet } = require('incognito-chain-web-js/build/wallet');
const Validator = require('./utils/validator');
const { getConfig } = require('./config');
const log = require('./utils/log');

const CONFIGS = getConfig();

const DEFAULT_PRIVATE_KEY = CONFIGS.DEFAULT_ACCOUNT_PRIVATE_KEY;

let defaultAccount;

function getAccountFromPrivateKey(privateKey) {
  new Validator('privateKey', privateKey).required().privateKey();

  log('getAccountFromPrivateKey', arguments);

  let senderKeyWallet = KeyWallet.base58CheckDeserialize(privateKey);
  senderKeyWallet.KeySet.importFromPrivateKey(senderKeyWallet.KeySet.PrivateKey);

  const account = new AccountWallet();
  account.key = senderKeyWallet;
  
  const accountShardNumber = senderKeyWallet.KeySet.ReadonlyKey.Pk[senderKeyWallet.KeySet.ReadonlyKey.Pk.length - 1] % 8;

  account.customInfo = {
    shard: accountShardNumber,
    keyset: account.toSerializedAccountObj()
  };
  
  log('DEFAULT ACCOUNT KET SET', account.customInfo.keyset);
  log('DEFAULT ACCOUNT SHARD', account.customInfo.shard);

  return account;
}

async function getPRVBalance(account) {
  new Validator('account', account).required().accountWallet();

  log('getPRVBalance', arguments);

  return account.getBalance();
}

async function getAccountHistory(account) {
  new Validator('account', account).required().accountWallet();

  log('getAccountHistory', arguments);

  return account.getNormalTxHistory();
}

function getDefaultAccount() {
  if (defaultAccount) {
    return defaultAccount;
  }
  defaultAccount = getAccountFromPrivateKey(DEFAULT_PRIVATE_KEY);
}

module.exports = {
  getAccountFromPrivateKey,
  getPRVBalance,
  getAccountHistory,
  getDefaultAccount
};