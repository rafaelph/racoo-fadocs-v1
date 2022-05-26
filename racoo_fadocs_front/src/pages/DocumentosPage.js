import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from 'react-router';
import { Button, Card, Col, Form, FormGroup, Input, Label, Row, Spinner } from 'reactstrap';

import Page from '../components/Page';
import FileTree from '../components/FileTree';
import { removeDriveFile, storeDriveFile } from '../redux/Files/files.actions';
import { authenticationService } from '../services/authentication.service';
import { driveService } from '../services/drive.service';

/**
 * Ordena los archivos y directorios dados por nombre, primero las carpetas y
 * luegos los archivos
 *
 * @param unorderedFiles: Arreglo de carpetas y archivos
 */
export function orderFiles(unorderedFiles) {
  return unorderedFiles.sort((fileA, fileB) => {
    // Si ambos son del mismo tipo se compara el nombre
    if ((fileA.mimeType.includes('folder') && fileB.mimeType.includes('folder'))
      || (!fileA.mimeType.includes('folder') && !fileB.mimeType.includes('folder'))) {
      return fileA.name.toLowerCase() > fileB.name.toLowerCase() ? 1 : -1;
    }

    return fileA.mimeType.includes('folder') ? -1 : 1;
  });
}

/**
 * Componente para mostrar los documentos desde los diferentes drives
 * (Google drive y Racoo drive)
 *
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
const DocumentosPage = (props) => {

  const isFadocs = props.match.params.isFadocs === 'fadocs';
  const [files, setFiles] = useState(null);
  const [url, setUrl] = useState(null);
  const [code, setCode] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [activeFile] = useState(null);
  const [breadcrumbs, setBreadcrumbs] = useState([
    {
      name: 'Documentos',
      active: true,
      id: 'root',
    },
  ]);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [navigateToUpload] = useState(false);

  const dispatch = useDispatch();
  const userSelectedFiles = useSelector(state => state.files ? state.files.driveFiles : []);

  useEffect(() => {
    getUserFiles(true);
  }, []);

  useEffect(() => {
    const checkedFiles = markAsChecked(files || []);
    setFiles([...checkedFiles]);
  }, [userSelectedFiles]);

  const getUserFiles = () => {
    setLoadingFiles(true);
    const promise = isFadocs ? driveService.getFadocs() : driveService.getFiles();
    promise.then(filesResponse => {
      handleFiles(filesResponse);
    })
      .catch(error => {
        setLoadingFiles(false);
        console.error(error);
      });
  };

  const handleFiles = (filesResponse) => {
    setLoadingFiles(false);
    if (filesResponse.result === 'url') {
      setUrl(filesResponse.url);
    } else if (filesResponse.result === 'files') {
      setUrl(null);
      const filteredFiles = filesResponse.files.filter(file => {
        const isValidFileType = file.mimeType.includes('folder')
          || file.mimeType.includes('application/vnd.openxmlformats-officedocument.wordprocessingml.document');
        const isFadocs = file.name.toLowerCase().includes('fadocs') && file.mimeType.includes('folder');
        return isValidFileType && isFadocs;
      });
      const orderedFiles = orderFiles(filteredFiles);
      const checkedFiles = markAsChecked(orderedFiles);
      setFiles(checkedFiles);
    }
  };

  const markAsChecked = (files) => {
    console.log('userSelectedFiles', userSelectedFiles);
    for (let index = 0; index < files.length; index++) {
      const userFile = files[index];
      if (!userFile.mimeType.includes('folder')) {
        const fileSelectedIndex = userSelectedFiles.findIndex(userSelectedFile => userSelectedFile.id === userFile.id);
        files[index].checked = fileSelectedIndex >= 0;
      }
    }
    return files;
  };
  const onChangeCode = (evt) => {
    setCode(evt.target.value);
  };

  const handleEnviarCodigo = async () => {
    try {
      const response = await authenticationService.setDrive(code);
      if (response.status === 200) {
        getUserFiles(false);
      } else {
        console.error('Error al cargar los archivos del usuario', response);
      }
    } catch (error) {
      console.error('Error al cargar los archivos del usuario', error);
    }

  };

  const handleSelectFolder = async (id) => {
    setLoadingFiles(true);
    try {
      const orderedFiles = await getFilesFromFolder(id);
      const checkedFiles = markAsChecked(orderedFiles);
      setFiles(checkedFiles);
      setLoadingFiles(false);

      const newBreadcrumbs = breadcrumbs.map(breadcrumb => ({
        ...breadcrumb,
        active: false,
      }));
      const selectedFolderIndex = files.findIndex(file => file.id === id);

      newBreadcrumbs.push({
        name: files[selectedFolderIndex].name,
        active: true,
        id: files[selectedFolderIndex].id,
      });

      setBreadcrumbs(newBreadcrumbs);
    } catch (error) {
      console.error(error);
      setLoadingFiles(false);
    }
  };

  const getFilesFromFolder = async (folderId) => {
    const filesResponse = await driveService.getFiles(folderId);
    const filteredFiles = filesResponse.files.filter(file => {
      console.log('file mymetype', file);
      const isValidFileType = file.mimeType.includes('folder')
        || file.mimeType.includes('application/vnd.openxmlformats-officedocument.wordprocessingml.document');
      const isFadocs = file.name.toLowerCase().includes('fadocs');
      return isValidFileType && (folderId !== 'root' || isFadocs);
    });

    return orderFiles(filteredFiles);
  };

  const handleBreadcrumbSelection = (index) => {
    const fileId = breadcrumbs[index].id;
    breadcrumbs.splice(index + 1);
    setBreadcrumbs(breadcrumbs);
    handleSelectFolder(fileId)
      .catch(() => console.error('Error al seleccionar una carpeta'));
  };

  const handleSelectFile = async (id, selected) => {
    const file = files.find(f => f.id === id);
    if (!file.mimeType.includes('folder') && selected) {
      const index = files.findIndex(f => f.id === id);
      if (index >= 0) {
        files[index].checked = true;
        setFiles(files);
      }
      dispatch(storeDriveFile(file));
    } else if (!file.mimeType.includes('folder') && !selected) {
      const index = files.findIndex(f => f.id === id);
      if (index >= 0) {
        files[index].checked = false;
        setFiles(files);
      }
      dispatch(removeDriveFile(file));
    } else if (file.mimeType.includes('folder')) {
      const filesFromFolder = await getFilesFromFolder(id);
      filesFromFolder.forEach(file => {
        if (file.mimeType.includes('application/vnd.openxmlformats-officedocument.wordprocessingml.document')) {
          if (selected) {
            const index = files.findIndex(f => f.id === id);
            if (index >= 0) {
              files[index].checked = true;
              setFiles(files);
            }
            dispatch(storeDriveFile(file));
          } else {
            const index = files.findIndex(f => f.id === id);
            if (index >= 0) {
              files[index].checked = false;
              setFiles(files);
            }
            dispatch(removeDriveFile(file));
          }
        }
      });
    }
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleFileSelection = async () => {
    setAnchorEl(null);
    dispatch(storeDriveFile(activeFile));
  };

  const handleResetDrive = async () => {
    const response = await authenticationService.setDrive(null);
    if (response.status === 200) {
      getUserFiles(false);
    } else {
      console.error('Error al cargar los archivos del usuario', response);
    }
  };

  return (
    navigateToUpload ? <Redirect to='/upload' push={true} /> :
      <Page
        className='DocumentosPage'
        title='Documentos'
        step={false}
        breadcrumbs={breadcrumbs}
        handleBreadcrumbSelection={(breadcrumb) => handleBreadcrumbSelection(breadcrumb)}
      >
        {url &&
        <>
          <label className='text text-center'>
            Es necesario sincronizar nuestra app con Google Drive. Por favor seguir el siguiente
            <a href={url} target='_blank' rel='noopener noreferrer'> link</a>
          </label>
          <Row form>
            <Col sm={12}>
              <Card className='align-items-center p-2'>
                <Form>
                  <FormGroup row key='1'>
                    <Label for='code'>Inserte el código obtenido</Label>
                    <Input name='code' type='text' onChange={evt => onChangeCode(evt)} />
                  </FormGroup>
                  <Button onClick={handleEnviarCodigo}>Enviar</Button>
                </Form>
              </Card>
            </Col>
          </Row>
        </>
        }
        {files && !loadingFiles && !url &&
        <>
          {!isFadocs && <Row className='justify-content-start pl-4'>
            <Button
              size='small'
              variant='contained'
              color='primary'
              onClick={handleResetDrive}
            >
              Eliminar cuenta de google drive
            </Button>
          </Row>}
          <FileTree files={files} onSelectFolder={handleSelectFolder}
                    onFileSelected={(id, selected) => handleSelectFile(id, selected)} />
        </>
        }
        {loadingFiles &&
        <Spinner color='primary' />
        }
        <Menu
          id='simple-menu'
          anchorEl={anchorEl}
          keepMounted
          getContentAnchorEl={null}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          transformOrigin={{ vertical: 'top', horizontal: 'center' }}
          open={Boolean(anchorEl)}
          onClose={handleCloseMenu}
        >
          <MenuItem onClick={handleFileSelection}>Enviar a fadocs</MenuItem>
        </Menu>
      </Page>
  );
};

export default DocumentosPage;
