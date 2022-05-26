import { SHOW_FORM } from './auth.types';

export function showForm(formName) {
  return { type: SHOW_FORM, payload: formName };
}