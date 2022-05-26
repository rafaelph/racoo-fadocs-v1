import React from 'react'
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import './styles.css'


export default function PasswordInput({ handler, touched, hasError, meta, onChange, value }) {
    const requiredError = touched && hasError("required") && `${meta.label || 'Campo'} requerido`;
    const minLengthError = touched && hasError("minLength") && `${meta.label || 'Campo'} debe contener 7 caracteres.`;
    const error = (requiredError || minLengthError) ? true : false;
    return (
        <TextField {...handler()}
            className="field"
            error={error}
            id={meta.label} 
            label={meta.label}
            type="password" 
            InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                   {meta.icon}
                  </InputAdornment>
                ),
            }}
            variant="outlined"
            required={meta.required}
            placeholder={meta.placeholder}
            helperText={requiredError || minLengthError}
            value={value}
            onChange={onChange}
        />
    )
}
