import EditIcon from '@material-ui/icons/Edit';
import Button from '@material-ui/core/Button';
import ClearIcon from '@material-ui/icons/Clear';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';

import React from 'react';
import { useDispatch } from 'react-redux';

import emptyImg from '../assets/img/users/user.png';

import { authenticationService } from '../services/authentication.service';
import { updateProfileImage } from '../redux/User/user.actions';

const useStyles = makeStyles((theme) => ({
  btn: {
    margin: theme.spacing(1),
  },
}));

export default function CustomerImage({ image, imageChanged, disabled, mode }) {
  const dispatch = useDispatch();

  const classes = useStyles();
  let imageDefault = false;

  if (!image) {
    image = emptyImg;
    imageDefault = true;
  }

  const inputFile = React.createRef();
  const errorImg = React.createRef();

  const changePhoto = (e) => {
    e.preventDefault();

    let reader = new FileReader();
    let file = e.target.files[0];
    reader.readAsDataURL(file);

    if (file.size < 1000000) {
      reader.onloadend = () => {
        imageChanged(reader.result);
        salvarFoto(reader.result);
      };

      errorImg.current.style = 'display: none;';
    } else {
      imageChanged(null);
      errorImg.current.style = null;
      salvarFoto('');
    }
  };

  /**
   * Intenta guardar la foto que viene por parámetro
   *
   * @param image
   */
  const salvarFoto = (image) => {
    authenticationService.savePhoto(image)
      .then(() => dispatch(updateProfileImage(image)));
  };

  const handleImageClick = (e) => {
    e.preventDefault();
    inputFile.current.click();
  };

  const handleImageDefaultClick = (e) => {
    e.preventDefault();
    imageChanged(null);
    salvarFoto('');
  };

  const saveButton = (
    <Button className={classes.btn}
            variant='contained'
            color='primary'
            size='small'
            disabled={disabled}
            onClick={(e) => handleImageClick(e)}
            startIcon={<EditIcon />}
    >
      Cambiar Foto
    </Button>
  );

  const resetButton = (!imageDefault && !disabled) ? (
    <Button className={classes.btn}
            variant='contained'
            color='primary'
            size='small'
            title='Reset to default'
            onClick={(e) => handleImageDefaultClick(e)}
            startIcon={<ClearIcon />}
    >
      Reiniciar
    </Button>
  ) : <div/>;

  return (
    <div>
      <input type='file' ref={inputFile} accept='image/*' onChange={(e) => changePhoto(e)}
             style={{ display: 'none' }} />
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <img src={image} alt='' width='100%' height='auto' />
        </Grid>
        <Grid item xs={12}>
          {mode !== 'view' && saveButton}
          {mode !== 'view' && resetButton}
        </Grid>
      </Grid>
      <span ref={errorImg} className='error' style={{ display: 'none' }}>Tamaño máximo 1 MB</span>
    </div>
  );
}

