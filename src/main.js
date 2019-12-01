import axios from 'axios';
import { onTokenInfoChange, requestSendTx, onPaymentAddressChange, /* onSupportedTokenListChange */ } from './wallet';
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
    uiControl.selectDice(diceNumber);
    betDiceNumber = diceNumber;
  });

  uiControl.onPressSubmitRoll((e) => {
    e.preventDefault();

    const paymentAddressServer = APP_ENV.SERVER_PAYMENT_ADDRESS;

    const betAmount = uiControl.getBetAmount();

    if (betAmount <= 0) {
      throw new Error('Bet amount must be larger than 0');
    }

    if (betAmount > tokenInfo.balance) {
      throw new Error(`You only can bet maximum ${tokenInfo.balance} ${tokenInfo.symbol}.`);
    }
    

    // send player's token to the server, then the server returns bet result, if the player wins, the server will send reward to the player
    const nanoAmount = toNanoAmount(betAmount, tokenInfo.pDecimals);

    requestSendTx(paymentAddressServer, nanoAmount, tokenInfo.symbol)
      .then((txInfo) => {

        // uiControl.rollTo(Math.round(Math.random() * 6));

        if (txInfo.txId) {
          // See more "Rolldice backend" https://github.com/incognitochain/sdk/tree/rolldice for detail
          axios.post(`${APP_ENV.SERVER_URL}/bet`, {
            paymentAddress,
            betAmount: nanoAmount,
            betDiceNumber: Number(betDiceNumber) || 0
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
                alert(message);
              }
            })
            .catch(e => {
              alert(`Got an error: ${e.message}`);
            });
  
        }
      })
      .catch(e => {
        alert(e.message);
      });
  });
}


export default {
  init
};
