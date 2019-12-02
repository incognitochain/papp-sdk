const sdk = require('./sdk');
const validate = require('./validate');
const { sendData, sendError } = require('./response');
const BET_RATE = 3;

// this game is yours!
async function bet({ betAmount, paymentAddress, betDiceNumber }) {
  const isWin = Math.round(Math.random() * 6) === betDiceNumber;
  return isWin ? await handleWin({ betAmount, paymentAddress, betDiceNumber }) : handleLose({ betAmount, paymentAddress, betDiceNumber });
}

// user lose
function handleLose({ betAmount, paymentAddress, betDiceNumber }) {
  console.debug(`${paymentAddress} losed ${betAmount}, bet ${betDiceNumber}`);

  return { lose: betAmount } ;
}

// user win
async function handleWin({ betAmount, paymentAddress, betDiceNumber }) {

  const winAmount = betAmount * BET_RATE;

  // server has to send token (as a prize) to the user
  const tx = await sdk.handleSend({
    paymentAddress,
    amount: winAmount
  });

  console.debug(`${paymentAddress} won ${winAmount}, bet ${betDiceNumber}. TxID: ${tx.txId}`);


  return { win: winAmount, message: `You will receive ${winAmount} nano PRV in a couple minutes`, txId: tx.txId } ;
}

async function handleBetRequest(req, res) {
  try {
    const payload = req.body;

    // payload should include "betAmount" and "paymentAddress"
    // betAmount is amount user bet
    // paymentAddress is user's incognito address, you need it to send token (win prize) to the user
    if (!validate.isValidPayload(payload)) {
      sendError(res, 'Invalid params');
    }
  
    const rs = await bet({ betAmount: payload.betAmount, paymentAddress: payload.paymentAddress, betDiceNumber: payload.betDiceNumber });
    sendData(res, rs);
  } catch (e) {
    sendError(res, e.message);
  }
}

module.exports = handleBetRequest;