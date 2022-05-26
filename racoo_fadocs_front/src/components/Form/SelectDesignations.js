import React from 'react'
import store from '../../store/Store'

export default function SelectDesignations({ handler, touched, hasError, meta }) {
    const state = store.getState();
    const {designations} = state.designations;
    return (
        <div>
            <label>{meta.label}</label>
            <select className={meta.className} {...handler()} >
                <option> Please Choose</option>
                {designations && designations.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
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

/*
class SelectDesignations extends Component {    
    render() {
        const { handler, touched, hasError, meta, designations } = this.props;
        return (
            <div>
               <label>{meta.label}</label>
                <select className={meta.className} {...handler()} >
                    <option> Please Choose</option>
                    {designations.map(o => <option key={o.id} value={o.value}>{o.name}</option>)}
                </select>
                <i className={meta.icon}></i>
                <span>
                    {touched
                        && hasError("required")
                        && `${meta.label} is required`}
                </span> 
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        designations: state.designations
    }
}

export default connect(
    mapStateToProps
)(SelectDesignations)
*/