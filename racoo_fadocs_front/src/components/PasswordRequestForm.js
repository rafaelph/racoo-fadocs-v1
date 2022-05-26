import React, { Component } from 'react';
import { FieldControl, FieldGroup, FormBuilder, Validators } from 'react-reactive-form';
import { Alert, Button, Form } from 'reactstrap';

import UsernameReactstrapInput from './Form/UsernameReactstrapInput';
import { authenticationService } from '../services/authentication.service';

/**
 * Componente para solicitar el cambio de contraseña
 */
class PasswordRequestForm extends Component {
  form = FormBuilder.group(
    {
      email: ['', [Validators.required, Validators.email]],
    },
  );

  constructor(props) {
    super(props);

    this.state = {
      errorOnRequest: undefined,
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
      try {
        const auth = await authenticationService.requestChangePassword(
          this.form.get('email').value,
        );

        console.log(auth);

        this.setState({ errorOnRequest: !auth.response, message: auth.message });
      } catch (e) {
        this.setState({
          errorOnRequest: true,
          message: 'Lo sentimos ha ocurrido un error al solicitar el cambio de contraseña',
        });
        console.error('Error on request password change');
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
                name='email'
                meta={{ label: 'Correo' }}
                render={UsernameReactstrapInput}
              />

              <Button
                block
                className='border-0'
                color='success'
                disabled={pristine || invalid}
                size='lg'
                type='submit'
              >
                Recuperar contraseña
              </Button>
            </Form>
          )}
        />

        {this.state.errorOnRequest === undefined
          ? null
          : <Alert
            className={`alert ${this.state.errorOnRequest ? 'alert-danger' : 'alert-success'} mt-3`}
          >
            {this.state.message}
          </Alert>}
      </>
    );
  }
}

export default PasswordRequestForm;