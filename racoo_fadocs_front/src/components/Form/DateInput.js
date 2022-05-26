import React from 'react'
import DatePicker from 'react-date-picker'
import './styles.css'

const currentDate = new Date();
const DateInput = ({ handler, touched, hasError, meta }) => (
    <div className="form-control">
        <label>{meta.label}</label>
        <div className="table-field-container"> 
           { meta.disabled ? <DatePicker minValue={new Date()} value={meta.date || currentDate} {...handler()}  disabled={meta.disabled}/> : <DatePicker minValue={new Date()} value={meta.date || currentDate} {...handler()} />}
            <span style={{color: 'red'}}>{meta.required && '*'}</span>
        </div>
        <span className="error">
            {touched
            && hasError("required")
            && `${meta.label || 'Field'} is required`}
        </span>
    </div>  
)

export default DateInput;
