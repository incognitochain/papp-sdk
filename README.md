
  

# HOW TO USE (v1.0.2)

## Install

`yarn add https://github.com/incognitochain/sdk#papp-client-sdk`

or

`npm install https://github.com/incognitochain/sdk#papp-client-sdk`

  

## SUPPORTED METHODS:



```javascript
import SDK from 'papp-sdk';

if (SDK.checkSDKCompatible()) {
	console.log('There are all methods supported', SDK);
} else {
	console.error('SDK is only work on Incognito Wallet pApp');
}

```

  

*Conventions:*

`variable [ = defaultValue]` if `variable` is not provided, `defaultValue` will be used.


  
* `checkSDKCompatible()` check if SDK compatible or not, SDK is only work on Incognito Wallet pApp tab.

* `onPaymentAddressChange(function(paymentAddress) {})` returns current account payment address.

* `onSupportedTokenListChange(function(listToken) {})` returns list of tokens supported (from `setListSupportTokenById`).

* `onExtraInfoChange(function(extraData) {})` return object of extra info, currently support `userId`.

* `onTokenInfoChange(function(tokenInfo) {})` returns current token information (default PRV).
* `changePrivacyTokenById(tokenId)` switch to a token with id = 'tokenId'
* `requestSendTx({ receivers, info })` make a request send transaction `receivers` list, `receivers` is array of `[receiver_payment_address, receiver_nano_amount]`, max 30 receivers, (i.e `receivers = [ ['abc', 100], ['xyz', 200] ]`), `info` (or tx message) is optional field. Users can confirm or cancel it.
* `setListSupportTokenById(tokenIDs)` set list of tokens will be used in the pApp. (PRV is always available).
  ```javascript
  const { SUPPORTED_TOKEN } = SDK;
  
  /*
  	List of SUPPORTED_TOKEN: pETH, pBTC, pUSDT, pBNB, pUSD, pTomo (please use pTomo_Testnet on testnet).
  */
  
  SDK.setListSupportTokenById([
  	SUPPORTED_TOKEN.pETH,
    SUPPORTED_TOKEN.pBTC
   ]);
  ```

 
  

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
      .inList(list, message = 'Must be in provided list')
      .array(message = 'Must be an array')
      .object(message = 'Must be an object') 
      .function(message = 'Must be a function')
      .paymentAddress(message = 'Invalid payment address') // just check string for now
      .amount(message = 'Invalid amount') // accept decimal
	  .nanoAmount(message  =  'Invalid anno amount'); // amount must be nano (interger number and > 0)
```



*This project is still in development.*