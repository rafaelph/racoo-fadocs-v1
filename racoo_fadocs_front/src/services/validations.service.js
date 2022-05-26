/**
 * Verifica que los campos password y confirmPassword sean iguales
 *
 * @param passwordKey Clave del campo password al inicializar el formulario
 * @param confirmPasswordKey Clave del campo confirmPassword al inicializar el
 * formulario
 * @returns {function(*): null}
 */
export function checkPasswords(passwordKey, confirmPasswordKey) {
  return (group) => {
    const passwordInput = group.controls[passwordKey];
    const confirmPasswordInput = group.controls[confirmPasswordKey];

    confirmPasswordInput.setErrors(
      passwordInput.value !== confirmPasswordInput.value
        ? { notEquivalent: true }
        : null,
    );

    return null;
  };
}