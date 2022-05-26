import React from 'react'

const PhoneInput = ({ handler, touched, hasError, meta }) => (
    <div>
        <label>{meta.label}</label>
        <input className={meta.className} placeholder={meta.placeholder} {...handler()}/>
        <i className={meta.icon}></i>
        <span className="error">
            {meta.required
            && touched
            && hasError("required")
            && `${meta.label} is required`}
        </span>
        <span className="error">
            {meta.required
            && touched
            && hasError("patern")
            && `Invalid phone number`}
        </span>
    </div>  
)

export default PhoneInput;