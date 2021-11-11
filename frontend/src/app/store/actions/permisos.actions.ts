import { Action } from '@ngrx/store';

/**
 * Tipos de Acción para el Store de Permisos
 */
export enum PermisosActionTypes {
    AsignaPermisos = '[Permisos] Asigna Permisos',
    AsignaBreadcrumb = '[Permisos] Adigna Breadcrumb',
    EliminaPermisos = '[Permisos] Elimina Permisos',
}

export class AsignaPermisos implements Action {
    readonly type = PermisosActionTypes.AsignaPermisos;
    constructor(public payload: any) { }
}

export class AsignaBreadcrumb implements Action {
    readonly type = PermisosActionTypes.AsignaBreadcrumb;
    constructor(public payload: any) { }
}

export class EliminaPermisos implements Action {
    readonly type = PermisosActionTypes.EliminaPermisos;
}


export type All =
    AsignaPermisos
    | AsignaBreadcrumb
    | EliminaPermisos;
