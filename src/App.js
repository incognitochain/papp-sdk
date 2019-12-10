import React, { Component } from 'react';
import { Container } from '@material-ui/core';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Typography from '@material-ui/core/Typography';
import PaymentAddress from './sdk/PaymentAddress';
import CurrentTokenInfo from './sdk/CurrentTokenInfo';
import ListTokenSupported from './sdk/ListTokenSupported';
import CheckCompatible from './sdk/CheckCompatible';
import SetListTokenSupported from './sdk/SetListTokenSupported';
import Constant from './sdk/Constant';
import Documents from './sdk/Documents';
import ChangePrivacyToken from './sdk/ChangePrivacyToken';
import RequestSendTx from './sdk/RequestSendTx';
import ErrorBoundary from './components/ErrorBoundary';
import Snackbar from './components/Snackbar';
import './App.css';

class App extends Component {
  state = {
    isCompatible: false,
    supportedTokens: null
  };

  componentDidMount() {
    const loadingEl = document.querySelector('#loading');
    if (loadingEl) {
      loadingEl.style.display = 'none';
    }
  }

  handleCheckCompatible = (isCompatible) => {
    this.setState({ isCompatible });
  }

  handleChangeListSupported = list => {
    this.setState({ supportedTokens: list });
  }

  renderSdkComponent = () => {
    const { supportedTokens } = this.state;
    const catgories = [
      {
        label: 'Payment Address',
        component: <PaymentAddress />
      },
      {
        label: 'List of supported tokens',
        component: <ListTokenSupported onChange={this.handleChangeListSupported} />
      },
      {
        label: 'Set list of supported tokens',
        component: <SetListTokenSupported />
      },
      {
        label: 'Current Token Info',
        component: <CurrentTokenInfo />
      },
      {
        label: 'Select privacy token',
        component: <ChangePrivacyToken allTokens={supportedTokens} />
      },
      {
        label: 'Make a send request',
        component: <RequestSendTx />
      },
      {
        label: 'Constants',
        component: <Constant />
      },
      {
        label: 'SDKs & examples',
        component: <Documents />
      },
    ];
    return (
      <div>
        {catgories.map(catagory => (
          <ExpansionPanel>
            <ExpansionPanelSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography>{catagory.label}</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              {catagory.component}
            </ExpansionPanelDetails>
          </ExpansionPanel>
        ))}
      </div>
    );
  }

  render() {
    const { isCompatible } = this.state;

    return (
      <Container>
        <ErrorBoundary>
          <div className="App">
            <CheckCompatible onCheck={this.handleCheckCompatible} />
            { isCompatible ? this.renderSdkComponent() : null }
            <Snackbar />
          </div>
        </ErrorBoundary>
      </Container>
    );
  }
}

export default App;
