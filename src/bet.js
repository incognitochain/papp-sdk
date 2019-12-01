const sdk = require('./sdk');
const validate = require('./validate');
const { sendData, sendError } = require('./response');
const BET_RATE = 3;

// this game is yours!
async function bet({ betAmount, paymentAddress }) {
  const isWin = Math.round(Math.random() * 1) > 0; // ramdom bet result
  return isWin ? await handleWin({ betAmount, paymentAddress }) : handleLose({ betAmount, paymentAddress });
}

// user lose
function handleLose({ betAmount, paymentAddress }) {
  console.debug(`${paymentAddress} losed ${betAmount}`);

  return { lose: betAmount } ;
}

// user win
async function handleWin({ betAmount, paymentAddress }) {

  const winAmount = betAmount * BET_RATE;

  // server has to send token (as a prize) to the user
  const tx = await sdk.handleSend({
    paymentAddress,
    amount: winAmount
  });

  console.debug(`${paymentAddress} won ${winAmount}. TxID: ${tx.txId}`);


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
  
    const rs = await bet({ betAmount: payload.betAmount, paymentAddress: payload.paymentAddress });
    sendData(res, rs);
  } catch (e) {
    sendError(res, e.message);
  }
}

module.exports = handleBetRequest;