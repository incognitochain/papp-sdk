const SDK = require('incognito-sdk');

const ENV = {
  DEFAULT_ACCOUNT_PRIVATE_KEY: APP_ENV.DEFAULT_ACCOUNT_PRIVATE_KEY,
  CHAIN_URL: APP_ENV.CHAIN_URL
};

let sdk;

async function loadSDK() {
  return new Promise((resolve, reject) => {
    const config = {
      DEFAULT_ACCOUNT_PRIVATE_KEY: ENV.DEFAULT_ACCOUNT_PRIVATE_KEY,
      CHAIN_URL: ENV.CHAIN_URL
    };

    SDK.start(config, (err, sdk) => {
      if (err) {
        reject(err);
      }

      resolve(sdk);
    });
  });
}

async function checkTx(txId) {
  return !txId;
}


async function getSDK() {
  if (!sdk) {
    sdk = await loadSDK();
  }

  return sdk;
}

async function handleSend({ receivers }) {
  const { Validator } = await getSDK();
  new Validator('receivers', receivers)
    .required()
    .receivers();

  const sdk = await getSDK();
  const res = await sdk.sendtx.sendPRV({
    receivers,
    message: 'Dice Roll sends reward to winners'
  });

  console.debug('Sent successfully', receivers);

  return res;
}

module.exports = {
  getSDK,
  handleSend,
  checkTx
};