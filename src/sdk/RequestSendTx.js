import React from 'react';
import SDK from 'papp-sdk';
import { withStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import IconButton from '@material-ui/core/IconButton';
import RemoveIcon from '@material-ui/icons/Remove';
import BaseComponent from '../components/BaseComponent';
import { showMessage } from '../components/Snackbar';
import Copy from '../components/Copy';

const { requestSendTx } = SDK;

class RequestSendTx extends BaseComponent {
  state = {
    paymentAddress: null,
    nanoAmount: null,
    message: null,
    tx: null,
    receivers: {}
  };
  
  handleChangeText = (field) => event =>  {
    const value = event.target.value;

    this.setState({ [field]: value });
  }

  handleSendRequest = async () => {
    const { message, receivers } = this.state;
    const receiverList = Object.entries(receivers);

    if (receiverList.length) {
      const tx = await requestSendTx({ receivers: receiverList, info: message });
      this.setState({ tx });
    } else {
      showMessage('Payment address and nano amount are required');
    }
  }

  handleAddReceiver = () => {
    try {
      this.setState(({ receivers, paymentAddress, nanoAmount }) => ({
        receivers: {
          ...receivers,
          [paymentAddress]: Number(nanoAmount) || 0
        },
        paymentAddress: '',
      }));
    } catch (e) {
      console.error(e);
    }
  }

  handleRemoveReceiver = (paymentAddress) => {
    try {
      this.setState(({ receivers }) => {
        delete receivers[paymentAddress];
        return { receivers };
      });
    } catch (e) {
      console.error(e);
    }
  }

  render() {
    const { message, nanoAmount, paymentAddress, tx, receivers } = this.state;
    const { classes } = this.props;
    const receiverList = Object.entries(receivers);

    return (
      <Container className={classes.root}>
        <div>
          {
            receiverList && receiverList.map(([address, nanoAmount]) => (
              <div className={classes.receiverItemContainer}>
                <div className={classes.receiverItemInfo}>
                  <span className={classes.receiverAddress}>{address}</span>
                  <span className={classes.receiverAmount}>Amount: {nanoAmount}</span>
                </div>
                <IconButton className={classes.removeReceiverBtn} variant="contained" onClick={() => this.handleRemoveReceiver(address)}><RemoveIcon /></IconButton>
              </div>
            ))
          }
        </div>
        <div className={classes.addReceiverContainer}>
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
          <Button variant="contained"  onClick={this.handleAddReceiver} disabled={!paymentAddress || !nanoAmount}>
            Add Receiver
          </Button>
        </div>
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
  txID: {},
  addReceiverContainer: {
  },
  receiverItemContainer: {
    display: 'flex',
    flexDirection: 'row',
    flex: 1,
  },
  receiverItemInfo: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    width: 'calc(100% - 40px)'
  },
  receiverAddress: {
    width: '100%',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    textAlign: 'left'
  },
  receiverAmount: {
    width: '100%',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    fontSize: 12,
    color: 'green',
    textAlign: 'left'
  },
  removeReceiverBtn: {
    width: 40,
  },
};

export default withStyles(styles)(RequestSendTx);