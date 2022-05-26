import React from 'react'
import store from '../../redux/store'

export default function SelectState({ handler, touched, hasError, meta }) {
    const state = store.getState();
    const {states} = state.states;
    return (
        <div>
            <label>{meta.label}</label>
            <select className={meta.className} {...handler()} >
                <option> Please Choose</option>
                {states && states.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
            </select>
            <i className={meta.icon}></i>
            <span className="error">
                {touched
                    && hasError("required")
                    && `${meta.label} is required`}
            </span>
        </div>
    )
}
