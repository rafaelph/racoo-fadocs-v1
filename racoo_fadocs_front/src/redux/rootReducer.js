import { combineReducers } from 'redux';

import alertReducer from './Alert/alert.reducer';
import authReducer from './Auth/auth.reducer';
import etiquetasReducer from './Etiquetas/etiquetas.reducer';
import filesReducer from './Files/files.reducer';
import stepReducer from './Step/step.reducer';
import userReducer from './User/user.reducer';

const rootReducer = combineReducers({
    alert: alertReducer,
    auth: authReducer,
    etiquetas: etiquetasReducer,
    files: filesReducer,
    step: stepReducer,
    user: userReducer,
});

export default rootReducer;
