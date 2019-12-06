const { getSDK, handleSend } = require('./sdk');
const SEND_MAX_WINNERS = 1;
let winners = {}; // { paymentAddress: amount }

async function addWinner(paymentAddress, nanoAmount) {
  const { Validator } = await getSDK();
  new Validator('winner paymentAddress', paymentAddress)
    .required()
    .paymentAddress();
  new Validator('winner nanoAmount', nanoAmount)
    .required()
    .amount();

  winners[paymentAddress] = Number(winners[paymentAddress]) ? (Number(winners[paymentAddress])  + nanoAmount)  : nanoAmount;
}

async function sendReward() {
  // all winners
  const allReceivers = Object.entries(winners);

  // get SEND_MAX_WINNERS
  const receivers = allReceivers.slice(0, SEND_MAX_WINNERS);


  // do nothing
  if (receivers.length === 0) return;

  console.debug('Sending reward to', receivers);

  // server has to send token (as a prize) to the user
  return handleSend({
    receivers
  })
    .then(tx => {
      console.debug('Sent rewards successfully', tx, receivers);

      // clear these receivers (winners)
      receivers.forEach(([paymentAddress]) => {
        delete winners[paymentAddress];
      });

      console.debug('Remain winners', winners);
    })
    .catch(e => {
      console.error('Send rewards failed', e.message, receivers);
    });
}

function sendRewardSchedule(duration = 2 * 60 * 1000) {
  console.debug('Reward schedule is running...');
  setInterval(() => {
    sendReward();
  }, duration);
}

module.exports = {
  addWinner,
  sendReward,
  sendRewardSchedule
};