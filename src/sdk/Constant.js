import React from 'react';
import SDK from 'papp-sdk';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Container from '@material-ui/core/Container';
import CardHeader from '@material-ui/core//CardHeader';
import BaseComponent from '../components/BaseComponent';

const { ERROR_CODE, SUPPORTED_TOKEN, } = SDK;

class Constant extends BaseComponent {

  render() {
    const { classes } = this.props;

    return (
      <Container>
        {
          Object.entries({ ERROR_CODE, SUPPORTED_TOKEN }).map(([key, value]) => (
            <Card key={key} className={classes.item}>
              <CardHeader title={
                <span className={classes.constantName}>{key}</span>
              } />
              <CardContent className={classes.content}>
                <ul>
                  {Object.keys(value).map(code => (
                    <li key={code}>{code}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))
        }
      </Container>
    );
  }
};


const styles = {
  item: {
    marginTop: 10,
    marginBottom: 20
  },
  constantName: {
    fontWeight: 500,
    fontSize: 18
  },
  content: {
    margin: 0
  }
};


export default withStyles(styles)(Constant);