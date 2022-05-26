import { MOVE_FORWARD, MOVE_BACKWARD, SET_STEP } from './step.types';
export const moveForwardAction = () => {
    return {
        type: MOVE_FORWARD,
    };
};

export const moveBackwardAction = () => {
    return {
        type: MOVE_BACKWARD,
    };
};

export const setStepAction = (step) => {
    return {
        type: SET_STEP,
        payload: step
    };
};