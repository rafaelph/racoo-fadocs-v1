import React from 'react'
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import './styles.css'

const TextInput = ({ handler, touched, hasError, meta, onChange, value }) => {
    if (!value) value = '';
    const requiredError = touched && hasError("required") && `${meta.label || 'Field'} required`;
    const patternError = touched && hasError("pattern") && `Invalid ${meta.label || 'Field'}`;
    const minLengthError = touched && hasError("minLength") && `${meta.label || 'Field'} too short`;
    const maxLengthError = touched && hasError("maxLength") && `${meta.label || 'Field'} too large`;
    const error = (requiredError || patternError || minLengthError || maxLengthError)  ? true : false;
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
            helperText={requiredError || patternError || minLengthError || maxLengthError}
            value={value}
            onChange={onChange}
        />
    )
}

export default TextInput;
