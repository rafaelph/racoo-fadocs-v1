import { SHOW, HIDE } from './alert.types';
export const showAction = (message) => {
    return {
        type: SHOW,
        message
    };
};

export const hideAction = () => {
    return {
        type: HIDE,
    };
};