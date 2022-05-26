import React, { useEffect, useState } from 'react';
import upload from '../assets/img/fadocs/upload.png';
import doc from '../assets/img/fadocs/doc.png';
import {
  CardHeader,
  Col,
  FormGroup,
  Row,
  Card,
  CardBody,
  Input,
  Alert,
  Label,
  Badge,
} from 'reactstrap';
import axios from 'axios';
import Spinner from 'reactstrap/lib/Spinner';
import FormText from 'reactstrap/lib/FormText';
import Form from 'reactstrap/lib/Form';
import { MdDeleteForever } from 'react-icons/md';
import { useSelector, useDispatch } from 'react-redux'
import { loadEtiquetasAction } from '../redux/Etiquetas/etiquetas.actions'
import { moveForwardAction, moveBackwardAction } from '../redux/Step/step.actions'
import {loadFilesAction, loadImageAction} from '../redux/Files/files.actions'
import HorizontalLinearStepper from '../components/Stepper'
import Page from "../components/Page";

const apiUrl = process.env.REACT_APP_API_URL;

const wordsStyles={
  padding: 12, fontSize: 15, margin: 10
};

const CardPage = () => {
  const [fields, setFields] = useState([]);
  const [schemaFields, setSchemaFields] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingWords, setLoadingWords] = useState(false);
  const [links, setLinks] = useState([]);
  const [words, setWords] = useState([]);
  const [error, setError] = useState({
    status: false,
    message: ''
  });

  const dispatch = useDispatch()
  const etiquetas = useSelector(state => state.etiquetas ? state.etiquetas.etiquetas : [])
  const stepNumber = useSelector(state => state.step ? state.step.step : 0)
  const files = useSelector(state => state.files ? state.files.files : [])
  const images = useSelector(state => state.files.images ? state.files.images: [])

  const inputUpload = (evt) => {
    const files = evt.target.files;
    handleFiles(files);
  };

  const inputUploadImages = (evt) => {
    const files = evt.target.files;
    handleImages(files);
  };

  const preventDefaults = (e) => {
    e.preventDefault();
    e.stopPropagation();
  }

  const highlight = () => {
    const ele = document.querySelector('.upload-label');
    if (ele) {
      ele.style.backgroundColor = '#e9e9e9';
      ele.style.border = '2px dotted #999';
    }
  }

  const unHightLight = () => {
    const ele = document.querySelector('.upload-label');
    if (ele) {
      ele.style.backgroundColor = '#ffff';
      ele.style.border = 'dashed #71c108';
    }
  }

  const defaultHightLight = () => {
    const ele = document.querySelector('.upload-label');
    if (ele) {
      ele.style.border = '2px dashed #434343';
    }
  }

  const fileExtInvalid = () => {
    dispatch(loadFilesAction([]))
    setError({
      status: true,
      message: 'La extension del archivo no es permitida. extensiones validas (*.doc | *.docx)'
    });
    const ele = document.querySelector('.upload-label');
    if (ele) {
      ele.style.border = 'dashed #ff0000';
    }
  };

  const handleDrop = async (e) => {
    const dt = e.dataTransfer;
    const { files } = dt;
    await handleFiles(files);
  }

  const handleDropImages = async (e) => {
    const dt = e.dataTransfer;
    const { files } = dt;
    await handleImages(files);
  }

  const handleImages = (receivedFiles) => {
    const mappedFiles = [];
    for (let index = 0; index < receivedFiles.length; index++) {
      const document = receivedFiles[index];
      if (document) {
        const extension = document.name.split('.').pop();
        if (extension === 'jpg' || extension === 'png') {
          setError({
            status: false,
            message: ''
          });
          const fileInfo = {
            index,
            file: document,
            fileName: document.name
          }
          mappedFiles.push(fileInfo);
        } else {
          fileExtInvalid();
        }
      }
    }
    dispatch(loadImageAction(mappedFiles))
  }

  const handleFiles = (receivedFiles) => {
    const mappedFiles = [];
    for (let index = 0; index < receivedFiles.length; index++) {
      const document = receivedFiles[index];
      if (document) {
        const extension = document.name.split('.').pop();
        if (extension === 'doc' || extension === 'docx') {
          setError({
            status: false,
            message: ''
          });
          const fileInfo = {
            index,
            file: document,
            fileName: document.name
          }
          mappedFiles.push(fileInfo);
          unHightLight();
        } else {
          fileExtInvalid();
        }
      }
    }
    dispatch(loadFilesAction(mappedFiles))
  }

  const uploadFiles = async () => {
    setLoading(true);
    try {
      const etiquetas = [];
      for (const file of files) {
        const formData = new FormData();
        formData.append('file', file.file);
        const result = await axios.post(`${apiUrl}/docx/read`, formData);
        const resultFields = result.data.data;
        resultFields.forEach(result => {
          const found = etiquetas.some(etiqueta => etiqueta.tag === result.tag);
          if (!found) {
            etiquetas.push(result);
          }
        })
      }
      dispatch(loadEtiquetasAction(etiquetas))
      dispatch(moveForwardAction(stepNumber + 1));
      setLoading(false);
    } catch (error) {
      setLoading(false)
      setError({
        status: true,
        message: 'Conexión fallida, por favor revise su conexión a internet y vuelva a intentarlo'
      });
      console.log(error);
    }
  }

  const uploadImg = () => {
    document.getElementById("selectImage").click()
  };

  const uploadImgWords = () => {
    document.getElementById("selectImageWords").click()
  };

  useEffect(() => {
    const dropArea = document.getElementById('drop-area');
    const dropImage = document.getElementById('drop-image');
    if (dropArea) {
      ['dragenter', 'dragover', 'dragleave', 'drop'].forEach((eventName) => {
        dropArea.addEventListener(eventName, preventDefaults, false);
      });

      ['dragenter', 'dragover'].forEach((eventName) => {
        dropArea.addEventListener(eventName, highlight, false);
      });

      ['dragleave', 'drop'].forEach((eventName) => {
        dropArea.addEventListener(eventName, unHightLight, false);
      });

      dropArea.addEventListener('drop', handleDrop, false);
    };
    if (dropImage) {
        dropImage.addEventListener('drop', handleDropImages, false);
    }
  }, [files, images]);

  useEffect(() => {
    const newSchema = {};
    etiquetas && etiquetas.forEach(element => {
      newSchema[element.tag] = '';
    });
    setSchemaFields(newSchema);
    setFields(etiquetas);
  }, [etiquetas]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError({
      error: false,
      message: ''
    });
    try {
      const newLinks = [];
      for (const file of files) {
        const formData = new FormData();
        formData.append('file', file.file);
        for (var key of Object.keys(schemaFields)) {
          const nameField = key;
          const valueField = schemaFields[key];
          formData.append(nameField.replace('*', ''), valueField);
        }
        const result = await axios.post(`${apiUrl}/docx/combine`, formData);
        if (result.data.data && result.data.data.link) {
          const link = result.data.data.link;
          const data = {
            fileName: file.fileName,
            url: link
          }
          newLinks.push(data)
        } else {
          console.log('Error al combinar el archivo', result)
          setError({
            status: true,
            message: 'Error, por favor revise sus datos y vuelva a intentarlo'
          });
        }
      }
      setLinks(newLinks);
      dispatch(moveForwardAction(stepNumber + 1));
      setLoading(false);
    } catch (error) {
      console.log('Error al combinar el archivo', error)
      setLoading(false);
      setError({
        status: true,
        message: 'Error, por favor revise sus datos y vuelva a intentarlo'
      });
    }
  };

  const onChangeFieldsValue = (field, evt) => {
    schemaFields[field] = evt.target.value;
  }

  const goBack = () => {
    dispatch(moveBackwardAction(stepNumber - 1));
    setError({
      status: false,
      message: ''
    });
  }

  /**
   * Elimina un documento del listado de archivos subidos
   *
   * @param file
   */
  const removeDoc = (file) => {
    const updatedFiles = [...files];
    updatedFiles.splice(file.index, 1);

    dispatch(loadFilesAction(updatedFiles));
    defaultHightLight();
  }

  const removeImage = (file) => {
    const updatedFiles = [...files];
    updatedFiles.splice(file.index, 1);
    dispatch(loadImageAction(updatedFiles));

  }

  const handleDropOverWord = (event) => {
    event.preventDefault();
  }

  const handleDropWord = (event) => {
    const data= event.dataTransfer.getData('text/plain');
    const tagName= event.target.name;
    const newSchema={...schemaFields};
    newSchema[tagName]+=` ${data}`;
    setSchemaFields(newSchema);
    event.preventDefault();
  }

  const handleDragStartWord = (event) => {
    event.dataTransfer.setData('text/plain', event.target.innerText);
  }

    const getWords = async () => {
        setLoadingWords(true);
        const vision_url= process.env.REACT_APP_VISION_URL;
        const formData = new FormData();
        formData.append('image', images[0].file);
        const result = await axios.post(`${vision_url}/image`, formData).catch((err)=>setLoadingWords(false));
        const resultFields = result.data.data;
        setLoadingWords(false);
        resultFields.shift()
        setWords(resultFields);
    }

  return (
    <Page>
      <Row>
        <HorizontalLinearStepper />
      </Row>
      <Row>
        <Col lg={12} md={12} sm={12} xs={12}>
          {loading ?
            <Card className="align-items-center" style={{ backgroundColor: 'transparent', border: '0' }}>
              <Spinner color="primary" />
            </Card> :
            <>
            {stepNumber === 0 ?
              <Card className="p-1">
                {files && !error.status ?
                  files.map((file) => (
                    <CardHeader key={file.fileName}>
                      <img src={doc} style={{ width: '50px', height: '40px', paddingRight: '10px' }} alt="doc" /> {file.fileName}
                      <MdDeleteForever className="can-click float-right" color="#434343" style={{ width: '35px', height: '35px' }} onClick={() => removeDoc(file)} />
                    </CardHeader>
                  ))
                  : null}
                {error.status ? <CardHeader className='text-align-start'>
                  <Alert className="alert alert-danger mt-3">{error.message}</Alert>
                </CardHeader> : null}
                {files && files.length === 0 ?
                  <Card
                  id='drop-area' className="align-items-center p-3 upload-label"
                  style={{ border: '2px solid #434343', borderStyle: 'dashed' }}>
                    <img src={upload} alt="updload" />
                    <label>Arrasta archivo aquí</label>
                    <label>o</label>
                    <input id='selectImage' type='file' hidden multiple onChange={inputUpload} accept='.doc,.docx' />
                    <button onClick={uploadImg} className="btn btn-primary">Seleccionar el archivo docx</button>
                  </Card>
                  : null}
                <Card className="align-items-center border-0">
                  <button disabled={files && files.length === 0} onClick={uploadFiles} className="btn btn-success mt-2 col-md-3">Subir</button>
                </Card>
              </Card> : null}

            {stepNumber === 1 ?
                <Row>
                  <Col>
                    <Card className="align-items-center p-1">
                      {error.status ? <CardHeader className='text-align-start'>
                        <Alert className="alert alert-danger mt-3">{error.message}</Alert>
                      </CardHeader> : null}
                      <CardHeader>Etiquetas</CardHeader>
                      <CardBody className="col-md-4">
                        <Form onSubmit={onSubmit}>
                          {fields.map((f, index) =>
                              <FormGroup key={index}>
                                <Label for="exampleEmail">{f.tag}</Label>
                                <Input name={f.tag} type="text"
                                       defaultValue={schemaFields[f.tag]}
                                       onChange={evt => onChangeFieldsValue(f.tag, evt)}
                                       onDragOver={handleDropOverWord}
                                       onDrop={handleDropWord}
                                />
                                <FormText>{f.funciones}</FormText>
                              </FormGroup>
                          )}

                          <button
                              type="button"
                              onClick={goBack}
                              className="btn btn-success mr-3 col-md-6">anterior
                          </button>
                          <button
                              className="btn btn-success col-md-4"
                              type="submit">llenar
                          </button>
                        </Form>
                      </CardBody>
                    </Card>
                  </Col>
                  <Col>
                    {images?
                        images.map((img) => (
                            <Card key={img.fileName} style={{ display:'flex', flexDirection:'row', justifyContent:'space-between' ,width: '100%', marginBottom: 5, padding: 10}}>
                              <div>
                                <img src={doc} style={{ width: '50px', height: '40px',  paddingRight: '10px' }} alt="doc" /> {img.fileName}
                              </div>
                              <MdDeleteForever className="can-click float-right" color="#434343" style={{ width: '35px', height: '35px' }} onClick={() => removeImage(images)} />
                            </Card>
                        ))
                        : null}
                    <Card className="align-items-center p-1">
                      {error.status ? <CardHeader className='text-align-start'>
                        <Alert className="alert alert-danger mt-3">{error.message}</Alert>
                      </CardHeader> : null}
                      <CardHeader>Palabras Obtenidas</CardHeader>
                      <CardBody className="col-md-12">
                        {loadingWords ?
                            <div style={{display: 'flex', justifyContent: 'center'}}>
                              <Spinner color="primary"/>
                            </div>
                            :
                            words && words.map((res, key) => (
                                <Badge key={key} draggable={true} onDragStart={handleDragStartWord} color="info" pill
                                       style={wordsStyles}>{res.description}</Badge>
                            ))
                        }
                      </CardBody>

                      <div id='drop-image' className="flex-row justify-content-center">
                        <input id='selectImageWords' type='file' hidden onChange={inputUploadImages} accept='.jpg,.png' />
                        <button onClick={uploadImgWords} className="btn btn-primary m-1">Seleccionar Imagen</button>
                        <button disabled={(images && images.length === 0) || loadingWords}  className="btn btn-success m-1" onClick={getWords}>Obtener Palabras</button>
                      </div>
                    </Card>
                  </Col>
                </Row>: null}

            {stepNumber === 2 ?
              links.map(link =>
              <Card className="align-items-center p-3">
                <span>{link.fileName}</span>
                <img src={doc} style={{ width: '100px', height: '100px' }} alt="doc" />
                <a className="btn btn-success mt-4 col-md-3" href={link.url}>Descargar</a>
              </Card>
              )
              : null}
            </>
          }
        </Col>
      </Row>
    </Page>
  );
};

export default CardPage;
