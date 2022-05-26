import {FILES_LOAD, STORE_DRIVE_FILE, REMOVE_DRIVE_FILE, CLEAR_DRIVE_FILES, IMAGE_LOAD} from './files.types';


const INITIAL_STATE = {
    files: [],
    driveFiles: [],
    images: []
};

const reducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case FILES_LOAD:
            return {
                ...state,
                files: action.payload.map((file, index) => ({ ...file, index })),
            };
        case IMAGE_LOAD:
            return {
                ...state,
                images: action.payload.map((img, index) => ({ ...img, index })),
            };
        case STORE_DRIVE_FILE:
            const driveFiles = state.driveFiles.concat([action.payload])
            return {
                ...state,
                driveFiles,
            };
        case REMOVE_DRIVE_FILE:
            const index = state.driveFiles.findIndex(f => f.id === action.payload.id);
            if (index >= 0) {
                state.driveFiles.splice(index, 1);
                const newFiles = [...state.driveFiles]
                return {
                    ...state,
                    driveFiles: newFiles,
                };
            } else {
                console.log('invalid file to remove')
                return {
                    ...state,
                };
            }
        case CLEAR_DRIVE_FILES:
            return {
                ...state,
                driveFiles: [],
            };
        default: return state;

    }

};

export default reducer;
