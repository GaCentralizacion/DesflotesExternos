import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Platform } from '@angular/cdk/platform';
import { TranslateService } from '@ngx-translate/core';
import { Subject, Observable, BehaviorSubject, Subscription  } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FuseConfigService } from '@fuse/services/config.service';
import { FuseNavigationService } from '@fuse/components/navigation/navigation.service';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { FuseSplashScreenService } from '@fuse/services/splash-screen.service';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { Store } from '@ngrx/store';
import { AppState, selectAuthState, selectPermisosState } from './store/app.states';
import { navigation } from 'app/navigation/navigation';
import { locale as navigationEnglish } from 'app/navigation/i18n/en';
import { locale as navigationTurkish } from 'app/navigation/i18n/tr';
import { SessionInitializer } from './services/session-initializer';
import { ActivatedRoute, Router } from '@angular/router';
import { LogOut } from './store/actions/auth.actions';

const MINUTES_UNITL_AUTO_LOGOUT = 30; // in mins
const CHECK_INTERVAL = 1000; // in ms
const STORE_KEY = 'lastAction';

@Component({
    selector: 'app',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
    fuseConfig: any;
    navigation: any;
    getState: Observable<any>;
    getStatePermisos: Observable<any>;
    private getStateAutenticacion: Observable<any>;
    subsParams: Subscription;

    globalInterval: any;

    // VARIABLES PARA EL MANEJO DEL STATE DE AUTENTICACION
    objAutenticacion: any = null;
    // VARIABLES PARA EL MANEJO DEL STATE DE SEGURIDAD
    objSeguridad: any = null;

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {DOCUMENT} document
     * @param {FuseConfigService} _fuseConfigService
     * @param {FuseNavigationService} _fuseNavigationService
     * @param {FuseSidebarService} _fuseSidebarService
     * @param {FuseSplashScreenService} _fuseSplashScreenService
     * @param {FuseTranslationLoaderService} _fuseTranslationLoaderService
     * @param {Platform} _platform
     * @param {TranslateService} _translateService
     */
    constructor(
        @Inject(DOCUMENT) private document: any,
        private _fuseConfigService: FuseConfigService,
        private _fuseNavigationService: FuseNavigationService,
        private _fuseSidebarService: FuseSidebarService,
        private _fuseSplashScreenService: FuseSplashScreenService,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private _translateService: TranslateService,
        private _platform: Platform,
        private store: Store<AppState>,
        public sessionInitializer: SessionInitializer,
        private router: Router,
    ) {

        this.getState = this.store.select(selectAuthState);
        this.getStatePermisos = this.store.select(selectPermisosState);

        // Get default navigation
        this.navigation = navigation;

        // Register the navigation to the service
        this._fuseNavigationService.register('main', this.navigation);

        // Set the main navigation as our current navigation
        this._fuseNavigationService.setCurrentNavigation('main');

        // Add languages
        this._translateService.addLangs(['en', 'tr']);

        // Set the default language
        this._translateService.setDefaultLang('en');

        // Set the navigation translations
        this._fuseTranslationLoaderService.loadTranslations(navigationEnglish, navigationTurkish);

        // Use a language
        this._translateService.use('en');

        /**
         * ----------------------------------------------------------------------------------------------------
         * ngxTranslate Fix Start
         * ----------------------------------------------------------------------------------------------------
         */

        /**
         * If you are using a language other than the default one, i.e. Turkish in this case,
         * you may encounter an issue where some of the components are not actually being
         * translated when your app first initialized.
         *
         * This is related to ngxTranslate module and below there is a temporary fix while we
         * are moving the multi language implementation over to the Angular's core language
         * service.
         */

        // Set the default language to 'en' and then back to 'tr'.
        // '.use' cannot be used here as ngxTranslate won't switch to a language that's already
        // been selected and there is no way to force it, so we overcome the issue by switching
        // the default language back and forth.
        /**
         * setTimeout(() => {
         * this._translateService.setDefaultLang('en');
         * this._translateService.setDefaultLang('tr');
         * });
         */

        /**
         * ----------------------------------------------------------------------------------------------------
         * ngxTranslate Fix End
         * ----------------------------------------------------------------------------------------------------
         */

        // Add is-mobile class to the body if the platform is mobile
        if (this._platform.ANDROID || this._platform.IOS) {
            this.document.body.classList.add('is-mobile');
        }

        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    private getDataRedux() {
        this.getState.subscribe((state) => {
            this.objAutenticacion = state.seguridad;
        });

        this.getStatePermisos.subscribe((state) => {
            this.objSeguridad = state.modulos;
        });


    }

    //valida que sea reset de password
    private validateLogin() {
        const queryP = window.location.search.substring(1);
        // const parsed_qs = this.parse_query_string(queryP);
        console.log('dkjhfkashdlsan', queryP)
        const arrayData = window.location.href.split('/');
        if (this.sessionInitializer.state) {
            this.getDataRedux();
        } else if (arrayData[3] === 'upd-password') {
            this.router.navigate([`upd-password/${arrayData[4]}`]);
        } else if (queryP.indexOf('usuarioBpro') >= 0) {
            // this.router.navigate(['login']);
            this.router.navigateByUrl(`/login?${queryP}`);
        } else {
            this.router.navigate(['login']);
        }

        // const validaLogin = window.location.pathname.split('/');
        // const arrayData = window.location.href.split('/');
        // if (this.sessionInitializer.state) {
        //     this.getDataRedux();
        // } else if (arrayData[3] === 'upd-password') {
        //     this.router.navigate([`upd-password/${arrayData[4]}`]);
        // } else if (validaLogin.find(x => x === 'login')) {
        //     // this.router.navigate(['login']);
        //     this.router.navigateByUrl(`/login/${validaLogin[validaLogin.length - 1]}`);
        // }
    }

    parse_query_string(query) {
        const vars = query.split('&');
        // tslint:disable-next-line:variable-name
        const query_string = {};
        for (const i of vars) {
          const pair = i.split('=');
          const key = decodeURIComponent(pair[0]);
          const value = decodeURIComponent(pair[1]);
          // If first entry with this name
          if (typeof query_string[key] === 'undefined') {
            query_string[key] = decodeURIComponent(value);
            // If second entry with this name
          } else if (typeof query_string[key] === 'string') {
            const arr = [query_string[key], decodeURIComponent(value)];
            query_string[key] = arr;
            // If third or later entry with this name
          } else {
            query_string[key].push(decodeURIComponent(value));
          }
        }
        return query_string;
      }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.validateLogin();
        this.getStateAutenticacion = this.store.select(selectAuthState);
        this.getStateAutenticacion.subscribe((stateAutenticacion) => {
            if (stateAutenticacion.autenticado) {
                
                this.initEventListener();
                this.initInterval();
            } else if (this.globalInterval !== undefined) {
                clearInterval(this.globalInterval);
            }
        });
        // Subscribe to config changes
        this._fuseConfigService.config
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((config) => {

                this.fuseConfig = config;

                // Boxed
                if (this.fuseConfig.layout.width === 'boxed') {
                    this.document.body.classList.add('boxed');
                }
                else {
                    this.document.body.classList.remove('boxed');
                }

                // Color theme - Use normal for loop for IE11 compatibility
                for (let i = 0; i < this.document.body.classList.length; i++) {
                    const className = this.document.body.classList[i];

                    if (className.startsWith('theme-')) {
                        this.document.body.classList.remove(className);
                    }
                }

                this.document.body.classList.add(this.fuseConfig.colorTheme);
            });
    }

    initEventListener() {
        document.body.addEventListener('click', () => this.reset());
        document.body.addEventListener('mouseover', () => this.reset());
        document.body.addEventListener('mouseout', () => this.reset());
        document.body.addEventListener('keydown', () => this.reset());
        document.body.addEventListener('keyup', () => this.reset());
        document.body.addEventListener('keypress', () => this.reset());
    }

    initInterval() {
        this.globalInterval = setInterval(() => {
            this.check();
        }, CHECK_INTERVAL);
    }

    reset() {
        this.setLastAction(Date.now());
    }

    public setLastAction(lastAction: number) {
        localStorage.setItem(STORE_KEY, lastAction.toString());
    }

    public getLastAction() {
        // tslint:disable-next-line: radix
        return parseInt(localStorage.getItem(STORE_KEY));
    }

    check() {
        const now = Date.now();
        const timeleft = this.getLastAction() + MINUTES_UNITL_AUTO_LOGOUT * 60 * 1000;
        const diff = timeleft - now
        const isTimeout = diff < 0;

        if (isTimeout) {
            localStorage.clear();
            this.store.dispatch(new LogOut());
        }
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        this.subsParams.unsubscribe();
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
}
