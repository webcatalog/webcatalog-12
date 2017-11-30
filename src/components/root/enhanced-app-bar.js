import React from 'react';
import PropTypes from 'prop-types';

import AddIcon from 'material-ui-icons/Add';
import AppBar from 'material-ui/AppBar';
import Button from 'material-ui/Button';
import HelpIcon from 'material-ui-icons/Help';
import IconButton from 'material-ui/IconButton';
import InfoIcon from 'material-ui-icons/Info';
import Tabs, { Tab } from 'material-ui/Tabs';
import Toolbar from 'material-ui/Toolbar';
import common from 'material-ui/colors/common';

import connectComponent from '../../helpers/connect-component';

import FakeTitleBar from '../shared/fake-title-bar';

import { open as openDialogAbout } from '../../state/dialogs/about/actions';
import {
  changeRoute,
} from '../../state/root/router/actions';

import {
  ROUTE_INSTALLED_APPS,
  ROUTE_DIRECTORY,
} from '../../constants/routes';

import {
  STRING_CREATE_A_CUSTOM_APP,
  STRING_DIRECTORY,
  STRING_INSTALLED_APPS,
} from '../../constants/strings';

import { requestCheckForUpdates } from '../../senders/updater';
import { requestScanInstalledApps } from '../../senders/local';
import { requestOpenInBrowser } from '../../senders/generic';

const styles = theme => ({
  root: {
    zIndex: 1,
  },
  toolbar: {
    padding: '0 12px',
  },
  title: {
    flex: 1,
  },
  appBar: {
    zIndex: 1,
  },
  tabRoot: {
    flexGrow: 1,
  },
  leftIcon: {
    marginRight: theme.spacing.unit,
  },
});

class EnhancedAppBar extends React.Component {
  componentDidMount() {
    // start checking for installed apps only when the app is loaded.
    requestScanInstalledApps();
    requestCheckForUpdates();
  }

  render() {
    const {
      classes,
      onChangeRoute,
      onOpenDialogAbout,
      route,
    } = this.props;

    return (
      <div className={classes.root}>
        <FakeTitleBar />
        <AppBar position="static" className={classes.appBar} elevation={3}>
          <Toolbar className={classes.toolbar}>
            <Tabs
              className={classes.title}
              value={route}
              onChange={(e, val) => onChangeRoute(val)}
              indicatorColor={common.fullWhite}
            >
              <Tab
                value={ROUTE_DIRECTORY}
                label={STRING_DIRECTORY}
              />
              <Tab
                value={ROUTE_INSTALLED_APPS}
                label={STRING_INSTALLED_APPS}
              />
            </Tabs>
            <Button color="contrast">
              <AddIcon className={classes.leftIcon} />
              {STRING_CREATE_A_CUSTOM_APP}
            </Button>
            <IconButton
              aria-owns="info"
              aria-haspopup="true"
              onClick={() => requestOpenInBrowser('https://webcatalog.io/help')}
              color="contrast"
            >
              <HelpIcon />
            </IconButton>
            <IconButton
              aria-owns="info"
              aria-haspopup="true"
              onClick={onOpenDialogAbout}
              color="contrast"
            >
              <InfoIcon />
            </IconButton>
          </Toolbar>

        </AppBar>
      </div>
    );
  }
}

EnhancedAppBar.propTypes = {
  classes: PropTypes.object.isRequired,
  onChangeRoute: PropTypes.func.isRequired,
  onOpenDialogAbout: PropTypes.func.isRequired,
  route: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  route: state.router.route,
});

const actionCreators = {
  changeRoute,
  openDialogAbout,
};

export default connectComponent(
  EnhancedAppBar,
  mapStateToProps,
  actionCreators,
  styles,
);
