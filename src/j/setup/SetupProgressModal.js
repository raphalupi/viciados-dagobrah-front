import React from 'react';
import PropTypes from 'prop-types';

import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography
} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import CloseIcon from '@material-ui/icons/Close';
import { makeStyles } from '@material-ui/core/styles';

import SWGOHAPIHelp from '../dataFetcher/SWGOHAPIHelp';

const useStyles = makeStyles(theme => ({
  modalTitleWrapper: {
    margin: 0,
    padding: theme.spacing(2)
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500]
  }
}));

function SetupProgressModal(props) {
  const { allyCodePlayer, allyCodeOpponent, open } = props;
  const classes = useStyles();

  const handleModalClose = () => {
    const { onClose } = props;
    onClose();
  };

  if (open) {
    SWGOHAPIHelp.test();
  }

  return (
    <Dialog
      disableBackdropClick
      disableEscapeKeyDown
      fullWidth
      maxWidth="sm"
      open={open}
    >
      <DialogTitle disableTypography className={classes.modalTitleWrapper}>
        <Typography variant="h6">Fetching data from players</Typography>
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={handleModalClose}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Alert severity="info">
          Please wait a bit. Fetching data for ally codes{' '}
          <strong>{allyCodePlayer}</strong> and{' '}
          <strong>{allyCodeOpponent}</strong>...
        </Alert>
      </DialogContent>
    </Dialog>
  );
}

SetupProgressModal.propTypes = {
  allyCodePlayer: PropTypes.string.isRequired,
  allyCodeOpponent: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired
};

export default SetupProgressModal;
