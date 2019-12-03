
  

# HOW TO USE (v1.0.0)

## Install

`yarn add https://github.com/incognitochain/sdk#papp-client-sdk`

or

`npm install https://github.com/incognitochain/sdk#papp-client-sdk`

  

## SUPPORTED METHODS:



```javascript
import sdk from 'papp-sdk';

if (sdk.checkSDKCompatible()) {
	console.log('There are all methods supported', sdk);
} else {
	console.error('SDK is only work on Incognito Wallet pApp');
}

```

  

*Conventions:*

`variable [ = defaultValue]` if `variable` is not provided, `defaultValue` will be used.


  
* `checkSDKCompatible()` check if SDK compatible or not, SDK is only work on Incognito Wallet pApp tab.

* `onPaymentAddressChange(function(paymentAddress) {})` returns current account payment address.

* `onSupportedTokenListChange(function(listToken) {})` returns following tokens in current account. 

* `onTokenInfoChange(function(tokenInfo) {})` returns current token information (default PRV).
* `changePrivacyTokenById(tokenId)` switch to a token with id = 'tokenId'
* `requestSendTx(toAddress, nanoAmount, info)` make a request send transaction to `toAddress` (Incognito Address) with amount is `nanoAmount` (in nano), `info` (or tx message) is optional field. Users can confirm or cancel it.

 
  

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