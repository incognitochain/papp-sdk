import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import copy from 'copy-to-clipboard';
import { showMessage } from './Snackbar';

class Copy extends Component {
  handleCopy = (text) => {
    try {
      copy(text);
      showMessage('Copied');
    } catch (e) {
      showMessage('Can not copy it');
    }
  }

  render() {
    const { text, children, classes } = this.props;

    return (
      <div className={classes.root} onClick={() => this.handleCopy(text)}>
        <span className={classes.copyText}>Copy</span>
        <div className={classes.copyBox}>
          { typeof children === 'string' ? <span>{children}</span>  : children }
        </div>
      </div>
    );
  }
};

const styles = {
  root: {
    width: '100%',
    textAlign: 'left'
  },
  copyBox: {
    background: 'linea-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
    border: 'dotted 1px',
    borderRadius: 3,
    padding: '5px 10px',
  },
  copyText: {
    fontSize: 12,
    backgroundColor: 'black',
    color: 'white',
    padding: '3px 10px',
    borderRadius: '3px 3px 0px 0px',
  }
};

export default withStyles(styles)(Copy);