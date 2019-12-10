import React from 'react';
import SDK from 'papp-sdk';
import { withStyles } from '@material-ui/core/styles';
import BaseComponent from '../components/BaseComponent';
import Copy from '../components/Copy';

class CurrentTokenInfo extends BaseComponent {
  state = {
    tokenInfo: null
  };

  componentDidMount() {
    SDK.onTokenInfoChange(tokenInfo => {
      this.setState({ tokenInfo });
    })
  }

  render() {
    const { tokenInfo } = this.state;
    const { classes } = this.props;

    if (!tokenInfo) return null;

    return (
      <div>
        {
          Object.entries(tokenInfo).map(([key, value]) => (
            <div className={classes.item}>
              <div className={classes.labelBox}>
                <span className={classes.label}>{key}</span>
              </div>
              <div className={classes.valueBox}>
                <Copy text={value}>
                  <span className={classes.value}>{value}</span>
                </Copy>
              </div>
            </div>
          ))
        }
      </div>
    );
  }
};


const styles = {
  item: {
    borderBottom: 'dotted 1px',
    padding: '15px 0px',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  labelBox: {
    flexBasis: 140,
  },
  valueBox: {
    display: 'flex',
    flex: 1
  },
  label: {
    textTransform: 'uppercase',
    marginRight: 20,
    fontWeight: 500
  },
  value: {}
};

export default withStyles(styles)(CurrentTokenInfo);