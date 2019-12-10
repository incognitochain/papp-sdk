import React from 'react';
import SDK from 'papp-sdk';
import Button from '@material-ui/core/Button';
import BaseComponent from '../components/BaseComponent';

const { getStore, resetStore } = SDK;

class Store extends BaseComponent {
  state = {
    store: null,
  }

  handleGetStore = () => {
    const store = getStore();
    this.setState({ store });
  }

  handleResetStore = () => {
    resetStore();
    const store = getStore();
    this.setState({ store });
  }

  render() {
    const { store } = this.state;
    return (
      <div>
        <Button onClick={this.handleGetStore}>Get store</Button>
        <Button onClick={this.handleResetStore}>Reset store</Button>

        <p>{JSON.stringify(store)}</p>
      </div>
    );
  }
};

export default Store;