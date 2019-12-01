const express = require('express');
const bodyParser = require('body-parser');
const app = express();
var cors = require('cors');
const port = process.env.PORT || 3000;
const handleBet = require('./src/bet');
const { getSDK } = require('./src/sdk');

app.use(cors());

// parse application/json
app.use(bodyParser.json());

// greating :-)
app.get('/', function (req, res) {
  res.send('roll dice was started!');
});

// handle your game
app.post('/bet', handleBet);

if (!APP_ENV.DEFAULT_ACCOUNT_PRIVATE_KEY) {
  throw new Error('THE APP CAN NOT RUN WITHOUT A PRIVATE KEY!');
}

// wait for SDK is ready
getSDK()
  .then(async (sdk) => {
    if (sdk) {
      const currentBalance = await sdk.account.getPRVBalance(sdk.account.getDefaultAccount());
      console.debug(`YOUR ACCOUNT BALANCE ${currentBalance} PRV (nano PRV)`);

      // sdk is ready now, start your app
      app.listen(port, () => console.debug(`Roll dice app listening on port ${port}!`));
    } else {
      throw new Error('Load SDK failed');
    }
  })
  .catch((e) => {
    console.error(e.message);
  });