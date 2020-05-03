import React from 'react';
import { Typography } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';

import logoImage from '../../i/logo192.png';

const useStyles = makeStyles(theme => ({
  wrapper: {
    display: 'flex',
    flexGrow: 1
  },
  link: {
    display: 'inline-flex',
    padding: '0 5px',
    textDecoration: 'none'
  },
  logoImg: {
    height: 32,
    marginRight: theme.spacing(1),
    width: 32
  },
  title: {
    color: theme.palette.common.white
  }
}));

function AppLogo() {
  const classes = useStyles();

  return (
    <div className={classes.wrapper}>
      <Link className={classes.link} to='/'>
        <img alt='logo' className={classes.logoImg} src={logoImage} />
        <Typography className={classes.title} noWrap variant='h6'>
          GA-nalysis
        </Typography>
      </Link>
    </div>
  );
}

export default AppLogo;
