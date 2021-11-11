import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { AuthService } from '../../services/auth.service';
import { NgxIndexedDB } from 'ngx-indexed-db';
import { Store } from '@ngrx/store';
import { FuncionesGlobales } from '../../utilerias/clases/funcionesGlobales';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/catch';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { AuthActionTypes, LogIn, LogInSuccess, LogInFailure, LogOut } from '../actions/auth.actions';
import { AsignaPermisos, EliminaPermisos } from '../actions/permisos.actions';
import { AppState, selectPermisosState } from '../app.states';
import { CoalService } from '../../services/coal.service';
import { SessionInitializer } from '../../services/session-initializer';
import { TokenService } from '../../services/token.service';
import { environment } from '../../../environments/environment';


@Injectable()
export class AuthEffects {

    private db: NgxIndexedDB;
    permisosState: Observable<any>;
    private redireccionar = true; // Para indicar si vamos a redireccionar al home por defecto.

    /**
     * @description             Constructor de clase
     * @param actions           Acciones NgRX
     * @param authService       Servicio de autenticación seguridad V2
     * @param router            Modulo de routeo
     * @param store             Stire NgRX
     * @param CoalService    Servicio de conexión backend
     */
    constructor(
        private actions: Actions,
        private authService: AuthService,
        private router: Router,
        private store: Store<AppState>,
        private coalService: CoalService,
        public sessionInitializer: SessionInitializer,
        public tokenService: TokenService
    ) {
        this.db = new NgxIndexedDB(environment.nombreAplicacion, 1);
        this.store.select(selectPermisosState);
    }

    /**
     * @description         Efecto NgRX para el reducer de Login
     * @author              Antonio Guerra
     */
    @Effect()
    LogIn: Observable<any> = this.actions
        .ofType(AuthActionTypes.LOGIN)
        .map((action: LogIn) => action.payload)
        .switchMap(payload => {
            return this.authService.Login(payload.email, payload.password)
                .map((data) => {
                    data.data.usuarioBpro = payload.usuarioBpro
                    return new LogInSuccess({ seguridad: data.data });
                })
                .catch((error) => {
                    let err;
                    if (error.error.errors) {
                        err = error.error.errors[0].description
                    } else {
                        err = 'Error desconocido, inténtalo más tarde.'
                    }
                    return Observable.of(new LogInFailure({ error: err }));
                });
        });



    /**
     * @description         Efecto NgRX para el reducer de LoginSuccess
     * @author              Antonio Guerra
     */
    @Effect({ dispatch: false })
    LogInSuccess: Observable<any> = this.actions.pipe(
        ofType(AuthActionTypes.LOGIN_SUCCESS),
        tap((user: any) => {
            this.db.openDatabase(1, evt => {
                const objectStore = evt.currentTarget.result.createObjectStore('seguridad', { keyPath: 'Id', autoIncrement: false });
                objectStore.transaction.oncomplete = function () {
                    this.db.transaction('seguridad', 'readwrite').objectStore('seguridad');
                };
            }).then(() => {
                this.db.getByKey('seguridad', 1).then(result => {
                    this.store.dispatch(new AsignaPermisos({ modulos: FuncionesGlobales.GetRecursividad(user.payload.seguridad.permissions.modules) }));
                    this.tokenService.setToken(user.payload.seguridad.security.token);


                    if (result === undefined) {
                        this.db.add('seguridad', {
                            Id: 1,
                            seguridad: user.payload.seguridad
                        });
                    } else {
                        this.db.update('seguridad', {
                            Id: 1,
                            seguridad: user.payload.seguridad
                        });
                    }


                    if (!user.payload.seguridad.user.twoFactor) {
                        this.db.update('seguridad', {
                            Id: 1,
                            seguridad: user.payload.seguridad
                        });
                        this.sessionInitializer.state = true;
                        this.router.navigate(['']);
                    }

                });
            }).catch((error) => {
                this.store.dispatch(new EliminaPermisos());
                this.store.dispatch(new LogOut());
            });
        })
    );

    /**
     * @description         Efecto NgRX para el reducer de LoginFailure
     * @author              Antonio Guerra
     */
    @Effect({ dispatch: false })
    LogInFailure: Observable<any> = this.actions.pipe(
        ofType(AuthActionTypes.LOGIN_FAILURE)
    );
    /**
     * @description         Efecto NgRX para el reducer de LogOut
     * @author              Antonio Guerra
     */
    @Effect({ dispatch: false })
    public LogOut: Observable<any> = this.actions.pipe(
        ofType(AuthActionTypes.LOGOUT),
        tap(async () => {
            await this.db.openDatabase(1).then(async () => {
                await this.db.clear('seguridad');
                this.sessionInitializer.state = false;
                this.router.navigate(['login']);
            });
        })
    );
}
