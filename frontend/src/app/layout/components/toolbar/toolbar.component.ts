import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import * as _ from 'lodash-es';

import { FuseConfigService } from '../../../../@fuse/services/config.service';
import { FuseSidebarService } from '../../../../@fuse/components/sidebar/sidebar.service';

import { navigation } from '../../../../app/navigation/navigation';
import { Router } from '@angular/router';

import { SessionInitializer } from '../../../services/session-initializer';
import { BaseService } from '../../../../app/services/base.service';
import { Store } from '@ngrx/store';
import { AppState, selectPermisosState } from 'app/store/app.states';
import { Observable, Subscription } from 'rxjs';
// para notificaciones
import { CoalService } from '../../../services/coal.service';
import { ExcepcionesComponent } from '../../../../app/utilerias/excepciones/excepciones.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
    selector: 'toolbar',
    templateUrl: './toolbar.component.html',
    styleUrls: ['./toolbar.component.scss'],
    encapsulation: ViewEncapsulation.None,
    providers: [CoalService]
})

export class ToolbarComponent implements OnInit, OnDestroy {
    horizontalNavbar: boolean;
    rightNavbar: boolean;
    hiddenNavbar: boolean;
    languages: any;
    navigation: any;
    userStatusOptions: any[];
    datosUsuario: any;
    state: any;
    objSeguridad: any[];

    getState: Observable<any>;
    subsAuth: Subscription;
    breadcrumb: any;
    badgeContent : number;
    hiddeMatBadge : boolean;
    countNotificaciones = [];

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {FuseConfigService} _fuseConfigService
     * @param {FuseSidebarService} _fuseSidebarService
     * @param {TranslateService} _translateService
     */
    constructor(
        private _fuseConfigService: FuseConfigService,
        private _fuseSidebarService: FuseSidebarService,
        private _translateService: TranslateService,
        private router: Router,
        private sessionInitializer: SessionInitializer,
        private baseService: BaseService,
        private store: Store<AppState>,
        private coalService: CoalService,
        public dialog: MatDialog
    ) {

        this.getState = this.store.select(selectPermisosState);

        // Set the defaults
        this.userStatusOptions = [
            {
                title: 'Online',
                icon: 'icon-checkbox-marked-circle',
                color: '#4CAF50'
            },
            {
                title: 'Away',
                icon: 'icon-clock',
                color: '#FFC107'
            },
            {
                title: 'Do not Disturb',
                icon: 'icon-minus-circle',
                color: '#F44336'
            },
            {
                title: 'Invisible',
                icon: 'icon-checkbox-blank-circle-outline',
                color: '#BDBDBD'
            },
            {
                title: 'Offline',
                icon: 'icon-checkbox-blank-circle-outline',
                color: '#616161'
            }
        ];

        this.languages = [
            {
                id: 'en',
                title: 'English',
                flag: 'us'
            },
            {
                id: 'tr',
                title: 'Turkish',
                flag: 'tr'
            }
        ];

        this.navigation = navigation;

        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {

        this.subsAuth = this.getState.subscribe((state) => {
            this.breadcrumb = state.breadcrumb;
        })

        // Subscribe to the config changes
        this._fuseConfigService.config
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((settings) => {
                this.horizontalNavbar = settings.layout.navbar.position === 'top';
                this.rightNavbar = settings.layout.navbar.position === 'right';
                this.hiddenNavbar = settings.layout.navbar.hidden === true;
            });


        if (this.sessionInitializer.state) {
            this.state = this.baseService.getUserData();
            this.datosUsuario = this.state.user

            this.objSeguridad = [];
            let objSeguridadTmo = [];
            objSeguridadTmo = this.baseService.getSecurityData().modulos;

            if (objSeguridadTmo) {
                objSeguridadTmo.forEach((ob: any) => {
                    if (ob.caption.datos) {
                        this.objSeguridad.push(ob);
                    }
                });
            }


        }

        this.store.select(selectPermisosState).subscribe(datos => {
            this.LoadNotification();
        });

    }

    //construccion de la lectura de notificaciones
    LoadNotification() {
        this.badgeContent = 4;

        // this.coalService.getService(`pendiente/GetListaNotificaciones`).subscribe(
        //     (res: any) => {
        //       if (res.err) {
        //         this.Excepciones(res.err, 4);
        //       } else if (res.excepcion) {
        //         this.Excepciones(res.excepcion, 3);
        //       } else {
        //         this.countNotificaciones = res.recordsets[1];
        //         let longitudNotificacion = this.countNotificaciones[0]['esActivo'];
        //         this.badgeContent = longitudNotificacion;
        //         // if(this.badgeContent == 0){
        //         // this.hiddeMatBadge = true;
        //         // }
        //       }
        //     //   this.spinner = false
        //     }, (error: any) => {
        //       this.Excepciones(error, 2);
        //     //   this.spinner = false
        //     }
        //   );
    }

    goSelNotificacion(){
        this.router.navigateByUrl('/sel-notificaciones');
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Toggle sidebar open
     *
     * @param key
     */
    toggleSidebarOpen(key): void {
        this._fuseSidebarService.getSidebar(key).toggleOpen();
    }

    /**
     * Search
     *
     * @param value
     */
    search(value): void {
        // Do your search here...
        console.log(value);
    }


    async CerrarSesion() {
        await this.sessionInitializer.setStateLogOut();
    }

    Excepciones(pila, tipoExcepcion: number) {
        try {
          const dialogRef = this.dialog.open(ExcepcionesComponent, {
            width: '60%',
            data: {
              idTipoExcepcion: tipoExcepcion,
              idUsuario: 1,
              idOperacion: 1,
              idAplicacion: 1,
              moduloExcepcion: 'sel-pendiente-report.component',
              mensajeExcepcion: '',
              stack: pila
            }
          });
          dialogRef.afterClosed().subscribe((result: any) => { });
        } catch (error) {
          console.error(error);
        }
      }
}
