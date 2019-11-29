const SDK = require('./dist/incognito-sdk');

const config = {
  DEFAULT_PRV_FEE: undefined,
  DEFAULT_ACCOUNT_PRIVATE_KEY: undefined,
  CHAIN_URL: undefined
};

SDK.start(config, (error, sdk) => {
  if (error) {
    console.error('Load SDK failed');
    return;
  }
  
  console.debug('SDK is ready! See all supported methods here', sdk);

  // Get default account with DEFAULT_ACCOUNT_PRIVATE_KEY defined in env/[mode].env.js
  const defaultAccount = sdk.account.getDefaultAccount();
  console.debug('DEFAULT ACCOUNT', defaultAccount);


  // Load account balance
  sdk.account.getPRVBalance(defaultAccount)
    .then(balanceInNano => console.debug('Your account balance (in nano) is', balanceInNano));
});