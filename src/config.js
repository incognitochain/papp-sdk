const { constants } = require('incognito-chain-web-js/build/wallet');

let USER_CONFIG = {
  DEFAULT_PRV_FEE: 10
};

let CONSTANTS = {
  CustomTokenTransfer: constants.CustomTokenTransfer,
  DEFAULT_PRV_FEE: SDK_ENV.DEFAULT_PRV_FEE,
  CHAIN_URL: SDK_ENV.CHAIN_URL,
  DEFAULT_ACCOUNT_PRIVATE_KEY: SDK_ENV.DEFAULT_ACCOUNT_PRIVATE_KEY,
  IS_MAINNET: SDK_ENV.IS_MAINNET,
};


function setConfig(config) {
  if (typeof config !== 'object' && config !== null) throw new Error('Please config your SDK before use it');

  const {
    DEFAULT_PRV_FEE = USER_CONFIG.DEFAULT_PRV_FEE,
    DEFAULT_ACCOUNT_PRIVATE_KEY = USER_CONFIG.DEFAULT_ACCOUNT_PRIVATE_KEY,
    CHAIN_URL = USER_CONFIG.CHAIN_URL
  } = config;

  USER_CONFIG = {
    ...USER_CONFIG,
    ...DEFAULT_PRV_FEE ? { DEFAULT_PRV_FEE } : {},
    ...DEFAULT_ACCOUNT_PRIVATE_KEY ? { DEFAULT_ACCOUNT_PRIVATE_KEY } : {},
    ...CHAIN_URL ? { CHAIN_URL } : {},
  };

  CONSTANTS = {
    ...CONSTANTS,
    ...USER_CONFIG
  };
}

function getConfig() {
  return {
    ...CONSTANTS,
    ...USER_CONFIG
  };
}


module.exports = {
  CONSTANTS,
  getConfig,
  setConfig
};