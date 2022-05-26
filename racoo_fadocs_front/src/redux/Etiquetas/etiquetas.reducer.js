import { LOAD } from './etiquetas.types';


const INITIAL_STATE = {
    etiquetas: [],
};

const reducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case LOAD:
            return {
                ...state, 
                etiquetas: action.payload,
            };
        default: return state;

    }

};

export default reducer;