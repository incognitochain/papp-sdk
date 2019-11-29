const { RpcClient } = require('incognito-chain-web-js/build/wallet');
const axios = require('axios');
const log = require('./utils/log');
const { getConfig } = require('./config');

const CONFIGS = getConfig();

const rpcClient = new RpcClient(CONFIGS.CHAIN_URL);
rpcClient.rpcHttpService.axios = axios;

log('rpcClient URL', rpcClient.rpcHttpService.url);

module.exports = rpcClient;