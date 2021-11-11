import * as autenticacion from './reducers/auth.reducers';
import * as permisos from './reducers/permisos.reducers';
import { createFeatureSelector } from '@ngrx/store';

export interface AppState {
  autenticacionState: autenticacion.State;
  permisosState: permisos.State;

}

export const reducers = {
  autenticacion: autenticacion.authReducer,
  seguridad: permisos.Reducer,
};

export const selectAuthState = createFeatureSelector<AppState>('autenticacion');
export const selectPermisosState = createFeatureSelector<AppState>('seguridad');
