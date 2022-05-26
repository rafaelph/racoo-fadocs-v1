import React, { Component } from 'react';
import { Alert, Button, Form } from 'reactstrap';
import { FieldControl, FieldGroup, FormBuilder, Validators } from 'react-reactive-form';

import { authenticationService } from '../services/authentication.service';
import { checkPasswords } from '../services/validations.service';

import UsernameReactstrapInput from './Form/UsernameReactstrapInput';
import PasswordReacstrapInput from './Form/PasswordReacstrapInput';

/**
 * Componente Formulario para el registro de usuarios
 */
class RegisterForm extends Component {
  form = FormBuilder.group(
    {
      username: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
    },
    { validators: checkPasswords('password', 'confirmPassword') },
  );

  constructor(props) {
    super(props);

    this.state = {
      errorOnRegister: undefined,
      message: '',
    };
  }

  componentWillUnmount() {
    this.form.reset();
  }

  handleSubmit = async (event) => {
    event.preventDefault();

    // Solo hace submit si el formulario es válido
    if (!this.form.invalid) {
      const username = this.form.get('username').value;

      const auth = await authenticationService.register(
        username,
        this.form.get('password').value,
      );

      if (auth.response) {
        this.setState({ errorOnRegister: false, message: `Enviamos un correo de verificación a ${username}` });
      } else {
        this.setState({ errorOnRegister: true, message: auth.message });
      }
    }
  };

  render() {
    return (
      <>
        <FieldGroup
          control={this.form}
          render={({ pristine, invalid }) => (
            <Form onSubmit={this.handleSubmit}>

              <FieldControl
                name='username'
                meta={{ label: 'Usuario' }}
                render={UsernameReactstrapInput}
              />

              <FieldControl
                name='password'
                meta={{ label: 'Contraseña', placeholder: 'Su contraseña' }}
                render={PasswordReacstrapInput}
              />

              <FieldControl
                name='confirmPassword'
                meta={{ label: 'Confirmar contraseña', placeholder: 'Confirme su contraseña' }}
                options={{ validators: Validators.required }}
                render={PasswordReacstrapInput}
              />

              <Button
                block
                className='border-0'
                color='success'
                disabled={pristine || invalid}
                size='lg'
                type='submit'
              >
                Regístrarte
              </Button>
            </Form>
          )}
        />

        {this.state.errorOnRegister === undefined
          ? null
          : <Alert
            className={`alert ${this.state.errorOnRegister ? 'alert-danger' : ''} mt-3`}
          >
            {this.state.message}
          </Alert>}

      </>
    );
  }
}

export default RegisterForm;
