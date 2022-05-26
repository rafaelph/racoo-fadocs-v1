import { Alert, FormGroup, Input, Label } from 'reactstrap';
import React from 'react';

/**
 * Devuelve el mensaje de error a mostrar
 *
 * @param hasError Función util para determinar los errores ocurridos
 */
function createErrorMessage(hasError) {
  if (hasError('required')) {
    return 'Campo usuario es requerido';
  }

  if (hasError('email')) {
    return 'Campo usuario no es un email válido';
  }

  return '';
}

/**
 * Devuelve el input para el nombre de usuario usando la librería reactstrap
 *
 * @param handler
 * @param hasError
 * @param meta
 * @param touched
 * @returns {JSX.Element}
 * @constructor
 */
const UsernameReactstrapInput = ({ handler, hasError, meta, touched  }) => {
  const errorMessage = createErrorMessage(hasError);

  return (
    <FormGroup>
      <Label>{meta.label}</Label>
      <Input
        className='mt-0'
        placeholder={meta.placeholder || "perez@ejemplo.com"}
        type='text'
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

export default UsernameReactstrapInput;