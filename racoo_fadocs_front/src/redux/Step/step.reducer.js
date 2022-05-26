import { MOVE_FORWARD, MOVE_BACKWARD, SET_STEP } from './step.types';


const INITIAL_STATE = {
    step: 0,
};

const reducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case MOVE_FORWARD:
            return {
                ...state,
                step: state.step + 1,
            };
        case MOVE_BACKWARD:
            return {
                ...state,
                step: state.step - 1,
            };
        case SET_STEP:
            return {
                ...state,
                step: action.payload,
            };
        default: return state;
    }

};

export default reducer;