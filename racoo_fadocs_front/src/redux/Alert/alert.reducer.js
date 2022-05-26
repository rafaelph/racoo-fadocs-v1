import { SHOW, HIDE } from './alert.types';


const INITIAL_STATE = {
    show: false,
    message: ''
};

const reducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case SHOW:
            return {
                ...state,
                show: true,
                message: action.message
            };
        case HIDE:
            return {
                ...state,
                show: false,
                message: ''
            };
        default: return state;
    }

};

export default reducer;