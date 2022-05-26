import React, { Component } from 'react';
import { FieldControl, FieldGroup, FormBuilder, Validators } from 'react-reactive-form';
import { Alert, Button, Form } from 'reactstrap';

import UsernameReactstrapInput from './Form/UsernameReactstrapInput';
import PasswordReacstrapInput from './Form/PasswordReacstrapInput';
import { authenticationService } from '../services/authentication.service';

/**
 * Componente para iniciar sesión
 */
class LoginForm extends Component {
  form = FormBuilder.group(
    {
      username: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    },
  );

  constructor(props) {
    super(props);

    this.state = {
      errorOnLogin: false,
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
      const auth = await authenticationService.login(
        this.form.get('username').value,
        this.form.get('password').value,
      );
      this.setState({ errorOnLogin: !auth.response, message: auth.message });

      if (auth.response) {
        this.props.history.push('/');
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
                meta={{ label: 'Usuario:' }}
                render={UsernameReactstrapInput}
              />

              <FieldControl
                name='password'
                meta={{ label: 'Contraseña:', placeholder: 'Tu contraseña' }}
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
                Iniciar sesión
              </Button>
            </Form>
          )}
        />
        {this.state.errorOnLogin
          ? <Alert className='alert alert-danger mt-3'>
            {this.state.message}
          </Alert>
          : null}
      </>
    );
  }
}

export default LoginForm;