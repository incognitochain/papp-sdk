
  

# ROLLDICE CLIENT

See more: [Rolldice server app](https://github.com/incognitochain/sdk/tree/rolldice-backend-papp)

### Environment
	
* Copy `template.env.js` to `production.env.js`.
* Add your Incognito Address to `SERVER_PAYMENT_ADDRESS`. This address will be used for receiving token from players.
* `SERVER_URL` is papp backend url (if any).
	
### Run game
`yarn start`

All app bundle will be placed in `dist` folder.
By default the app will be served at http://localhost:8080.
Then enter this URL to tab PAPP on Incognito Wallet.


### Write your own game
Run command:
```
yarn dev
```

Development server will be served on PORT 9000 as default.
Watch & re-build on changes.
