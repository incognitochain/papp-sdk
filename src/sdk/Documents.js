import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import BaseComponent from '../components/BaseComponent';
import Copy from '../components/Copy';

const DOCS = [
  {
    id: 1,
    label: 'Client SDK',
    link: 'https://github.com/incognitochain/sdk/tree/papp-client-sdk'
  },
  {
    id: 2,
    label: 'Rolldice Client App',
    link: 'https://github.com/incognitochain/sdk/tree/rolldice-client-papp'
  },
  {
    id: 3,
    label: 'Server SDK',
    link: 'https://github.com/incognitochain/sdk'
  },
  {
    id: 4,
    label: 'Rolldice Server App',
    link: 'https://github.com/incognitochain/sdk/tree/rolldice-backend-papp'
  },
  {
    id: 5,
    label: 'Hello World App',
    link: 'https://github.com/incognitochain/sdk/tree/hello-world-papp'
  },
];
class Documents extends BaseComponent {

  render() {
    const { classes } = this.props;

    return (
      <Container>
        {
          DOCS.map(({ id, label, link }) => (
            <Card key={id} className={classes.item}>
              <CardContent>
                <a href={link} className={classes.link}><span>{label}</span></a>
                <Copy text={link}>
                  {link}
                </Copy>
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
  link: {
    display: 'block',
    marginBottom: 10
  }
};


export default withStyles(styles)(Documents);