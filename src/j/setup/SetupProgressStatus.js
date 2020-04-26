import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import { CircularProgress, Divider, Grid } from '@material-ui/core';
import {
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Warning as WarningIcon
} from '@material-ui/icons';
import Alert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';

import SWGOHAPIHelp from '../dataFetcher/SWGOHAPIHelp';
import LocalStorageHelper from '../utils/LocalStorageHelper';
import {
  ALLY_CODE_PLAYER,
  ALLY_CODE_OPPONENT,
  API_PLAYER_DATA,
  API_PLAYER_DATA_LAST_FETCH_TS,
  API_OPPONENT_DATA,
  API_OPPONENT_DATA_LAST_FETCH_TS
} from '../utils/LocalStorageKeys';

const useStyles = makeStyles(theme => ({
  alertIcon: {
    color: theme.palette.warning.main
  },
  taskStatusContainer: {
    display: 'flex',
    flexDirection: 'column'
  },
  taskStatusItem: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: theme.spacing(1)
  },
  taskStatusTitle: { display: 'flex', flexDirection: 'row' },
  taskStatusLabel: { breakAfter: 'always', marginLeft: theme.spacing(1) },
  taskStatusErrorMessage: { color: theme.palette.error.dark },
  taskStatusWarningMessage: { color: theme.palette.warning.dark }
}));

const DATA_FETCH_STATUS_ERROR = 'ERROR';
const DATA_FETCH_STATUS_IGNORED = 'IGNORED';
const DATA_FETCH_STATUS_SUCCESS = 'SUCCESS';
const REQUEST_THROTTLE_HOURS = 2; // prevents a new request within X hours
const SELF_CLOSE_TIMEOUT_MS = 5000;

