import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Button } from 'reactstrap';
import { connect } from 'react-redux';

import logo200Image from '../assets/img/logo/logo_200.png';

import { showForm } from '../redux/Auth/auth.actions';

import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import PasswordRequestForm from './PasswordRequestForm';
import ChangePasswordForm from './ChangePasswordForm';

class AuthForm extends Component {

  componentDidMount() {
    this.updateNavigation();

    // Si el estado de formName es el inicial entonces se actualiza a partir
    // de lo definido por url
    if (this.props.formName === '') {
      this.updateFormNameFromUrl(this.props.location.pathname);
    }

  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    // Solo actualiza la navegación si hubo un cambio de formulario
    if (prevProps.formName !== this.props.formName) {
      this.updateNavigation();
    }
  }

  /**
   * Actualiza la url que se muestra en el navegador
   */
  updateNavigation() {
    if (this.props.formName === STATE_LOGIN) {
      this.props.history.push('/login');
    } else if (this.props.formName === STATE_SIGNUP) {
      this.props.history.push('/signup');
    } else if (this.props.formName === STATE_PASSWORD_REQUEST) {
      this.props.history.push('/password-request');
    }
  }

  /**
   * Actualiza el estado del formulario a mostrar a partir de la url que
   * se está visitando
   *
   * @param pathname Parte final de la url y valor que se mapea en el router
   */
  updateFormNameFromUrl(pathname) {
    if (pathname === '/login') {
      this.props.showForm(STATE_LOGIN);
    }
    else if (pathname === '/signup') {
      this.props.showForm(STATE_SIGNUP);
    }
    else if (pathname === '/password-request') {
      this.props.showForm(STATE_PASSWORD_REQUEST);
    }
    else if (pathname === '/cambiar-password') {
      this.props.showForm(STATE_CHANGE_PASSWORD);
    }
  }

  /**
   * Muestra el formulario correspondiente a la página que se muestra
   */
  renderForm() {
    if (this.props.formName === STATE_LOGIN) {
      return <LoginForm history={this.props.history} />;
    }

    if (this.props.formName === STATE_SIGNUP) {
      return <RegisterForm />;
    }

    if (this.props.formName === STATE_PASSWORD_REQUEST) {
      return <PasswordRequestForm />;
    }

    return <ChangePasswordForm
      history={this.props.history}
      location={this.props.location}
    />;
  }

  render() {
    const {
      showLogo,
      children,
      onLogoClick,
    } = this.props;

    return (
      <>
        {showLogo && (
          <div className='text-center pb-4'>
            <img
              src={logo200Image}
              className='rounded'
              style={{ width: 60, height: 60, cursor: 'pointer' }}
              alt='logo'
              onClick={onLogoClick}
            />
            <h3>Iniciar Sesión</h3>
          </div>
        )}

        {/* Se renderiza el formulario correspondiente */}
        {this.renderForm()}

        <div className='text-center pt-1'>
          <h6>
            {this.props.formName === STATE_SIGNUP ? (
              <Button color='link' type='button' onClick={() => this.props.showForm(STATE_LOGIN)}>
                Login
              </Button>
            ) : (
              <div className='pt-3'>
                <Button color='link' type='button' onClick={() => this.props.showForm(STATE_PASSWORD_REQUEST)}>
                  ¿Olvidaste la contraseña?
                </Button>
                <label className='pt-3'>¿No tienes una cuenta?
                  <Button color='link' type='button' onClick={() => this.props.showForm(STATE_SIGNUP)}>
                    Regístrate
                  </Button>
                </label>
              </div>
            )}
          </h6>
        </div>
        {children}
      </>
    );
  }
}

export const STATE_LOGIN = 'LOGIN';
export const STATE_SIGNUP = 'SIGNUP';
export const STATE_PASSWORD_REQUEST = 'PASSWORD_REQUEST';
export const STATE_CHANGE_PASSWORD = 'CHANGE_PASSWORD';

AuthForm.propTypes = {
  showLogo: PropTypes.bool,
  onLogoClick: PropTypes.func,
};

AuthForm.defaultProps = {
  showLogo: true,
};

export default connect(
  ({ auth }, props) => ({ ...props, formName: auth.formName }),
  { showForm },
  )(AuthForm);
