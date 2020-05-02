import React from 'react';
import PropTypes from 'prop-types';
import { AppBar, IconButton, Toolbar, Typography } from '@material-ui/core';
import { Menu as MenuIcon } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';

import logoImage from '../i/logo192.png';
import LangChanger from './i18n/LangChanger';

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
        <img alt='logo' className={classes.logoImg} src={logoImage} />
        <Typography className={classes.title} noWrap variant='h6'>
          GA-nalysis
        </Typography>
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
