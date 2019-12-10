import React from 'react';
import SDK from 'papp-sdk';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CancelIcon from '@material-ui/icons/Cancel';
import BaseComponent from '../components/BaseComponent';

class CheckCompatible extends BaseComponent {
  state = {
    isCompatible: false
  };

  componentDidMount() {
    const isCompatible = SDK.checkSDKCompatible();
    this.setState({ 
      isCompatible,
    }, () => {
      const { onCheck } = this.props;
      onCheck(isCompatible);
    })
  }

  render() {
    const { isCompatible } = this.state;
    const { classes } = this.props;

    return (
      <Card className={classes.root}>
        <CardContent className={classes.content}>
          { isCompatible ? <CheckCircleIcon color='inherit' /> : <CancelIcon color='error' /> }
          <span className={isCompatible ? classes.compatibleText:  classes.uncompatibleText}>
            SDK is {isCompatible ? 'compatible' : 'not compatible'} on this browser.
            {
              !isCompatible && ' Please make sure you are opening your app in the Incognito Wallet (PAPPS tab).'
            }
          </span>
          
        </CardContent>
      </Card>
    );
  }
};

const styles = {
  root: {
    marginTop: 10,
    marginBottom: 30
  },
  content: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    color: '#00c853'
  },
  compatibleText: {
    marginLeft: 10,
    color: '#00c853'
  },
  uncompatibleText: {
    marginLeft: 10,
    color: 'black'
  }
};

export default withStyles(styles)(CheckCompatible);