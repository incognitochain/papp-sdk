import React from 'react';
import SDK from 'papp-sdk';
import { withStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import BaseComponent from '../components/BaseComponent';
import { showMessage } from '../components/Snackbar';
import Copy from '../components/Copy';

const { requestSendTx } = SDK;

class RequestSendTx extends BaseComponent {
  state = {
    paymentAddress: null,
    nanoAmount: null,
    message: null,
    tx: null
  };
  
  handleChangeText = (field) => event =>  {
    const value = event.target.value;

    this.setState({ [field]: value });
  }

  handleSendRequest = async () => {
    const { message, nanoAmount, paymentAddress } = this.state;

    if (nanoAmount && paymentAddress) {
      const tx = await requestSendTx(paymentAddress, Number(nanoAmount), message);
      this.setState({ tx });
    } else {
      showMessage('Payment address and nano amount are required');
    }
  }

  render() {
    const { message, nanoAmount, paymentAddress, tx } = this.state;
    const { classes } = this.props;

    return (
      <Container className={classes.root}>
        <TextField
          className={classes.input}
          id="standard-error-helper-text"
          label="Payment Address"
          value={paymentAddress}
          onChange={this.handleChangeText('paymentAddress')}
        />
        <TextField
          className={classes.input}
          id="standard-error-helper-text"
          label="Nano Amount"
          value={nanoAmount}
          type='number'
          onChange={this.handleChangeText('nanoAmount')}
          helperText='Integer number, larger than 0'
        />
        <TextField
          className={classes.input}
          id="standard-error-helper-text"
          label="Message (optional)"
          value={message}
          onChange={this.handleChangeText('message')}
          helperText='String, less than 512 bytes'
        />
        <Button variant="contained" onClick={this.handleSendRequest}>Send a request</Button>
        {
          tx && (
            <Card className={classes.txIDContainer}>
              <CardContent className={classes.txID}>
                <span>TX ID</span>
                <Copy text={tx.txId}>{tx.txId}</Copy>
              </CardContent>
            </Card>
          )
        }
      </Container>
    );
  }
};

const styles = {
  root: {
    textAlign: 'center'
  },
  input: {
    width: '100%',
    marginBottom: 10
  },
  txIDContainer: {
    marginTop: 10,
    marginBottom: 20,
    textAlign: 'initial'
  },
  txID: {}
};

export default withStyles(styles)(RequestSendTx);