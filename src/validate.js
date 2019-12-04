// The SDK provides a Validator class which maybe useful, "handleSend" method using it
function isValidPayload(payload) {
  const { betAmount, paymentAddress, betDiceNumber, txId } = payload || {};
  
  if (Number.isInteger(betAmount) && betAmount > 0 && typeof paymentAddress === 'string' && [1,2,3,4,5,6].includes(betDiceNumber) && typeof txId === 'string') {
    return true;
  }
  return false;
}

module.exports = {
  isValidPayload
};