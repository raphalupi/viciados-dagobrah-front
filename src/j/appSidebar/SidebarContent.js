import React from 'react';
import PropTypes from 'prop-types';

import { useTranslation } from 'react-i18next';
import { List } from '@material-ui/core';

import {
  Build as BuildIcon,
  Dashboard as DashboardIcon
} from '@material-ui/icons';

import SidebarLinkListItem from './SidebarLinkListItem';

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
