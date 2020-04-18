import React from 'react';
import PropTypes from 'prop-types';

import { AppBar, IconButton, Toolbar, Typography } from '@material-ui/core';
import { Menu as MenuIcon } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('md')]: {
      display: 'none'
    }
  }
}));

function AppHeader(props) {
  const { onOpenClick } = props;
  const classes = useStyles();

  return (
    <AppBar position="fixed" className={classes.appBar}>
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="Open drawer"
          edge="start"
          onClick={onOpenClick}
          className={classes.menuButton}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" noWrap>
          GA-nalysis
        </Typography>
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
