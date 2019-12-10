import React from 'react';
import SDK from 'papp-sdk';
import BaseComponent from '../components/BaseComponent';
import Copy from '../components/Copy';

class PaymentAddress extends BaseComponent {
  state = {
    paymentAddress: null
  };

  componentDidMount() {
    SDK.onPaymentAddressChange(paymentAddress => {
      this.setState({ paymentAddress });
    })
  }

  render() {
    const { paymentAddress } = this.state;

    if (!paymentAddress) return null;

    return (
      <div>
        <Copy text={paymentAddress}>{paymentAddress}</Copy>
      </div>
    );
  }
};

export default PaymentAddress;