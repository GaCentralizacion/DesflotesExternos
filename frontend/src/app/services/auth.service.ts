import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { NgxIndexedDB } from 'ngx-indexed-db';
import { TokenService } from './token.service';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private db: NgxIndexedDB;
    /**
     * @description           Constructor de clase
     * @param httpClient      Módulo que permite las peticiones http del cliente
     * @author                Antonio Guerra
     */
    constructor(private httpClient: HttpClient, protected tokenService: TokenService) {
        this.db = new NgxIndexedDB(environment.nombreAplicacion, 1);
    }
    /**
     * @description         Método para inicio de sesión del usuario
     * @param user          Nombre de usuario
     * @param pass          Password de usuario
     * @returns             Observable
     * @author              Antonio Guerra
     */
    Login(user: string, pass: string): Observable<any> {
        let params = {};
        params = { credenciales: { email: user, password: pass }, aplicacion: environment.aplicacionesId };
        return this.httpClient.post(environment.seguridadUrl + 'seguridad/Login', params);
    }

    /**
//  * @description           Metodo LoginByToken, logear por medio del token
//  * @param token           Token a validar
//  * @returns               Observable
//  */
//     LoginByToken(token: any): Observable<any> {
//         this.tokenService.setToken(token);
//         return this.httpClient.post(environment.serviceUrl + 'v2/auth/LoginForToken', { applicationId: environment.aplicacionesId });
//     }

    /**
     * @description     Método para obtención de Token Seguridad V2
     * @returns         Observable
     * @author          Antonio Guerra
     */
    GetToken() {
        return new Observable<boolean>((observer) => {
            this.db.openDatabase(1).then(() => {
                this.db.getAll('seguridad').then((res) => {
                    if (res.length > 0) {
                        observer.next(true);
                        observer.complete();
                    } else {
                        observer.next(false);
                        observer.complete();
                    }
                }).catch(() => {
                    observer.next(false);
                    observer.complete();
                });
            });
        });
    }

    GetTokenStr(): string {
        return this.tokenService.getToken();
    }
}
