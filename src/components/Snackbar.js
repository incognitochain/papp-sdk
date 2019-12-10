import React, { Component } from 'react';
import Snackbar from '@material-ui/core/Snackbar';

let com;

export function showMessage(msg) {
  if (com && com.showMessage) {
    com.showMessage(msg);
  }
}

class MySnackbar extends Component {
  state = { open: false, message: null }

  componentDidMount() {
    com = this;
  }

  handleClose = () => {
    this.setState({ open: false });
  }

  showMessage = (msg) => {
    this.setState({ message: msg, open: true });
  }

  render() {
    const { open, message } = this.state;

    return (
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        open={open}
        autoHideDuration={6000}
        onClose={this.handleClose}
        message={message}
      />
    );
  }
};

export default MySnackbar;