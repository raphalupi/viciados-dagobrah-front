import React from 'react';
import PropTypes from 'prop-types';
import { Link, useRouteMatch } from 'react-router-dom';
import { ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

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

export default SidebarLinkListItem;
