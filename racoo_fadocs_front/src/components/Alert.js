import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { useSelector, useDispatch } from 'react-redux';
import { hideAction } from '../redux/Alert/alert.actions'

export default function SimpleAlert() {
    const alert = useSelector(state => state.alert)
    const dispatch = useDispatch()

    const handleClose = () => {
        dispatch(hideAction())
    }

    return (
        <Snackbar
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
            }}
            open={alert.show}
            autoHideDuration={6000}
            onClose={handleClose}
            message={alert.message}
            action={
                <React.Fragment>
                    <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </React.Fragment>
            }
        />
    );
}