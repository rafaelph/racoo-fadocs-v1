import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import DescriptionIcon from '@material-ui/icons/Description';
import Badge from '@material-ui/core/Badge';
import { useSelector, useDispatch } from 'react-redux';
import { driveService } from '../services/drive.service';
import { loadFilesAction, clearDriveFiles } from '../redux/Files/files.actions';
import { loadEtiquetasAction } from '../redux/Etiquetas/etiquetas.actions'
import { Redirect } from 'react-router'
import Row from 'reactstrap/lib/Row';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import SendIcon from '@material-ui/icons/Send';
import CircularProgress from '@material-ui/core/CircularProgress';

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
    const dispatch = useDispatch()
    const files = useSelector(state => state.files ? state.files.driveFiles : [])

    const [navigateToUpload, setNavigateToUpload] = useState(false);
    const [loading, setLoading] = useState(false);

    const numberOfFiles = files && files.length ? files.length : '0';

    const getEtiquetasFromFiles = async () => {
        setLoading(true)
        const response = await driveService.getLabelsFromFiles(files);
        const fileInfoArray = [];
        const etiquetasTodas = []
        for (let index = 0; index < response.length; index++) {
            const fileResponse = response[index];
            const file = await driveService.downloadLocalFile(fileResponse.filePath, fileResponse.name)
            const fileInfo = {
                index: 0,
                file,
                fileName: fileResponse.name,
                filePath: fileResponse.filePath,
                id: fileResponse.id,
                parentId: fileResponse.parentId
            }
            fileInfoArray.push(fileInfo);
            const payload = JSON.parse(fileResponse.responseFadocs)
            if (payload.statusCode === 200) {
                const etiquetas = payload.data;
                etiquetas.forEach(etiqueta => {
                    const yaExiste = etiquetasTodas.some(etiquetaGuardada => etiquetaGuardada === etiqueta);
                    if (!yaExiste) {
                        etiquetasTodas.push(etiqueta);
                    }
                });
            } else {
                console.warn(`Error al consultar las etiquetas del archivo ${payload.ErroMsg}`);
            }
        }
        setLoading(false)
        dispatch(loadFilesAction(fileInfoArray))
        dispatch(loadEtiquetasAction(etiquetasTodas))
        setNavigateToUpload(true);
    }

    const handleClearFiles = () => {
        dispatch(clearDriveFiles())
    }

    return (
        navigateToUpload ? <Redirect to="/upload" push={true} /> :
            <Row className={classes.iconsContainer}>
                {loading ? 
                <CircularProgress />
                :
                <>
                    <Badge className={classes.numberOfFiles} badgeContent={numberOfFiles} showZero color="primary">
                        <DescriptionIcon />
                    </Badge>
                    <IconButton onClick={getEtiquetasFromFiles} color="primary" aria-label="Enviar a fadocs" component="span">
                        <SendIcon />
                    </IconButton>
                    <IconButton onClick={handleClearFiles} color="primary" aria-label="Limpiar seleccionados" component="span">
                        <DeleteIcon />
                    </IconButton>
                </>
                }
            </Row>
    );
}