import React from 'react';
import SDK from 'papp-sdk';
import { withStyles } from '@material-ui/core/styles';
import Checkbox from '@material-ui/core/Checkbox';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormHelperText from '@material-ui/core/FormHelperText';
import Container from '@material-ui/core/Container';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import BaseComponent from '../components/BaseComponent';
import { showMessage } from '../components/Snackbar';

const { SUPPORTED_TOKEN } = SDK;

class SetListTokenSupported extends BaseComponent {
  state = {
    allTokens: SUPPORTED_TOKEN,
    supportedTokenIds: [],
    customId: null
  };

  componentDidUpdate(prevProps, prevState) {
    const { supportedTokenIds } = this.state;
    const { supportedTokenIds: oldSupportedTokenIds } = prevState;

    if (supportedTokenIds.length !== oldSupportedTokenIds.length) {
      SDK.setListSupportTokenById(supportedTokenIds);
    }
  }
  
  handleChange = (tokenId) => event => {
    const checked = event.target.checked;
    this.setState(({ supportedTokenIds }) => {
      return {
        supportedTokenIds: checked ? [...supportedTokenIds, tokenId] : supportedTokenIds.filter(id => id !== tokenId)
      };
    });
  }

  onAddCustomTokenId = () => {
    this.setState(({ allTokens, customId }) => {
      if (typeof customId === 'string' && customId.length === 64) {
        return ({
          allTokens: {
            ...allTokens,
            [customId]: customId
          }
        });
      } else {
        showMessage('Please enter a valid token ID');
      }
    });
  }

  render() {
    const { supportedTokenIds, customId, allTokens } = this.state;
    const { classes } = this.props;

    return (
      <Container>
        <FormControl component="fieldset">
          <FormLabel component="legend">Select tokens that the app will support</FormLabel>
          <FormGroup>
            {
              Object.entries(allTokens).map(([symbol, tokenId]) => (
                <FormControlLabel
                  key={tokenId}
                  control={
                    <Checkbox checked={supportedTokenIds.includes(tokenId)} onChange={this.handleChange(tokenId)} value={tokenId} />
                  }
                  label={symbol}
                />
              ))
            }
          </FormGroup>
        </FormControl>
        <FormControl className={classes.addCustomToken}>
          <TextField className={classes.customTokenInput} id="standard-basic" label="Custom token ID" onChange={e => this.setState({ customId: e.target.value })} value={customId} />
          <Button variant="contained" onClick={this.onAddCustomTokenId}>Add</Button>
        </FormControl>
        <FormHelperText>
          <span>* Only works with the tokens are in following list of current account.</span>
        </FormHelperText>
      </Container>
    );
  }
};


const styles = {
  addCustomToken: {
    display: 'flex',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  customTokenInput: {
    flex: 1,
  }
};

export default withStyles(styles)(SetListTokenSupported);