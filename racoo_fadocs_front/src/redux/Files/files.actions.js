import {FILES_LOAD, STORE_DRIVE_FILE, REMOVE_DRIVE_FILE, CLEAR_DRIVE_FILES, IMAGE_LOAD} from './files.types';
export const loadFilesAction = (files) => {
    return {
        type: FILES_LOAD,
        payload: files
    };
};

export const loadImageAction = (image) => {
    return {
        type: IMAGE_LOAD,
        payload: image
    };

};

export const storeDriveFile = (file) => {
    return {
        type: STORE_DRIVE_FILE,
        payload: file
    };
};

export const removeDriveFile = (file) => {
    return {
        type: REMOVE_DRIVE_FILE,
        payload: file
    };
};

export const clearDriveFiles = () => {
    return {
        type: CLEAR_DRIVE_FILES
    };
};