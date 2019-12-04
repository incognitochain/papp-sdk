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

function init() {
  // onSupportedTokenListChange(list => {
  //   alert(JSON.stringify(list));
  // });

  setTimeout(() => uiControl.animateDice(), 1000);

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

  uiControl.onPressSubmitRoll((e) => {
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
  
      requestSendTx(paymentAddressServer, nanoAmount, tokenInfo.symbol)
        .then((txInfo) => {
  
          // uiControl.rollTo(Math.round(Math.random() * 6));
  
          if (txInfo.txId) {
            // See more "Rolldice backend" https://github.com/incognitochain/sdk/tree/rolldice for detail
            axios.post(`${APP_ENV.SERVER_URL}/bet`, {
              txId: txInfo.txId,
              paymentAddress,
              betAmount: nanoAmount,
              betDiceNumber: betDiceNumber || 0
            })
              .then(res => {
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
              })
              .catch(e => {
                uiControl.showMessage(e.message || 'Opps! Something went wrong.', { type: 'error' });
              });
    
          }
        })
        .catch(e => {
          if (e.code === ERROR_CODE.USER_CANCEL_SEND_TX) {
            switch(e.code) {
            case ERROR_CODE.USER_CANCEL_SEND_TX:
              uiControl.showMessage('Request was canceled', { timeout: 3000 });
              return;
            case ERROR_CODE.REQUEST_SEND_TX_TIMEOUT:
              uiControl.showMessage('Request timeout', { timeout: 3000 });
              return;
            case ERROR_CODE.SEND_TX_ERROR:
              uiControl.showMessage(`Send transaction failed. (${e.message})`, { timeout: 3000 });
              return;
            }
            
            uiControl.showMessage(`Opps! Something went wrong. (${e.message})`, { timeout: 3000 });
            return;
          }
          uiControl.showMessage(e.message || 'Opps! Something went wrong.', { type: 'error' });
        });
    } catch (e) {
      uiControl.showMessage(e.message || 'Opps! Something went wrong.', { type: 'error' });
    }
  });
}


export default {
  init
};
