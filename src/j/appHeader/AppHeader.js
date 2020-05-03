import React from 'react';
import PropTypes from 'prop-types';
import { AppBar, IconButton, Toolbar } from '@material-ui/core';
import { Menu as MenuIcon } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';

import AppLogo from './AppLogo';
import LangChanger from './LangChanger';

const useStyles = makeStyles(theme => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1
  },
  menuButton: {
    marginRight: theme.spacing(1),
    [theme.breakpoints.up('md')]: {
      display: 'none'
    }
  },
  logoImg: {
    height: 32,
    marginRight: theme.spacing(1),
    width: 32
  },
  title: { flexGrow: 1 }
}));

function AppHeader(props) {
  const { onOpenClick } = props;
  const classes = useStyles();

  return (
    <AppBar position='fixed' className={classes.appBar}>
      <Toolbar>
        <IconButton
          color='inherit'
          aria-label='Open drawer'
          edge='start'
          onClick={onOpenClick}
          className={classes.menuButton}
        >
          <MenuIcon />
        </IconButton>
        <AppLogo />
        <LangChanger />
      </Toolbar>
    </AppBar>
  );
}

AppHeader.propTypes = {
  onOpenClick: PropTypes.func
};

AppHeader.defaultProps = {
  onOpenClick: () => {}
};

export default AppHeader;
