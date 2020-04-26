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
import AlertTitle from '@material-ui/lab/AlertTitle';
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
const REQUEST_THROTTLE_MINUTES = 30; // prevents a new request from a different ally code within X minutes
const REQUEST_THROTTLE_HOURS = 2; // prevents a new request for the same ally code within X hours
const SELF_CLOSE_TIMEOUT_MS = 3000;

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
    if (canFetchPlayerData()) fetchPlayerData();
    if (canFetchOpponentData()) fetchOpponentData();

    return () => {
      if (selfCloseModalTimeout !== null) {
        clearTimeout(selfCloseModalTimeout);
        selfCloseModalTimeout = null;
      }
    };
  }, []);

  // Checks if the time stored in 'key' happened more than 'amount' 'type'.
  // E.g.: type = 'minutes', amount = '30' will return true if stored timestamp is
  // over 30 minutes ago
  const isCurrentTimeGreaterThanStored = (key, type, amount) => {
    const storedLastFetchTime = LocalStorageHelper.get(key);
    const lastFetchTime = storedLastFetchTime
      ? moment(storedLastFetchTime)
      : null;

    if (lastFetchTime === null) return true;

    return Math.abs(lastFetchTime.diff(moment(), type, true)) >= amount;
  };

  const canFetchPlayerData = () => {
    return canFetchData(
      ALLY_CODE_PLAYER,
      API_PLAYER_DATA_LAST_FETCH_TS,
      props.allyCodePlayer,
      playerHasStartedLoadingData,
      setPlayerHasStartedLoadingData,
      setPlayerDataStatus,
      setPlayerHasFinishedLoadingData,
      setPlayerDataWarningMessage
    );
  };

  const canFetchOpponentData = () => {
    return canFetchData(
      ALLY_CODE_OPPONENT,
      API_OPPONENT_DATA_LAST_FETCH_TS,
      props.allyCodeOpponent,
      opponentHasStartedLoadingData,
      setOpponentHasStartedLoadingData,
      setOpponentDataStatus,
      setOpponentHasFinishedLoadingData,
      setOpponentDataWarningMessage
    );
  };

  const canFetchData = (
    allyCodeStoreKey,
    lastFetchTSStoreKey,
    allyCode,
    hasStartedLoadingData,
    hasStartedLoadingDataSetter,
    dataStatusSetter,
    hasFinishedLoadingDataSetter,
    dataWarningMessageSetter
  ) => {
    let canFetch = false;
    if (!hasStartedLoadingData) {
      hasStartedLoadingDataSetter(true);

      const storedAllyCode = LocalStorageHelper.get(allyCodeStoreKey);
      if (storedAllyCode !== allyCode) {
        // Changed ally codes can refresh every 30 minutes
        canFetch = isCurrentTimeGreaterThanStored(
          lastFetchTSStoreKey,
          'minutes',
          REQUEST_THROTTLE_MINUTES
        );

        if (!canFetch) {
          dataStatusSetter(DATA_FETCH_STATUS_IGNORED);
          hasFinishedLoadingDataSetter(true);
          dataWarningMessageSetter(
            `Last request for other ally code (${storedAllyCode}) was a few minutes ago. Try again later`
          );
        }
      } else {
        // Same ally codes can refresh every 2 hours
        canFetch = isCurrentTimeGreaterThanStored(
          lastFetchTSStoreKey,
          'hours',
          REQUEST_THROTTLE_HOURS
        );

        if (!canFetch) {
          dataStatusSetter(DATA_FETCH_STATUS_IGNORED);
          hasFinishedLoadingDataSetter(true);
          dataWarningMessageSetter(
            'Last request for this ally code was a few minutes. Try again later.'
          );
        }
      }

      return canFetch;
    }
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

    storeDataState(props.allyCodePlayer, data);
  };

  const handleOpponentDataSuccess = data => {
    setOpponentDataStatus(DATA_FETCH_STATUS_SUCCESS);
    setOpponentHasFinishedLoadingData(true);
    setOpponentIsLoadingData(false);

    storeDataState(props.allyCodeOpponent, data, true);
  };

  const storeDataState = (allyCode, data, isOpponent) => {
    const allyCodeKey = isOpponent ? ALLY_CODE_OPPONENT : ALLY_CODE_PLAYER;
    const apiDataKey = isOpponent ? API_OPPONENT_DATA : API_PLAYER_DATA;
    const apiDataLastFetchTSKey = isOpponent
      ? API_OPPONENT_DATA_LAST_FETCH_TS
      : API_PLAYER_DATA_LAST_FETCH_TS;

    LocalStorageHelper.set(allyCodeKey, allyCode);
    if (Array.isArray(data) && data.length >= 1) {
      LocalStorageHelper.set(apiDataKey, JSON.stringify(data[0], null, 0));
      LocalStorageHelper.set(apiDataLastFetchTSKey, moment().format());
    }
  };

  const handlePlayerDataError = e => {
    setPlayerDataStatus(DATA_FETCH_STATUS_ERROR);
    setPlayerHasFinishedLoadingData(true);
    setPlayerIsLoadingData(false);
    setPlayerDataErrorMessage(e.description);
  };

  const handleOpponentDataError = e => {
    setOpponentDataStatus(DATA_FETCH_STATUS_ERROR);
    setOpponentHasFinishedLoadingData(true);
    setOpponentIsLoadingData(false);
    setOpponentDataErrorMessage(e.description);
  };

  // Shows the success message when statuses are either success or alert
  const shouldShowSuccessAlert = () => {
    const shouldShow =
      playerHasFinishedLoadingData &&
      opponentHasFinishedLoadingData &&
      (playerDataStatus === DATA_FETCH_STATUS_SUCCESS ||
        playerDataStatus === DATA_FETCH_STATUS_IGNORED) &&
      (opponentDataStatus === DATA_FETCH_STATUS_SUCCESS ||
        opponentDataStatus === DATA_FETCH_STATUS_IGNORED);

    const hasIgnoreds =
      playerDataStatus === DATA_FETCH_STATUS_IGNORED ||
      opponentDataStatus === DATA_FETCH_STATUS_IGNORED;

    // If there's an warning, wait a bit longed before closing the modal
    if (shouldShow && selfCloseModalTimeout === null) {
      selfCloseModalTimeout = setTimeout(() => {
        props.onFinish();
      }, SELF_CLOSE_TIMEOUT_MS * (hasIgnoreds ? 3 : 1));
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

  const getDataLoadingIcon = (
    isLoadingData,
    hasFinishedLoadingData,
    dataStatus
  ) => {
    if (isLoadingData) {
      return <CircularProgress size={14} />;
    } else if (hasFinishedLoadingData) {
      if (dataStatus === DATA_FETCH_STATUS_SUCCESS) {
        return <CheckCircleIcon color='secondary' fontSize='small' />;
      } else if (dataStatus === DATA_FETCH_STATUS_IGNORED) {
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

  const getPlayerDataLoadingIcon = () => {
    return getDataLoadingIcon(
      playerIsLoadingData,
      playerHasFinishedLoadingData,
      playerDataStatus
    );
  };

  const getOpponentDataLoadingIcon = () => {
    return getDataLoadingIcon(
      opponentIsLoadingData,
      opponentHasFinishedLoadingData,
      opponentDataStatus
    );
  };

  return (
    <div className='wrapper'>
      <Grid container spacing={2}>
        {shouldShowFailureAlert() && (
          <Grid item xs={12}>
            <Alert severity='error'>
              <AlertTitle>Error fetching player data.</AlertTitle>
              See errors below. Close this modal and try again later.
            </Alert>
          </Grid>
        )}
        {shouldShowSuccessAlert() && (
          <Grid item xs={12}>
            <Alert severity='success'>
              <AlertTitle>Player data fetched successfully!</AlertTitle>
              Redirecting to the dashboard...
            </Alert>
          </Grid>
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
                  Warning: {playerDataWarningMessage}
                </div>
              ) : null}
              {playerDataErrorMessage ? (
                <div className={classes.taskStatusErrorMessage}>
                  Error: {playerDataErrorMessage}
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
                  Warning: {opponentDataWarningMessage}
                </div>
              ) : null}
              {opponentDataErrorMessage ? (
                <div className={classes.taskStatusErrorMessage}>
                  Error: {opponentDataErrorMessage}
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
