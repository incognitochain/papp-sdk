// The SDK provides a Validator class which maybe useful, "handleSend" method using it
function isValidPayload(payload) {
  const { betAmount, paymentAddress } = payload || {};
  
  if (Number.isInteger(betAmount) && betAmount > 0 && typeof paymentAddress === 'string') {
    return true;
  }
  return false;
}

module.exports = {
  isValidPayload
};