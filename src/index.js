import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
// import * as serviceWorker from "./serviceWorker";

import CssBaseline from '@material-ui/core/CssBaseline';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import colorGrey from '@material-ui/core/colors/grey';
import colorTeal from '@material-ui/core/colors/teal';

import './c/index.scss';
import App from './j/App';

const theme = createMuiTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 425,
      md: 769,
      lg: 1025,
      xl: 1300
    }
  },
  palette: {
    primary: {
      main: colorGrey['800']
    },
    secondary: {
      main: colorTeal['500']
    }
  }
});

render(
  <React.Fragment>
    <CssBaseline />
    <Router>
      <MuiThemeProvider theme={theme}>
        <App />
      </MuiThemeProvider>
    </Router>
  </React.Fragment>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();
