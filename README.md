
  

# HOW TO USE (v1.0.0)

## Install

`yarn add https://github.com/incognitochain/sdk`

or

`npm install https://github.com/incognitochain/sdk`

  

## SUPPORTED METHODS:

  

```javascript
SDK.start(sdkConfig, (error, sdk) => {

console.log('There are all methods supported', sdk);

// place your code here

});
```

  

*Conventions:*

`variable [ = defaultValue]` if `variable` is not provided, `defaultValue` will be used.

  

### SDK config

  
```javascript
DEFAULT_PRV_FEE: 10,

DEFAULT_ACCOUNT_PRIVATE_KEY: '',

CHAIN_URL: 'https://testnet.incognito.org'
```

  

### Account methods

* `getAccountFromPrivateKey(privateKey: string)` returns account object.

* `(Promise) getPRVBalance(account)` returns account balance in nano.

* `(Promise) getAccountHistory(account)` returns array of histories.

* `getDefaultAccount()` returns default account (its `DEFAULT_ACCOUNT_PRIVATE_KEY` defined in `config`)

  

### Token methods

* `(Promise) getPTokenBalanceById(tokenId: string, account [ = defaultAccount])` returns token balance in nano.

* ` (Promise) canUseThisTokenForFee(tokenId)` returns a boolean, `true` if this token have exchange rate, else `false`.

* `(Promise) getPTokenHistoryById(tokenId, account [ = defaultAccount])` returns array of histories.

  
  

### Sending transaction methods

* `(Promise) sendPToken({ paymentAddress, amount, tokenName, tokenSymbol, tokenId, feePRV [ = DEFAULT_PRV_FEE], feePToken, message })` transfer pToken in Incognito chain. `DEFAULT_PRV_FEE` defined in `config`.

* ` (Promise) sendPRV({ paymentAddress, amount, feePRV [ = DEFAULT_PRV_FEE ], message })` transfer PRV in Incognito chain. `DEFAULT_PRV_FEE` defined in `config`.

  

### Estimating fee methods

* `(Promise) estimateFeeForSendingPRV({ paymentAddressSender, paymentAddressReceiver, amount, account [ = defaultAccount ], rpc [ = rpcClient ] })` estimating fee for sending PRV, fee returned in nano.

* `(Promise) estimateFeeForSendingPToken({ paymentAddressSender, paymentAddressReceiver, amount, account [=defaultAccount], rpc [ = rpcClient], isUsePTokenFee [ = false], tokenName, tokenSymbol, tokenId }) ` estimating fee for sending pToken, fee returned in nano. If `isUsePTokenFee` is `true`, the token will be used for fee, else PRV.

  

### Utils

* #### Validator
  

```javascript
const { Validator } = require('incognito-sdk);
    
    new Validator(label, value)
	    .required(message  =  'Required')
	    .string(message  =  'Must be string')
	    .boolean(message  =  'Must be boolean')
	    .number(message  =  'Must be number')
	    .intergerNumber(message  =  'Must be an interger number')
	    .paymentAddress(message  =  'Invalid payment address')
	    .privateKey(message  =  'Invalid private key')
	    .accountWallet(message  =  'Invalid account wallet')
	    .amount(message  =  'Invalid amount'); // amount must be nano (interger number and > 0)
```



*This project is still in development.*