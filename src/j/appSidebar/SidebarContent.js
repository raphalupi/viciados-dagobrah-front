import React from 'react';
import PropTypes from 'prop-types';
import { Link, useRouteMatch } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import {
  Build as BuildIcon,
  Dashboard as DashboardIcon
} from '@material-ui/icons';

const useStyles = makeStyles(theme => ({
  listItem: {
    '&.Mui-selected .MuiListItemIcon-root': {
      color: theme.palette.secondary.main
    }
  },
  listIcon: {
    minWidth: 40
  }
}));

const links = [
  {
    icon: <DashboardIcon />,
    isExactPath: true,
    i18nLabelKey: 'sidebar.links.dashboard',
    to: '/'
  },
  {
    icon: <BuildIcon />,
    i18nLabelKey: 'sidebar.links.setup',
    to: '/setup'
  }
];

function SidebarLinkListItem(props) {
  const { linkData, onLinkClick } = props;
  const classes = useStyles();

  let match = useRouteMatch({
    path: linkData.to,
    exact: !!linkData.isExactPath
  });

  const CustomLink = React.useMemo(
    () =>
      React.forwardRef((linkProps, ref) => (
        <Link ref={ref} to={linkData.to} {...linkProps} />
      )),
    [linkData.to]
  );

  return (
    <ListItem
      button
      className={classes.listItem}
      component={CustomLink}
      onClick={onLinkClick}
      selected={!!match}
    >
      <ListItemIcon className={classes.listIcon}>{linkData.icon}</ListItemIcon>
      <ListItemText primary={linkData.label} />
    </ListItem>
  );
}

SidebarLinkListItem.propTypes = {
  linkData: PropTypes.shape({
    icon: PropTypes.any,
    isExactPath: PropTypes.bool,
    label: PropTypes.string.isRequired,
    to: PropTypes.string.isRequired
  }),
  onLinkClick: PropTypes.func.isRequired
};

function SidebarContent(props) {
  const { onLinkClick } = props;
  const { t } = useTranslation();

  const translatedLinks = links.map(l => {
    l.label = t(l.i18nLabelKey);
    return l;
  });

  return (
    <div>
      <List>
        {translatedLinks.map(linkData => (
          <SidebarLinkListItem
            key={linkData.label}
            linkData={linkData}
            onLinkClick={onLinkClick}
          />
        ))}
      </List>
    </div>
  );
}

SidebarContent.propTypes = {
  onLinkClick: PropTypes.func.isRequired
};

export default SidebarContent;
