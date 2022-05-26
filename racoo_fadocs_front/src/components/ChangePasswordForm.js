import React, { Component } from 'react';
import { Alert, Button, Form } from 'reactstrap';
import { FieldControl, FieldGroup, FormBuilder, Validators } from 'react-reactive-form';
import { connect } from 'react-redux';

import { showForm } from '../redux/Auth/auth.actions';
import { authenticationService } from '../services/authentication.service';
import { checkPasswords } from '../services/validations.service';

import PasswordReacstrapInput from './Form/PasswordReacstrapInput';
import { STATE_LOGIN } from './AuthForm';

/**
 * Componente Formulario para el cambiar la contraseña
 */
class ChangePasswordForm extends Component {
  form = FormBuilder.group(
    {
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
    },
    { validators: checkPasswords('password', 'confirmPassword') },
  );

  constructor(props) {
    super(props);

    this.state = {
      errorOnChange: false,
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
      const searchParams = new URLSearchParams(this.props.location.search);

      const auth = await authenticationService.recreatePassword(
        this.form.get('password').value,
        searchParams.get('token'),
      );

      if (auth.response) {
        this.props.showForm(STATE_LOGIN);
      } else {
        this.setState({ errorOnChange: true, message: auth.message });
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
                Cambiar contraseña
              </Button>
            </Form>
          )}
        />

        {this.state.errorOnChange
          ? <Alert className='alert alert-danger mt-3'>{this.state.message}</Alert>
          : null}
      </>
    );
  }
}

export default connect(null, { showForm })(ChangePasswordForm);