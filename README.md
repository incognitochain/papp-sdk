
  

# ROLLDICE

### Environment
	
* Copy `template.env.js` to `production.env.js`.
* Add your Incognito Private Key to `DEFAULT_ACCOUNT_PRIVATE_KEY`.
* You can update `CHAIN_URL` or `IS_MAINNET` if needed.
	
### Run game
`yarn start`

By default port 3000 will be used, you can change it:
`PORT=1234 yarn start`
  
### Test your game
Make a POST request to your server

```
curl -X POST -H "Content-Type: application/json" \
--data '{"betAmount": 10, "paymentAddress": "12S6BfoWtEsn9zR1QrAy137971XJNTDZGAfpE11KpHM42Sb8PzwssCd47kEG7ps8VQvyyjmKzU389NwDsRyRiTaZirNKwDG2wmMyGWJ"}' \
http://localhost:3000/bet
```

Response:
```
{"data":{"win":20000000000,"message":"You will receive 20000000000 PRV in a couple minutes"}}
```
or
```
{"data":{"lose":10000000000}}
```

### Write your own game
Run command:
```
yarn dev
```

Development server will be served on PORT 3000 as default.
Watch & re-build on changes.
