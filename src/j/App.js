import React from 'react';

import { makeStyles } from '@material-ui/core/styles';

import AppContent from './AppContent';
import AppSidebar from './appSidebar/AppSidebar';
import AppHeader from './appHeader/AppHeader';
// import Footer from "./Footer";

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    minHeight: '100vh'
  },
  contentWrapper: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between', // so Footer remains on the bottom
    // Adjusts spacing from top based on toolbar height
    marginTop: 56,
    [`${theme.breakpoints.up('xs')} and (orientation: landscape)`]: {
      marginTop: 46
    },
    [theme.breakpoints.up('sm')]: {
      marginTop: 64
    }
  }
}));

export default function App() {
  const classes = useStyles();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  function handleDrawerToggle() {
    setIsSidebarOpen(!isSidebarOpen);
  }

  function handleDrawerClose() {
    setIsSidebarOpen(false);
  }

  return (
    <div className={classes.root}>
      <AppHeader onOpenClick={handleDrawerToggle} />
      <AppSidebar
        isSidebarOpen={isSidebarOpen}
        onCloseClick={handleDrawerClose}
        onToggleClick={handleDrawerToggle}
      />

      <main className={classes.contentWrapper}>
        <AppContent />
        {/* <Footer /> */}
      </main>
    </div>
  );
}
