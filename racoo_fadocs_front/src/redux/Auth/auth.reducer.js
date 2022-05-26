import { SHOW_FORM } from './auth.types';

const INITIAL_STATE = {
    formName: '',
};

const reducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case SHOW_FORM:
            return {
                ...state,
                formName: action.payload,
            };
        default: return state;
    }

};

export default reducer;