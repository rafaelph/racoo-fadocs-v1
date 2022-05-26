import { Alert, FormGroup, Input, Label } from 'reactstrap';
import React from 'react';

/**
 * Devuelve el mensaje de error a mostrar
 *
 * @param hasError Función util para determinar los errores ocurridos
 */
function createErrorMessage(hasError) {
  if (hasError('required')) {
    return 'Campo contraseña es requerido';
  }

  if (hasError('minLength')) {
    return 'La contraseña es muy corta';
  }

  if (hasError('notEquivalent')) {
    return 'Las contraseñas no coinciden';
  }

  return '';
}

/**
 * Devuelve el input para el password usando la librería reactstrap
 *
 * @param handler
 * @param hasError
 * @param meta
 * @param touched
 * @returns {JSX.Element}
 * @constructor
 */
const PasswordReacstrapInput = ({ handler, hasError,  meta, touched }) => {
  const errorMessage = createErrorMessage(hasError);

  return (
    <FormGroup>
      <Label for={meta.label}>{meta.label}</Label>
      <Input className='mt-0'
             placeholder={meta.placeholder}
             type='password'
             {...handler()}
      />
      {
        touched
        && errorMessage.length !== 0
        && <Alert className='alert alert-danger mt-3'>{errorMessage}</Alert>
      }
    </FormGroup>
  );
};

export default PasswordReacstrapInput;