function SetupProgressStatus(props) {
  let selfCloseModalTimeout = null;
  const classes = useStyles();

  // Player states
  const [playerDataStatus, setPlayerDataStatus] = useState(null);
  const [playerDataErrorMessage, setPlayerDataErrorMessage] = useState(null);
  const [playerDataWarningMessage, setPlayerDataWarningMessage] = useState(
    null
  );
  const [
    playerHasStartedLoadingData,
    setPlayerHasStartedLoadingData
  ] = useState(false);
  const [
    playerHasFinishedLoadingData,
    setPlayerHasFinishedLoadingData
  ] = useState(false);
  const [playerIsLoadingData, setPlayerIsLoadingData] = useState(false);

  // Opponent states
  const [opponentDataStatus, setOpponentDataStatus] = useState(null);
  const [opponentDataErrorMessage, setOpponentDataErrorMessage] = useState(
    null
  );
  const [opponentDataWarningMessage, setOpponentDataWarningMessage] = useState(
    null
  );
  const [
    opponentHasStartedLoadingData,
    setOpponentHasStartedLoadingData
  ] = useState(false);
  const [
    opponentHasFinishedLoadingData,
    setOpponentHasFinishedLoadingData
  ] = useState(false);
  const [opponentIsLoadingData, setOpponentIsLoadingData] = useState(false);

  // Setup and Teardown
  useEffect(() => {
    if (canFetchPlayerData()) {
      fetchPlayerData();
      setPlayerHasStartedLoadingData(true);
    } else {
      setPlayerDataStatus(DATA_FETCH_STATUS_IGNORED);
      setPlayerHasFinishedLoadingData(true);
      setPlayerDataWarningMessage(
        'Requested less than 2 hours ago. Using stored data instead.'
      );
    }

    if (canFetchOpponentData()) {
      fetchOpponentData();
      setOpponentHasStartedLoadingData(true);
    } else {
      setOpponentDataStatus(DATA_FETCH_STATUS_IGNORED);
      setOpponentHasFinishedLoadingData(true);
      setOpponentDataWarningMessage(
        'Requested less than 2 hours ago. Using stored data instead.'
      );
    }

    return () => {
      if (selfCloseModalTimeout !== null) {
        clearTimeout(selfCloseModalTimeout);
        selfCloseModalTimeout = null;
      }
    };
  }, []);

  const requestRanShortlyBefore = key => {
    const storedLastFetchTime = LocalStorageHelper.get(key);
    const lastFetchTime = storedLastFetchTime
      ? moment(storedLastFetchTime)
      : null;

    if (lastFetchTime === null) return false;

    return (
      Math.abs(lastFetchTime.diff(moment(), 'hours', true)) <=
      REQUEST_THROTTLE_HOURS
    );
  };

  const canFetchPlayerData = () => {
    return (
      !requestRanShortlyBefore(API_PLAYER_DATA_LAST_FETCH_TS) &&
      !playerHasStartedLoadingData
    );
  };

  const canFetchOpponentData = () => {
    return (
      !requestRanShortlyBefore(API_OPPONENT_DATA_LAST_FETCH_TS) &&
      !opponentHasStartedLoadingData
    );
  };

  const fetchPlayerData = () => {
    setPlayerIsLoadingData(true);
    getAccountData(
      props.allyCodePlayer,
      handlePlayerDataSuccess,
      handlePlayerDataError
    );
  };

  const fetchOpponentData = () => {
    setOpponentIsLoadingData(true);
    getAccountData(
      props.allyCodeOpponent,
      handleOpponentDataSuccess,
      handleOpponentDataError
    );
  };

  const getAccountData = (allyCode, onSuccess, onError) => {
    SWGOHAPIHelp.fetchPlayerData(allyCode, onSuccess, onError);
  };

  const handlePlayerDataSuccess = data => {
    setPlayerDataStatus(DATA_FETCH_STATUS_SUCCESS);
    setPlayerHasFinishedLoadingData(true);
    setPlayerIsLoadingData(false);

    LocalStorageHelper.set(ALLY_CODE_PLAYER, props.allyCodePlayer);
    if (Array.isArray(data) && data.length >= 1) {
      LocalStorageHelper.set(API_PLAYER_DATA, JSON.stringify(data[0], null, 0));
      LocalStorageHelper.set(API_PLAYER_DATA_LAST_FETCH_TS, moment().format());
    }
  };

  const handlePlayerDataError = error => {
    console.error('handlePlayerDataError', error);
    setPlayerDataStatus(DATA_FETCH_STATUS_ERROR);
    setPlayerHasFinishedLoadingData(true);
    setPlayerIsLoadingData(false);
    setPlayerDataErrorMessage('TEST ERROR');
  };

  const handleOpponentDataSuccess = data => {
    setOpponentDataStatus(DATA_FETCH_STATUS_SUCCESS);
    setOpponentHasFinishedLoadingData(true);
    setOpponentIsLoadingData(false);

    LocalStorageHelper.set(ALLY_CODE_OPPONENT, props.allyCodeOpponent);
    if (Array.isArray(data) && data.length >= 1) {
      LocalStorageHelper.set(
        API_OPPONENT_DATA,
        JSON.stringify(data[0], null, 0)
      );
      LocalStorageHelper.set(
        API_OPPONENT_DATA_LAST_FETCH_TS,
        moment().format()
      );
    }
  };

  const handleOpponentDataError = error => {
    console.error('handleOpponentDataError', error);
    setOpponentDataStatus(DATA_FETCH_STATUS_ERROR);
    setOpponentHasFinishedLoadingData(true);
    setOpponentIsLoadingData(false);
    setOpponentDataErrorMessage('TEST ERROR');
  };

  const shouldShowSuccessAlert = () => {
    const shouldShow =
      playerHasFinishedLoadingData &&
      opponentHasFinishedLoadingData &&
      (playerDataStatus === DATA_FETCH_STATUS_SUCCESS ||
        playerDataStatus === DATA_FETCH_STATUS_IGNORED) &&
      (opponentDataStatus === DATA_FETCH_STATUS_SUCCESS ||
        opponentDataStatus === DATA_FETCH_STATUS_IGNORED);

    if (shouldShow && selfCloseModalTimeout === null) {
      selfCloseModalTimeout = setTimeout(() => {
        props.onFinish();
      }, SELF_CLOSE_TIMEOUT_MS);
    }

    return shouldShow;
  };

  const shouldShowFailureAlert = () => {
    return (
      playerHasFinishedLoadingData &&
      opponentHasFinishedLoadingData &&
      (playerDataStatus.dataStatus === DATA_FETCH_STATUS_ERROR ||
        opponentDataStatus.dataStatus === DATA_FETCH_STATUS_ERROR)
    );
  };

  const getPlayerDataLoadingIcon = () => {
    if (playerIsLoadingData) {
      return <CircularProgress size={14} />;
    } else if (playerHasFinishedLoadingData) {
      if (playerDataStatus === DATA_FETCH_STATUS_SUCCESS) {
        return <CheckCircleIcon color='secondary' fontSize='small' />;
      } else if (playerDataStatus === DATA_FETCH_STATUS_IGNORED) {
        return (
          <WarningIcon
            className={classes.alertIcon}
            color='primary'
            fontSize='small'
          />
        );
      } else {
        return <ErrorIcon color='error' fontSize='small' />;
      }
    }
  };

  const getOpponentDataLoadingIcon = () => {
    if (opponentIsLoadingData) {
      return <CircularProgress size={14} />;
    } else if (opponentHasFinishedLoadingData) {
      if (opponentDataStatus === DATA_FETCH_STATUS_SUCCESS) {
        return <CheckCircleIcon color='secondary' fontSize='small' />;
      } else if (opponentDataStatus === DATA_FETCH_STATUS_IGNORED) {
        return (
          <WarningIcon
            className={classes.alertIcon}
            color='primary'
            fontSize='small'
          />
        );
      } else {
        return <ErrorIcon color='error' fontSize='small' />;
      }
    }
  };

  return (
    <div className='wrapper'>
      <Grid container spacing={2}>
        {shouldShowFailureAlert() && (
          <Alert severity='error'>
            Error fetching player data.
            <br />
            See errors below to identify the cause, close this modal and try
            again later.
          </Alert>
        )}
        {shouldShowSuccessAlert() && (
          <Alert severity='success'>
            Player data fetched successfully!
            <br />
            Redirecting to the dashboard...
          </Alert>
        )}

        <Grid item sm={6} xs={12}>
          For user <strong>{props.allyCodePlayer}</strong>
          <Divider />
          <div className={classes.taskStatusContainer}>
            <div className={classes.taskStatusItem}>
              <div className={classes.taskStatusTitle}>
                <div className={classes.taskStatusIcon}>
                  {getPlayerDataLoadingIcon()}
                </div>
                <div className={classes.taskStatusLabel}>API data</div>
              </div>
              {playerDataWarningMessage ? (
                <div className={classes.taskStatusWarningMessage}>
                  {playerDataWarningMessage}
                </div>
              ) : null}
              {playerDataErrorMessage ? (
                <div className={classes.taskStatusErrorMessage}>
                  {playerDataErrorMessage}
                </div>
              ) : null}
            </div>
          </div>
        </Grid>
        <Grid item sm={6} xs={12}>
          For user <strong>{props.allyCodeOpponent}</strong>
          <Divider />
          <div className={classes.taskStatusContainer}>
            <div className={classes.taskStatusItem}>
              <div className={classes.taskStatusTitle}>
                <div className={classes.taskStatusIcon}>
                  {getOpponentDataLoadingIcon()}
                </div>
                <div className={classes.taskStatusLabel}>API data</div>
              </div>
              {opponentDataWarningMessage ? (
                <div className={classes.taskStatusWarningMessage}>
                  {opponentDataWarningMessage}
                </div>
              ) : null}
              {opponentDataErrorMessage ? (
                <div className={classes.taskStatusErrorMessage}>
                  {opponentDataErrorMessage}
                </div>
              ) : null}
            </div>
          </div>
        </Grid>
      </Grid>
    </div>
  );
}

SetupProgressStatus.propTypes = {
  allyCodePlayer: PropTypes.string.isRequired,
  allyCodeOpponent: PropTypes.string.isRequired,
  onFinish: PropTypes.func.isRequired
};

export default SetupProgressStatus;
