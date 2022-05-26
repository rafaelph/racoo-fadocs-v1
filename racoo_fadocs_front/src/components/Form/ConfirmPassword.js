import React from 'react'
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";

export default function ConfirmPassword({ handler, touched, hasError, meta, onChange, value }) {
    const mismatchError = touched && hasError("mismatch") && `Las contraseñas no coinciden`;
    const error = mismatchError ? true : false;
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
                   helperText={mismatchError}
                   value={value}
                   onChange={onChange}
        />
    )
}
