import React from 'react';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  wrapper: {
    backgroundColor: theme.palette.primary.dark,
    color: theme.palette.primary.contrastText,
    padding: theme.spacing(1),
    [theme.breakpoints.up('sm')]: {
      padding: theme.spacing(2)
    }
  }
}));

function Footer() {
  const classes = useStyles();
  return <div className={classes.wrapper}>FOOTER</div>;
}

export default Footer;
