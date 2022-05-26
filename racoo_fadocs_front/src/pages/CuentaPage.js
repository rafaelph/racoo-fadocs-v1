import Page from '../components/Page';
import React from 'react';
import { connect } from 'react-redux'

import Paper from "@material-ui/core/Paper";
import Grid from '@material-ui/core/Grid';
import { FieldControl, FieldGroup, FormBuilder, Validators } from "react-reactive-form"
import PasswordInput from '../components/Form/PasswordInput'
import ConfirmPassword from '../components/Form/ConfirmPassword'
import UserImage from '../components/UserImage';
import Button from "@material-ui/core/Button";
import SaveIcon from '@material-ui/icons/Save';
import { authenticationService } from '../services/authentication.service';
import { Component } from 'react';
import { withStyles } from "@material-ui/styles";

const useStyles = () => ({
  root: {
      padding: '16px'
  },
  form: {
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      '& .MuiTextField-root': {
          margin: '16px',
          width: '100%'
      },
      '& .MuiFormControl-root': {
          margin: '16px',
          width: '100%'
      },
  },
  paper: {
      marginTop: '16px',
      padding: '16px',
      '& .MuiTextField-root': {
          width: '100%'
      },
      '& .MuiFormControl-root': {
          width: '100%'
      },
      '& .MuiToolbar-root.MuiToolbar-regular.MTableToolbar-root-318.MuiToolbar-gutters': {
          minHeight: '0 !important'
      },
  },
  saveBtn: {
      marginTop: '8px'
  }
});

class CuentaPage extends Component {
  state = {
    userImage: null
  }

  componentDidMount() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.setState({
      userImage: currentUser.img
    })
  }

  pwdForm = FormBuilder.group({
    password: ["", Validators.compose([
      Validators.required,
      Validators.minLength(7)
    ])],
    passwordConfirm: ['']
  }, {
    validators: (group) => {
      let passwordInput = group.controls['password'],
        passwordConfirmationInput = group.controls['passwordConfirm'];
      if (passwordInput.value !== passwordConfirmationInput.value) {
        passwordConfirmationInput.setErrors({ mismatch: true });
      } else {
        passwordConfirmationInput.setErrors(null);
      }
      return null;
    }
  });

  submit = () => {
    const {
      password
    } = this.pwdForm.value
    authenticationService.changePassword(password)
  }

  handleChangeImage(image) {
    this.setState({
      userImage: image
    })
  }

  render() {
    const {
        classes
    } = this.props;
    return (
      <Page className={classes.root}>
        <Grid container spacing={3}>
          <Grid item xs={8}>
            <Paper className={classes.paper}>
              <FieldGroup control={this.pwdForm} render={({ invalid }) => (
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <FieldControl
                      name="password"
                      render={PasswordInput}
                      meta={
                        {
                          label: "Contraseña",
                          hint: '',
                          required: true,
                          placeholder: 'Entre la Contraseña'
                        }
                      }
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FieldControl
                      name="passwordConfirm"
                      render={ConfirmPassword}
                      meta={
                        {
                          label: "Confirme Contraseña",
                          required: true,
                          placeholder: 'Confirme su Contraseña'
                        }
                      }
                    />
                  </Grid>
                  <Button variant="contained" color="primary" size="large"
                    startIcon={<SaveIcon />} disabled={invalid}
                    onClick={() => this.submit()}>
                    &nbsp;Salvar
                </Button>
                </Grid>
              )} />
            </Paper>
          </Grid>

          <Grid item xs={4}>
            <UserImage image={this.state.userImage} imageChanged={(image) => this.handleChangeImage(image)} />
          </Grid>
        </Grid>
      </Page>
    );
  }
}

const mapStateToProps = () => {
  return {}
}

const mapDispatchToProps = () => {
  return {}
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(useStyles)(CuentaPage));
