import { Injectable } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { AppState, selectAuthState, selectPermisosState } from '../store/app.states';
import { Store } from '@ngrx/store';
import { NgxIndexedDB } from 'ngx-indexed-db';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BaseService {
  private idxCOAL: NgxIndexedDB;
  private stateAuth: Observable<any>;
  private stateSecu: Observable<any>;
  private SeguridadSubscribe: Subscription;
  private AutenticacionSubscribe: Subscription;

  constructor(private store: Store<AppState>) {
    this.stateReduxStore();
    this.idxCOAL = new NgxIndexedDB(environment.nombreAplicacion, 1);
  }

  private stateReduxStore() {
    this.stateAuth = this.store.select(selectAuthState);
    this.stateSecu = this.store.select(selectPermisosState);
  }

  /**
   * Solo obtiene los datos del usuario y destruye la suscripción, es para datos que no requieren que este un observable
  */
  public getUserData() {
    let usuario;
    this.AutenticacionSubscribe = this.stateAuth.subscribe(state => {
      usuario = state.seguridad;
    });
    this.AutenticacionSubscribe.unsubscribe();
    return usuario;
  }


  /**
   * Solo obtiene los datos de la seguridad y destruye la suscripción, es para datos que no requieren que este un observable
  */
  public getSecurityData() {
    let seguridad;
    this.SeguridadSubscribe = this.stateSecu.subscribe(state => {
      seguridad = state;
    })
    this.SeguridadSubscribe.unsubscribe();
    return seguridad;
  }


}
