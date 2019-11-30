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


async function getSDK() {
  if (!sdk) {
    sdk = await loadSDK();
  }

  return sdk;
}

async function handleSend({ paymentAddress, amount }) {
  const { Validator } = await getSDK();
  new Validator('paymentAddress', paymentAddress)
    .required()
    .paymentAddress();
  new Validator('amount', amount)
    .required()
    .amount();

  const sdk = await getSDK();
  const res = await sdk.sendtx.sendPRV({
    paymentAddress,
    amount,
    message: `Rolldice pay to user ${amount} PRV`
  });

  console.debug('Sent successfully', paymentAddress, amount);

  return res;
}

module.exports = {
  getSDK,
  handleSend
};