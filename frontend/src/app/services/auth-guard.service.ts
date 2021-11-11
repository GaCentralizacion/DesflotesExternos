import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/first';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {
  getState: Observable<any>;
  /**
   * @description   Constructor de clase
   * @param auth    Servicio de seguridad 
   * @param router  Módulo de routeo
   */
  constructor(
    public auth: AuthService,
    public router: Router
  ) { }
  /**
   * @description         Método que verifica si el usuario puede acceder o no al componente
   * @author              Antonio Guerra
   * @returns             Observable<boolean> por conexión con IndexedDB
   */
  canActivate(): boolean | Observable<boolean> {
    return this.auth.GetToken().map(res => {
      if (res) {
        return true;
      } else {
        this.router.navigate(['login']);
        return false;
      }
    });
  }
}
