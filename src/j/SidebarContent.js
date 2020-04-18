import React from 'react';
import PropTypes from 'prop-types';
import { Link, useRouteMatch } from 'react-router-dom';

import { List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import BuildIcon from '@material-ui/icons/Build';
import DashboardIcon from '@material-ui/icons/Dashboard';
// import InfoIcon from '@material-ui/icons/Info';
// import WcIcon from '@material-ui/icons/Wc';
// import WidgetsIcon from '@material-ui/icons/Widgets';

const useStyles = makeStyles(() => ({
  listIcon: {
    minWidth: 40
  }
}));

const links = [
  {
    icon: <DashboardIcon />,
    isExactPath: true,
    label: 'Summary',
    to: '/'
  },
  {
    icon: <BuildIcon />,
    label: 'Setup',
    to: '/setup'
  }
  // {
  //   icon: <WcIcon />,
  //   label: 'Compare Collections',
  //   to: '/compare-collections'
  // },
  // {
  //   icon: <WidgetsIcon />,
  //   label: 'Compare Mods',
  //   to: '/compare-mods'
  // },
  // {
  //   icon: <InfoIcon />,
  //   label: 'About',
  //   to: '/about'
  // }
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

  return (
    <div>
      <List>
        {links.map(linkData => (
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
