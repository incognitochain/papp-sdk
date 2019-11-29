const { AccountWallet, KeyWallet } = require('incognito-chain-web-js/build/wallet');

function isPaymentAddress(paymentAddrStr) {
  try {
    const key = KeyWallet.base58CheckDeserialize(paymentAddrStr);
    const paymentAddressObj = key.KeySet.PaymentAddress || {};
    if (paymentAddressObj.Pk.length === 32 && paymentAddressObj.Tk.length === 32) {
      return true;
    }
  } catch (e) {
    return false;
  }

  return false;
}


class Validator {
  constructor(label, value) {
    if (!label && typeof label !== 'string') throw new Error('Missing or invalid label');

    this.value = value;
    this.label = label;
    this.isRequired = false;
  }

  _throwError(message) {
    throw new Error(`Validating "${this.label}" failed: ${message}. Found ${this.value} (type of ${typeof this.value})`);  
  }

  _isDefined() {
    return this.value !== null && this.value !== undefined;
  }

  _onCondition(condition, message) {
    if (((!this.isRequired && this._isDefined()) || this.isRequired) && !condition()) {
      this._throwError(message);
    }

    return this;
  }

  required(message = 'Required') {
    this.isRequired = true;
    return this._onCondition(() => this._isDefined(), message);
  }

  string(message = 'Must be string') {
    return this._onCondition(() => typeof this.value === 'string', message);
  }

  boolean(message = 'Must be boolean') {
    return this._onCondition(() => typeof this.value === 'boolean', message);
  }
  
  number(message = 'Must be number') {
    return this._onCondition(() => Number.isFinite(this.value) && this.value > 0, message);
  }
  
  intergerNumber(message = 'Must be an interger number') {
    return this._onCondition(() => Number.isInteger(this.value) && this.value > 0, message);
  }
  
  paymentAddress(message = 'Invalid payment address') {
    return this._onCondition(() => isPaymentAddress(this.value), message);
  }

  privateKey(message = 'Invalid private key') {
    return this._onCondition(() => this.string(), message);
  }

  /**
   * 
   * Check "PrivateKey" is existed is enough for now
   */
  accountWallet(message = 'Invalid account wallet') {
    return this._onCondition(() => this.value instanceof AccountWallet, message);
  }
  
  /**
   * 
   * @param {number} value amount in nano (must be an integer number)
   * @param {string} message error message
   */
  amount(message = 'Invalid amount') {
    return this._onCondition(() => this.intergerNumber(), message);
  }
}

module.exports = Validator;