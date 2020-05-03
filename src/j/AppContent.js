import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';

// import AboutPage from "./about/AboutPage";
import SetupPage from './setup/SetupPage';

const useStyles = makeStyles(theme => ({
  wrapper: {
    paddingBottom: theme.spacing(2),
    paddingTop: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      paddingBottom: theme.spacing(3),
      paddingTop: theme.spacing(3)
    }
  },
  container: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column'
  }
}));

export default function AppContent() {
  const classes = useStyles();

  return (
    <div className={classes.wrapper}>
      <Container className={classes.container} maxWidth='md'>
        <Switch>
          <Route exact path='/'>
            Inside /
          </Route>
          <Route path='/setup'>
            <SetupPage />
          </Route>
        </Switch>
      </Container>
    </div>
  );
}
