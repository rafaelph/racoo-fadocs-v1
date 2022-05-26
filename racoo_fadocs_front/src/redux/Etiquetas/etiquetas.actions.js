import { LOAD } from './etiquetas.types';
export const loadEtiquetasAction = (etiquetas) => {
    return {
        type: LOAD,
        payload: etiquetas
    };
};