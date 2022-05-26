import React from 'react'
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import './styles.css'

const EmailInput = ({ handler, touched, hasError, meta, onChange, value }) => {
    const requiredError = touched && hasError("required") && `${meta.label || 'Field'} required`;
    const emailError = touched && hasError("email") && `Invalid email`;
    const paternError = touched && hasError("pattern") && `Invalid email`;
    const error = (requiredError || emailError || paternError) ? true : false;
    return (
        <TextField {...handler()}
            className="field"
            error={error}
            id={meta.label} 
            label={meta.label} 
            InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    {meta.icon}
                  </InputAdornment>
                ),
            }}
            variant="outlined"
            required={meta.required}
            disabled={meta.disabled}
            placeholder={meta.placeholder}
            helperText={requiredError || emailError || paternError}
            value={value}
            onChange={onChange}
        />
    )
}

export default EmailInput;