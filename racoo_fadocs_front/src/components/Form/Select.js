import React from 'react'
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import './styles.css'

const MySelect = ({ handler, touched, hasError, meta, onChange, value }) => {
    const requiredError = touched && hasError("required") && `${meta.label || 'Field'} required`;
    const error = requiredError ? true : false;
    return (
        <TextField {...handler()}
            select
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
            disabled={meta.disabled || meta.options.length === 0}
            variant="outlined"
            required={meta.required}
            placeholder={meta.placeholder}
            helperText={requiredError}
            value={value}
            onChange={onChange}
        >
            {meta.options}
        </TextField>
    )
}

export default MySelect;