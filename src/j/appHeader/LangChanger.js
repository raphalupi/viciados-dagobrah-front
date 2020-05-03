import React, { Fragment, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Typography
} from '@material-ui/core';
import {
  KeyboardArrowDown as KeyboardArrowDownIcon,
  Translate as TranslateIcon
} from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';

import LocalStorageHelper from '../utils/LocalStorageHelper';
import { PREFERED_LANG_CODE } from '../utils/LocalStorageKeys';

const languages = [
  {
    langCode: 'en-US',
    langName: 'English'
  },
  {
    langCode: 'pt-BR',
    langName: 'Português'
  }
];

const useStyles = makeStyles(theme => ({
  wrapper: {
    color: theme.palette.common.white,
    borderRadius: 5,
    justifySelf: 'flex-end',
    padding: '6px 8px',
    '&:hover': {
      backgroundColor: theme.palette.primary.dark
    }
  },
  icon: {
    display: 'inline-block',
    marginRight: 0,
    [theme.breakpoints.only('sm')]: {
      display: 'none'
    },
    [theme.breakpoints.up('sm')]: {
      marginRight: theme.spacing(1)
    }
  },
  text: {
    display: 'none',
    textTransform: 'uppercase',
    [theme.breakpoints.up('sm')]: {
      display: 'block'
    }
  },
  chevronDown: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'inline-block'
    }
  }
}));

function LangChanger() {
  const { t, i18n } = useTranslation();
  const classes = useStyles();

  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const currentLanguage = i18n.language;

  const handleLangChange = lang => {
    if (currentLanguage !== lang) {
      i18n.changeLanguage(lang);
      LocalStorageHelper.set(PREFERED_LANG_CODE, lang);
    }
    setIsLangMenuOpen(false);
  };

  const handleLangMenuOpen = event => {
    setAnchorEl(event.currentTarget);
    setIsLangMenuOpen(true);
  };

  const handleLangMenuClose = () => {
    setAnchorEl(null);
    setIsLangMenuOpen(false);
  };

  return (
    <Fragment>
      <Tooltip title={t('nav.langChanger.tooltip')}>
        <IconButton
          aria-controls='simple-menu'
          aria-haspopup='true'
          className={classes.wrapper}
          onClick={handleLangMenuOpen}
        >
          <TranslateIcon className={classes.icon} />
          <Typography className={classes.text}>{i18n.language}</Typography>
          <KeyboardArrowDownIcon className={classes.chevronDown} />
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        id='simple-menu'
        keepMounted
        open={isLangMenuOpen}
        onClose={handleLangMenuClose}
      >
        {languages.map(l => (
          <MenuItem
            key={l.langCode}
            onClick={() => handleLangChange(l.langCode)}
            selected={l.langCode === currentLanguage}
          >
            {l.langName}
          </MenuItem>
        ))}
      </Menu>
    </Fragment>
  );
}

LangChanger.propTypes = {};

export default LangChanger;
