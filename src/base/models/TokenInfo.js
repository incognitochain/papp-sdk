import Validator from '../validator';

class TokenInfo {
  constructor(info, { simple = false } = {}) {
    if (typeof info !== 'object') throw TypeError(`Token info must be an object, found ${JSON.stringify(info)}`);

    const { name, symbol, id, pDecimals, balance, nanoBalance } = info;

    new Validator('id', id).required().string();
    new Validator('name', name).required().string();
    new Validator('symbol', symbol).required().string();

    const pDecimalsValidate = new Validator('pDecimals', pDecimals).intergerNumber();
    const balanceValidate = new Validator('balance', balance).amount();
    const nanoBalanceValidate = new Validator('nanoBalance', nanoBalance).nanoAmount();

    if (!simple) {
      pDecimalsValidate.required();
      balanceValidate.required();
      nanoBalanceValidate.required();
    }

    this.id = id;
    this.name = name;
    this.symbol = symbol;
    this.pDecimals = pDecimals;
    this.balance = balance;
    this.nanoBalance = nanoBalance;
  }
}

export default TokenInfo;