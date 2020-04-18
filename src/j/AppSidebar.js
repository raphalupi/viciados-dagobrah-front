import React from "react";
import PropTypes from "prop-types";

import { Drawer, Hidden, IconButton } from "@material-ui/core";
import { Close as CloseIcon } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";

import SidebarContent from "./SidebarContent";

const DRAWER_WIDTH = 200;

const useStyles = makeStyles(theme => ({
  drawer: {
    [theme.breakpoints.up("md")]: {
      width: DRAWER_WIDTH,
      flexShrink: 0
    }
  },
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: DRAWER_WIDTH
  },
  closeMenuButton: {
    marginRight: "auto",
    marginLeft: 0
  }
}));

function AppSidebar(props) {
  const { isSidebarOpen, onCloseClick, onToggleClick } = props;
  const classes = useStyles();

  return (
    <nav className={classes.drawer}>
      {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
      <Hidden mdUp implementation="css">
        <Drawer
          variant="temporary"
          open={isSidebarOpen}
          onClose={onToggleClick}
          classes={{
            paper: classes.drawerPaper
          }}
          ModalProps={{
            keepMounted: true // Better open performance on mobile.
          }}
        >
          <IconButton
            onClick={onToggleClick}
            className={classes.closeMenuButton}
          >
            <CloseIcon />
          </IconButton>
          <SidebarContent onLinkClick={onCloseClick} />
        </Drawer>
      </Hidden>
      <Hidden smDown implementation="css">
        <Drawer
          className={classes.drawer}
          variant="permanent"
          classes={{
            paper: classes.drawerPaper
          }}
        >
          <div className={classes.toolbar} />
          <SidebarContent onLinkClick={onCloseClick} />
        </Drawer>
      </Hidden>
    </nav>
  );
}

AppSidebar.propTypes = {
  isSidebarOpen: PropTypes.bool.isRequired,
  onCloseClick: PropTypes.func.isRequired,
  onToggleClick: PropTypes.func.isRequired
};

export default AppSidebar;
