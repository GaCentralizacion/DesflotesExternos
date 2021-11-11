import { Component, OnInit, ViewEncapsulation, Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { FuseConfigService } from '../../../@fuse/services/config.service';
import { fuseAnimations } from '../../../@fuse/animations';
import { Store } from '@ngrx/store';
import { AppState, selectAuthState, selectPermisosState } from '../../store/app.states';
import { SessionInitializer } from '../../services/session-initializer';
import { Router, ActivatedRoute } from '@angular/router';
import { LogIn } from '../../store/actions/auth.actions';
import 'rxjs/add/observable/timer';
import { Subscription } from 'rxjs';
import * as firebase from 'firebase';
import { environment } from '../../../environments/environment';
import { NgxIndexedDB } from 'ngx-indexed-db';
import { CoalService } from '../../services/coal.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})

@Injectable({
  providedIn: 'root'
})

export class LoginComponent implements OnInit {

  getState: Observable<any>;
  errorMessage: string | null;
  imagen = 0;
  getStatePermisos: Observable<any>;
  isTwoFactorAuth: boolean;
  verificationId: any;

  // VARIABLES PARA EL MANEJO DEL STATE DE AUTENTICACION
  objAutenticacion: any = null;
  // VARIABLES PARA EL MANEJO DEL STATE DE SEGURIDAD
  objSeguridad: any = null;
  subsAuth: Subscription;
  loginForm: FormGroup;
  private dbSeguridad: NgxIndexedDB;
  spinner = false;
  usuarioBpro: any;

  constructor(private store: Store<AppState>,
    private _fuseConfigService: FuseConfigService,
    private _formBuilder: FormBuilder,
    public sessionInitializer: SessionInitializer,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private coalService: CoalService,
    private httpClient: HttpClient,
  ) {
    this.getState = this.store.select(selectAuthState);
    if (!firebase.apps.length) {
      firebase.initializeApp(environment.firebase);
    }
    this.dbSeguridad = new NgxIndexedDB(environment.nombreAplicacion, 1);
    // Configure the layout
    this._fuseConfigService.config = {
      layout: {
        navbar: {
          hidden: true
        },
        toolbar: {
          hidden: true
        },
        footer: {
          hidden: true
        },
        sidepanel: {
          hidden: true
        }
      }
    };
  }

  ngOnInit() {
    this.loginForm = this._formBuilder.group({
      usuarioBPRO: ['', [Validators.required]]
      // password: ['', Validators.required]
    });

    this.isTwoFactorAuth = false;
    let contador = 0
    this.subsAuth = this.getState.subscribe((state) => {
      this.errorMessage = state.error;
      if (contador === 0) {
        this.spinner = false;
        contador++
      }
      if (contador === 1 && this.errorMessage) {
        this.spinner = false;
      }

      if (state.autenticado) {
        this.isTwoFactorAuth = state.seguridad.user.twoFactor;

        if (this.isTwoFactorAuth && state.seguridad.user.phone) {

          firebase.auth().signInWithPhoneNumber(state.seguridad.user.phone,
            new firebase.auth.RecaptchaVerifier('recaptcha-container', {
              size: 'invisible',
              callback(response) { }
            })).then((confirmationResult) => {
              this.verificationId = confirmationResult.verificationId;
            }).catch((error) => {
              this.errorMessage = this.ValidateErrorCodeResponse(error);
            })
        }
      }
    });
    this.activatedRoute.queryParams.subscribe(params => {
      this.usuarioBpro = params.usuarioBpro;
      if (this.usuarioBpro) {
        this.LogIn(this.usuarioBpro)
      }
    })

    Observable.timer(0, 5000)
      .subscribe(() => {
        this.imagen++;
        if (this.imagen === 4) {
          this.imagen = 1;
        }
      });
  }


  private getDataRedux() {
    this.getState.subscribe((state) => {
      this.objAutenticacion = state.seguridad;
    });

    this.getStatePermisos.subscribe((state) => {
      this.objSeguridad = state.modulos;
    });

  }

  async LogIn(data: any) {
    let payload;
    let parametros;
    if (data.value) {
      parametros = {
        usuarioBPRO: data.value.usuarioBPRO
      }
    } else {
      parametros = {
        usuarioBPRO: data
      }
    }

    await (await this.GetServiceSeguridad(parametros)).subscribe(
      async (res: any) => {
        this.spinner = true;
        payload = {
          email: data + '@ga.com',
          password: res.recordsets[0][0].passwordBPRO,
          usuarioBpro: data
        };

        await this.store.dispatch(new LogIn(payload));

      });


  }

  async GetServiceSeguridad(body?: any) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient.post(environment.seguridadUrl + 'seguridad/userBPRO', body, { headers });
  }

  async CodeAuth(code: any) {
    // this.spinner = true;
    const credential = firebase.auth.PhoneAuthProvider.credential(this.verificationId, code.codeVerification);
    await firebase.auth().signInWithCredential(credential)
      .then(_result => {

        this.dbSeguridad.openDatabase(1).then((resultado) => {
          this.dbSeguridad.getByKey('seguridad', 1).then(result => {
            if (result) {

              this.dbSeguridad.update('seguridad', {
                Id: 1
              });

              this.sessionInitializer.state = true;
              this.router.navigate(['']);


            }

          });
        });
      })
      .catch(_error => {
        this.errorMessage = this.ValidateErrorCodeResponse(_error);
      });
  }

  ValidateErrorCodeResponse(_error: any): string {
    let result = '';
    switch (_error.code) {
      case 'auth/too-many-requests':
        result = 'Se ha bloqueado el número por peticiones excesivas, favor de intentar mas tarde...';
        break;
      case 'auth/invalid-verification-code':
        result = 'Codigo SMS invalido';
        break;
      case 'auth/network-request-failed':
        result = 'Ocurrió un error con la conexión, favor de recargar la pagina.';
        break;
    }
    return result;
  }


}