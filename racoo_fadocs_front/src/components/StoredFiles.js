import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import DescriptionIcon from '@material-ui/icons/Description';
import Badge from '@material-ui/core/Badge';
import { useSelector} from 'react-redux';
import Row from 'reactstrap/lib/Row';

const useStyles = makeStyles({
    root: {
        height: 60,
        flexGrow: 1,
        maxWidth: 60,
    },
    button: {
        marginLeft: 16
    },
    iconsContainer: {
        alignItems: 'center'
    },
    numberOfFiles: {
        marginRight: 16
    }
});

export default function DocumentCart() {
    const classes = useStyles();
    const files = useSelector(state => state.files ? state.files.driveFiles : [])


    const numberOfFiles = files && files.length ? files.length : '0';

    return (
        <Row className={classes.iconsContainer}>
            <Badge className={classes.numberOfFiles} badgeContent={numberOfFiles} showZero color="primary">
                <DescriptionIcon />
            </Badge>
        </Row>
    );
}