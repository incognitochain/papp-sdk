const SDK = require('./dist/incognito-sdk');
const PAYMENT_ADDRESS_LUFFY = '12S6BfoWtEsn9zR1QrAy137971XJNTDZGAfpE11KpHM42Sb8PzwssCd47kEG7ps8VQvyyjmKzU389NwDsRyRiTaZirNKwDG2wmMyGWJ';
const PAYMENT_ADDRESS_KAIDO = '12S6BfoWtEsn9zR1QrAy137971XJNTDZGAfpE11KpHM42Sb8PzwssCd47kEG7ps8VQvyyjmKzU389NwDsRyRiTaZirNKwDG2wmMyGWJ';
const pTokenId = '';

const config = {
  DEFAULT_PRV_FEE: undefined,
  DEFAULT_ACCOUNT_PRIVATE_KEY: '112t8rnX9Rf7FmtWeTFHCsiDyyWBePG4fihqR5AG7Yxqmaw1i8pEXcCioqPQpQNBcWE9FcQmk6WoTn6na5zu8omTV9tEuMrWtDPWQkyHyWCV',
  CHAIN_URL: undefined
};

function divider(title) {
  console.log(`\n\t\t============ ${title} ============\n\n`);
}

SDK.start(config, async (error, sdk) => {
  if (error) {
    console.error('Load SDK failed');
    return;
  
  }
  divider('START');
  
  console.debug('SDK is ready! See all supported methods here', sdk);

  divider('ACCOUNT');

  // ACCOUNT
  // Get default account with DEFAULT_ACCOUNT_PRIVATE_KEY defined in config.DEFAULT_ACCOUNT_PRIVATE_KEY
  const defaultAccount = sdk.account.getDefaultAccount();
  console.debug('DEFAULT ACCOUNT', defaultAccount);

  /*
  // Get account from a private key
  const otherAccount = sdk.account.getAccountFromPrivateKey(PRIVATE_KEY);
  console.debug('ANOTHER ACCOUNT', otherAccount);
  */

  // Load account balance
  const prvBalanceInNano = await sdk.account.getPRVBalance(defaultAccount);
  console.debug('Your account balance (in nano) is', prvBalanceInNano);

  // Load PRV transaction history
  // NOTE: transaction histories are only stored in account object locally, so please back it up if you want to keep them
  const histories = await sdk.account.getAccountHistory(defaultAccount);
  console.debug('PRV transaction histories', histories);




  divider('TOKEN');
  // TOKEN METHODS
  // Load token balance
  const pTokenBalanceInNano = await sdk.token.getPTokenBalanceById(pTokenId, defaultAccount);
  console.debug('Your pToken balance (in nano) is', pTokenBalanceInNano);
  
  // Check if this token can be used for paying fee
  const canUsedForFee = await sdk.token.canUseThisTokenForFee(pTokenId);
  console.debug(`pToken ${canUsedForFee ? 'can' : 'can not'} be used for fee.`);

  // Load PRV transaction history
  const pTokenHistories = await sdk.token.getPTokenHistoryById(pTokenId, defaultAccount);
  console.debug('pToken transaction histories', pTokenHistories);




  divider('SEND TX');
  // SEND TX
  const receivers = [
    // [ payment_address, amount_in_nano ]
    [ PAYMENT_ADDRESS_LUFFY, 100 ],
    [ PAYMENT_ADDRESS_KAIDO, 150 ],
    // max is 30 receivers
  ];

  
  // Send PRV
  // default `feePRV` = config.DEFAULT_PRV_FEE
  // message is optional and public on the chain (view on explorer)
  const sendPrvTx = await sdk.sendtx.sendPRV({ receivers, feePRV: 12, message: 'Send PRV' });
  console.debug('Send PRV tx', sendPrvTx);
  

  /*
  // Send pToken
  // default `feePRV` = config.DEFAULT_PRV_FEE
  // feePToken is optional, make sure this token can be used for fee (check `canUseThisTokenForFee` method)
  // message is optional and public on the chain (view on explorer)
  const sendPTokenTx = await sdk.sendtx.sendPToken({ receivers, feePRV: 12, feePToken: 0, message: 'Send pToken', tokenId: pTokenId });
  console.debug('Send pToken tx', sendPTokenTx);
  */
  

  divider('ESTIMATE FEE');
  // ESTIMATE FEE
  // Estimate fee for send PRV
  const feePrv = await sdk.estimateFee.estimateFeeForSendingPRV({ paymentAddressSender: PAYMENT_ADDRESS_KAIDO, paymentAddressReceiver: PAYMENT_ADDRESS_LUFFY, amount: 100, account: defaultAccount });
  console.debug('Estimate fee for sending PRV, use nano PRV for fee', feePrv);
  

  /*
  // Estimate fee for sending pToken, use PRV for fee
  const feePToken_usePRV = await sdk.estimateFee.estimateFeeForSendingPToken({
    paymentAddressSender: PAYMENT_ADDRESS_KAIDO,
    paymentAddressReceiver: PAYMENT_ADDRESS_LUFFY,
    amount: 100,
    account: defaultAccount,
    isUsePTokenFee: false,
    tokenId: pTokenId
  });
  console.debug('Estimate fee for sending pToken, use nano PRV for fee', feePToken_usePRV);
  */

  /*
  // Estimate fee for sending pToken, use pToken for fee and make sure this token can be used for fee (check `canUseThisTokenForFee` method)
  const feePToken_usePToken = await sdk.estimateFee.estimateFeeForSendingPToken({
    paymentAddressSender: PAYMENT_ADDRESS_KAIDO,
    paymentAddressReceiver: PAYMENT_ADDRESS_LUFFY,
    amount: 100,
    account: defaultAccount,
    isUsePTokenFee: true,
    tokenId: pTokenId
  });
  console.debug('Estimate fee for sending pToken, use nano pToken for fee', feePToken_usePToken);
  */
});