import React from 'react'
import Switch from "react-switch";

export default function OnOffInput({chk1, onChanged}) {
    return (
        <div>
            <div className="table-field-container">  
                <Switch 
                     onChange= {(chk)=>onChanged(chk)}
                     checked = {chk1}
                />          
            </div>
        </div>
    )
}