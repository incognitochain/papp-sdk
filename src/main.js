import axios from 'axios';
import { onTokenInfoChange, requestSendTx, onPaymentAddressChange, ERROR_CODE,/* onSupportedTokenListChange */ } from './wallet';
import uiControl from './ui_control';

let betDiceNumber;
let tokenInfo = {};
let paymentAddress; // payment address of player

function toAmount(nanoAmount, pDecimals) {
  return nanoAmount/(pDecimals ? 10**pDecimals : 1) || 0;
}

function toNanoAmount(amount, pDecimals) {
  return amount*(pDecimals ? 10**pDecimals : 1) || 0;
}

async function isServerReady() {
  try {
    const res = await axios.get(APP_ENV.SERVER_URL);
    return res.data && !!res.data.ready;
  } catch (e) {
    return false;
  }
}

function handleStartup(onStart) {
  uiControl.hideAppLoading();
  if (typeof onStart === 'function') {
    onStart();
  }
}

async function init() {
  // onSupportedTokenListChange(list => {
  //   alert(JSON.stringify(list));
  // });

  if (!(await isServerReady())) {
    const msg = 'Sorry, host is not ready yet, please come back later.';
    uiControl.showMessage(msg, { timeout: 300000 });
    alert(msg);
    return;
  }

  uiControl.showMessage('Welcome to Dice Roll!');

  setTimeout(() => uiControl.animateDice(betDiceNumber), 1000);

  onTokenInfoChange(tInfo => {
    const { symbol, balance, /** name, symbol, id, pDecimals, balance, nanoBalance */ } = tInfo;
    tokenInfo = { ...tInfo };
    uiControl.setBalanceTxt({ balance, symbol });
    uiControl.setMaxAmountForBetAmountInput(balance);
  });

  onPaymentAddressChange(pa => {
    paymentAddress = pa;
  });

  uiControl.onPressDownBetAmount(() => {
    const balance = uiControl.getBetAmount();
    let newBalance = balance;

    if (balance - 1 >= 0) {
      newBalance = balance - 1;
    }

    uiControl.setBetAmountTxt(newBalance);
  });

  uiControl.onPressUpBetAmount(() => {
    const balance = uiControl.getBetAmount();
    let newBalance = balance;

    if (newBalance + 1 <= tokenInfo.balance) {
      newBalance = balance + 1;
    }

    uiControl.setBetAmountTxt(newBalance);
  });
  
  uiControl.onSelectRollDice((diceNumber) => {
    betDiceNumber = Number(diceNumber);
    uiControl.selectDice(betDiceNumber);
  });

  uiControl.onPressSubmitRoll(async (e) => {
    try {
      e.preventDefault();

      const paymentAddressServer = APP_ENV.SERVER_PAYMENT_ADDRESS;
  
      const betAmount = uiControl.getBetAmount();
  
      if (betAmount <= 0) {
        throw new Error('Please enter a valid amount (larger than 0)');
      }
  
      if (betAmount > tokenInfo.balance) {
        throw new Error(`You can only bet ${tokenInfo.balance} ${tokenInfo.symbol} max.`);
      }

      if (![1,2,3,4,5,6].includes(betDiceNumber)) {
        throw new Error('Please choose a face to begin with');
      }
      
  
      // send player's token to the server, then the server returns bet result, if the player wins, the server will send reward to the player
      const nanoAmount = toNanoAmount(betAmount, tokenInfo.pDecimals);
  
      const txInfo = await requestSendTx(paymentAddressServer, nanoAmount, tokenInfo.symbol);
      if (txInfo.txId) {
        uiControl.showMessage('Rolling...');

        // See more "Rolldice backend" https://github.com/incognitochain/sdk/tree/rolldice for detail
        const res = await axios.post(`${APP_ENV.SERVER_URL}/bet`, {
          txId: txInfo.txId,
          paymentAddress,
          betAmount: nanoAmount,
          betDiceNumber: betDiceNumber || 0
        });

        // RANDOM BET RESULT FOR NOW 
        const result = res.data && res.data.data || {};

        const { win, lose, message, betDiceNumberResult } = result;

        uiControl.rollTo(betDiceNumberResult);
        
        if (win) {
          uiControl.setBetWin({ winAmount: toAmount(win, tokenInfo.pDecimals) });
        }
        if (lose) {
          uiControl.setBetLose({ loseAmount: toAmount(lose, tokenInfo.pDecimals) });
        }

        if (message) {
          uiControl.showMessage(message, { timeout: 7000 });
        }
      } else {
        throw new Error('Can not create transaction');
      }
    } catch (e) {
      const resErrText = e && (e.response && e.response.data) || e.message;

      switch(e.code) {
      case ERROR_CODE.USER_CANCEL_SEND_TX:
        uiControl.showMessage('Request was canceled', { timeout: 3000 });
        return;
      case ERROR_CODE.REQUEST_SEND_TX_TIMEOUT:
        uiControl.showMessage('Request timeout', { timeout: 3000 });
        return;
      case ERROR_CODE.SEND_TX_ERROR:
        uiControl.showMessage('Can not process your bet right now, please try again. If this is still happening, please try after 5 minutes', { timeout: 10000 });
        return;
      }

      uiControl.showMessage(`Something went wrong. ${resErrText ? `(${resErrText})` : ''}`, { type: 'error' });
    }
  });
}


export default {
  handleStartup,
  init
};
