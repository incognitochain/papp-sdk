const { Wallet } = require('incognito-chain-web-js/build/wallet');
const rpcClient = require('./rpc');
const log = require('./utils/log');

Wallet.RpcClient = rpcClient;

log('Wallet', Wallet);

module.exports = Wallet;