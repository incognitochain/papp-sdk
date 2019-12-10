import React from 'react';
import SDK from 'papp-sdk';
import Container from '@material-ui/core/Container';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import { showMessage } from '../components/Snackbar';
import BaseComponent from '../components/BaseComponent';

class ChangePrivacyToken extends BaseComponent {
  state = {
    currentTokenId: null
  };

  componentDidUpdate(prevProps, prevState) {
    const { currentTokenId } = this.state;
    const { currentTokenId: oldCurrentTokenId } = prevState;

    if (currentTokenId !== oldCurrentTokenId) {
      SDK.changePrivacyTokenById(currentTokenId);
      showMessage(`Switched to token ID ${currentTokenId}`);
    }
  }
  
  handleChange = event => {
    const currentTokenId = event.target.value;
    this.setState({ currentTokenId });
  }

  render() {
    const { currentTokenId } = this.state;
    const { allTokens } = this.props;


    return (
      <Container>
        <FormControl component="fieldset">
          <FormLabel component="legend">Select token will be used in the app</FormLabel>
          <RadioGroup aria-label="gender" name="gender2" value={currentTokenId} onChange={this.handleChange}>
            {
              allTokens && allTokens.map(({ id, name, symbol }) => (
                <FormControlLabel
                  key={id}
                  value={id}
                  control={<Radio color="primary" />}
                  label={`${symbol} (${name})`}
                  labelPlacement="end"
                />
              ))
            }
          </RadioGroup>
        </FormControl>
      </Container>
    );
  }
};

export default ChangePrivacyToken;