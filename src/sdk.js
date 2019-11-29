const loadWASM = require('./wasm');
const log = require('./utils/log');
const { setConfig, getConfig } = require('./config');

/**
 * Starting SDK
 * @param {function} callback Involked once SDK is ready
 */
async function start(config, callback) {
  log('STARTING INCOGNITO SDK...', Date().toLocaleString());

  setConfig(config);

  log('SDK CONFIG', getConfig());

  await loadWASM();
  const wallet = await require('./wallet');

  // WALLET WAS READY
  if (wallet) {
    const account = await require('./account');
    const token = await require('./token');
    const estimateFee = await require('./estimateFee');
    const sendtx = await require('./sendtx');
    const Validator = require('./utils/validator');

    callback(null, {
      account,
      token,
      estimateFee,
      sendtx,
      Validator
    });
  } else {
    const e = new Error('Can not load a wallet');
    callback(e);
    throw e;
  }
}

module.exports = { start };
