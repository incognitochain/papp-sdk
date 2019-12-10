import React from 'react';
import SDK from 'papp-sdk';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { withStyles } from '@material-ui/core/styles';
import BaseComponent from '../components/BaseComponent';
import Copy from '../components/Copy';

class ListTokenSupported extends BaseComponent {
  state = {
    tokens: null
  };

  componentDidMount() {
    const { onChange } = this.props;
    SDK.onSupportedTokenListChange(tokens => {
      this.setState({ tokens });
      onChange(tokens);
    })
  }

  render() {
    const { tokens } = this.state;
    const { classes } = this.props;

    if (!tokens) return null;

    return (
      <div>
        {
          tokens.map(({ id, name, symbol }) => (
            <Card className={classes.token}>
              <CardContent>
                {
                  Object.entries({ name, symbol, id, }).map(([key, value]) => (
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
              </CardContent>
            </Card>
          ))
        }
      </div>
    );
  }
};


const styles = {
  token: {
    marginTop: 10,
    marginBottom: 20,
    display: 'flex',
    flexDirection: 'column',
  },
  item: {
    borderBottom: 'dotted 1px',
    padding: '15px 0px',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  labelBox: {
    flexBasis: 90,
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

export default withStyles(styles)(ListTokenSupported);