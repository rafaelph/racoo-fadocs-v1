import { UPDATE_PROFILE_IMAGE } from './user.types';

const currentUser = JSON.parse(localStorage.getItem('currentUser'));

const INITIAL_STATE = {
    profileImage: currentUser ? currentUser.img : '',
};

const reducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case UPDATE_PROFILE_IMAGE:
            return {
                ...state,
                profileImage: action.payload,
            };
        default: return state;
    }

};

export default reducer;
