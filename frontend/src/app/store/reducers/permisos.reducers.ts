import { All, PermisosActionTypes } from '../actions/permisos.actions';

export interface State {
    modulos: any | null | {};
    error: string | null;
    breadcrumb: string | null;
}

export const initialState: State = {
    modulos: null,
    error: null,
    breadcrumb: null,
};

export function Reducer(state = initialState, action: All): State {
    switch (action.type) {
        case PermisosActionTypes.AsignaPermisos:
            return {
                ...state,
                error: null,
                modulos: action.payload.modulos
            };

        case PermisosActionTypes.AsignaBreadcrumb:
            return {
                ...state,
                error: null,
                breadcrumb: action.payload.breadcrumb
            };

        case PermisosActionTypes.EliminaPermisos:
            return initialState;

        default:
            return state;
    }
}
