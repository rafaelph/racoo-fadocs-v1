import React from 'react'

const RadioInput = ({handler, touched, hasError, meta}) => (
    <div>
        <label>{meta.label}</label>
        <div className="table-field-container">  
            <input type="radio" /> Yes &nbsp;&nbsp; <input type="radio" /> No          
            <span style={{color: 'red'}}>{meta.required && '*'}</span>
        </div>
        
        <i className={meta.icon}></i>
        <span className="hint">{meta.hint}</span>
        <span className="error">
            {touched
            && hasError("required")
            && `${meta.label || 'Field'} is required`}
        </span>
    </div>
)

export default RadioInput;