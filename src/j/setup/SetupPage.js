import React from 'react';
import { Redirect } from 'react-router-dom';

import {
  Card,
  CardContent,
  FormControl,
  FormLabel,
  TextField,
  Typography,
  Button
} from '@material-ui/core';
import ClearIcon from '@material-ui/icons/Clear';
import { makeStyles } from '@material-ui/core/styles';

import LocalStorageHelper from '../utils/LocalStorageHelper';
import {
  ALLY_CODE_PLAYER,
  ALLY_CODE_OPPONENT
} from '../utils/LocalStorageKeys';

import SetupProgressModal from './SetupProgressModal';

const useStyles = makeStyles(theme => ({
  wrapper: {
    alignSelf: 'center',
    maxWidth: 500
  },
  cardContent: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column'
  },
  title: {
    marginBottom: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      marginBottom: theme.spacing(3)
    }
  },
  formLabel: {
    marginBottom: theme.spacing(3),
    textAlign: 'center'
  },
  idsWarpper: {
    width: 'fit-content',
    alignSelf: 'center',
    [theme.breakpoints.up('sm')]: {
      flexDirection: 'row'
    }
  },
  versusIcon: {
    alignSelf: 'center',
    margin: `${theme.spacing(1)}px 0`,
    [theme.breakpoints.up('sm')]: {
      margin: `0 ${theme.spacing(2)}px`
    }
  },
  submitButton: {
    alignSelf: 'center',
    marginTop: theme.spacing(2),
    width: 'fit-content'
  }
}));

function SetupPage() {
  const classes = useStyles();

  const storedPlayerID = cleanupUserID(
    LocalStorageHelper.get(ALLY_CODE_PLAYER)
  );
  const storedOpponentID = cleanupUserID(
    LocalStorageHelper.get(ALLY_CODE_OPPONENT)
  );

  const [playerID, setPlayerID] = React.useState(storedPlayerID);
  const [opponentID, setOpponentID] = React.useState(storedOpponentID);
  const [progressModalOpen, setProgressModalOpen] = React.useState(false);
  const [gacDataFetched, setGacDataFetched] = React.useState(false);
  const [hadDataFetchErrors, setHadDataFetchErrors] = React.useState(false);

  const canSubmit =
    playerID.length === 9 && opponentID.length === 9 && playerID !== opponentID;

  function handleOnChange(event, stateChanger) {
    const ID = cleanupUserID(event.target.value);
    stateChanger(ID);
  }

  function cleanupUserID(id) {
    const _cleanId = (id || '')
      .replace(/\D/g, '')
      .trim()
      .slice(0, 9);
    return _cleanId;
  }

  function handleSubmitClick() {
    setProgressModalOpen(true);
  }

  function handleProgressModalClose(error) {
    setProgressModalOpen(false);
    setGacDataFetched(true);
    if (error) {
      setHadDataFetchErrors(true);
    }
  }

  // Redirects to the Dashboard when data fetched successfully
  if (gacDataFetched && !hadDataFetchErrors) {
    return (
      <Redirect
        to={{
          pathname: '/'
        }}
      />
    );
  }

  return (
    <React.Fragment>
      <Card className={classes.wrapper}>
        <CardContent className={classes.cardContent}>
          <Typography
            align='center'
            className={classes.title}
            component='h2'
            gutterBottom
            variant='h5'
          >
            Setup your GAC match!
          </Typography>
          <FormLabel className={classes.formLabel}>
            Enter the ally codes
          </FormLabel>
          <FormControl className={classes.idsWarpper}>
            <TextField
              id='player-id-input'
              label='Mine'
              onChange={e => handleOnChange(e, setPlayerID)}
              placeholder='123456789'
              value={playerID}
              variant='outlined'
            />
            <ClearIcon className={classes.versusIcon} />
            <TextField
              id='opponent-id-input'
              label="Opponent's"
              onChange={e => handleOnChange(e, setOpponentID)}
              placeholder='123456789'
              value={opponentID}
              variant='outlined'
            />
          </FormControl>
          <Button
            className={classes.submitButton}
            color='secondary'
            disabled={!canSubmit}
            onClick={handleSubmitClick}
            size='large'
            type='submit'
            variant='contained'
          >
            Fetch data
          </Button>
        </CardContent>
      </Card>

      <SetupProgressModal
        allyCodePlayer={playerID}
        allyCodeOpponent={opponentID}
        onClose={handleProgressModalClose}
        open={progressModalOpen}
      />
    </React.Fragment>
  );
}

export default SetupPage;
