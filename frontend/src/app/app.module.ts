import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AgmCoreModule } from '@agm/core';

// ******************* FIREBASE **********************
import { AngularFireMessagingModule } from 'angularfire2/messaging';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AsyncPipe } from '../../node_modules/@angular/common';

import { FuseModule } from '../@fuse/fuse.module';
import { FuseSharedModule } from '../@fuse/shared.module';
import { FuseSidebarModule } from '../@fuse/components';

import { fuseConfig } from '../app/fuse-config';

import { AppComponent } from '../app/app.component';

// ***** RUTAS *****
import { AppRoutingModule } from './app-routing.module';

// ******************* @NGRX **********************
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EffectsModule } from '@ngrx/effects';
import { AuthService } from './services/auth.service';
import { AuthEffects } from './store/effects/auth.effects';
import { reducers } from './store/app.states';
import { AuthGuardService } from './services/auth-guard.service';

// ***** UTILERIAS *****
import { GridComponentComponent } from './utilerias/grid-component/grid-component.component';
import { AlertDialogComponent } from './utilerias/alert-dialog/alert-dialog.component';
/********************REDUX *********************/
import { rootReducer, ArchitectUIState } from './themeOptions/store';
import { NgReduxModule } from '@angular-redux/store';
import { NgRedux, DevToolsExtension } from '@angular-redux/store';
import { ConfigActions } from './ThemeOptions/store/config.actions';

// ***** DEVEXTREME *****
import { DevExtremeModule, DxDataGridModule, DxFileUploaderModule, DxCheckBoxModule, DxSelectBoxModule, DxButtonModule, DxDropDownBoxModule, DxAutocompleteModule, DxTemplateModule } from 'devextreme-angular';

// ***** COMPONENTES *****
// HOME
import { HomeComponentComponent } from './home/home-component/home-component.component';

// PROGRESS BAR
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FuseProgressBarComponent } from '../@fuse/components/progress-bar/progress-bar.component';

// LAYOUT-1

import { ContentModule } from '../app/layout/components/content/content.module';
import { FooterModule } from '../app/layout/components/footer/footer.module';
import { NavbarModule } from '../app/layout/components/navbar/navbar.module';
import { QuickPanelModule } from '../app/layout/components/quick-panel/quick-panel.module';
import { ToolbarModule } from '../app/layout/components/toolbar/toolbar.module';

import { VerticalLayout1Component } from './layout/vertical/layout-1/layout-1.component';

// LAYOUT-2
import { VerticalLayout2Component } from './layout/vertical/layout-2/layout-2.component';

// LAYOUT-3
import { VerticalLayout3Component } from './layout/vertical/layout-3/layout-3.component';

// HORIZONTAL-LAYOUT
import { HorizontalLayout1Component } from './layout/horizontal/layout-1/layout-1.component';

// THEME OPTIONS
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FuseDirectivesModule } from '../@fuse/directives/directives';
import { FuseMaterialColorPickerModule } from '../@fuse/components/material-color-picker/material-color-picker.module';
import { FuseThemeOptionsComponent } from '../@fuse/components/theme-options/theme-options.component';

import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';
// PDF
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';

// BOOTSTRAP
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FileUploadComponent } from './utilerias/file-upload/file-upload.component';

// ANGULAR MATERIAL
import { MaterialModule } from './material.module';

// SessionInitializer
import { SessionInitializer } from './services/session-initializer';

/*Interceptor*/

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from './services/token.interceptor';


import { ExcepcionesComponent } from './utilerias/excepciones/excepciones.component';
import { ViewerComponent } from './utilerias/viewer/viewer.component';
import { LoginComponent } from './autenticacion/login/login.component';
import { CoalService } from './services/coal.service';
import { environment } from '../environments/environment';
import { DeleteAlertComponent } from './utilerias/delete-alert/delete-alert.component';
import { SpinnerUtileriaComponent } from './utilerias/spinner-utileria/spinner-utileria.component';
import { CargaMasivaComponent } from './utilerias/carga-masiva/carga-masiva.component';
import { AngularFileUploaderModule } from "angular-file-uploader";

import { FuncionColor } from './utilerias/clases/funcionColor';
import { ExcelService } from './utilerias/carga-masiva/excel.service';
import { SelInventarioComponent } from './inventario/sel-inventario/sel-inventario.component';
import { SelNotificacionesComponent } from './notificaciones/sel-notificaciones/sel-notificaciones.component';
import { SelGeneralComponent } from './general/sel-general/sel-general.component';
import { InsCapturaComponent } from './captura/ins-captura/ins-captura.component';
import { SelReportesComponent } from './reportes/sel-reportes/sel-reportes.component';

/**Modales */
import { DialogMapa } from './utilerias/grid-component/alert-mapa/alert-mapa.component';
import { DialogClient } from './general/sel-general/modal-client/modal-client.component';
import { DialogLiberar } from './general/sel-general/modal-liberar/modal-liberar.component';
import { DialogPrecio } from './general/sel-general/modal-precio/modal-precio.component';
import { DialogDescripcion } from './general/sel-general/modal-descripcion/modal-descripcion.component';
import {DialogErrorFacturacion} from './general/sel-general/modal-errorFacturacion/modal-errorFacturacion.component';

export function sessionInitializerProviderFactory(
    provider: SessionInitializer
) {
    return () => provider.validateLogin();
}


@NgModule({
    declarations: [
        AppComponent,
        HomeComponentComponent,
        GridComponentComponent,
        FuseProgressBarComponent,
        VerticalLayout1Component,
        VerticalLayout2Component,
        VerticalLayout3Component,
        HorizontalLayout1Component,
        FuseThemeOptionsComponent,
        FileUploadComponent,
        ViewerComponent,
        ExcepcionesComponent,
        LoginComponent,
        DeleteAlertComponent,
        SpinnerUtileriaComponent,
        CargaMasivaComponent,
        SelInventarioComponent,
        SelNotificacionesComponent,
        SelGeneralComponent,
        InsCapturaComponent,
        SelReportesComponent,
        AlertDialogComponent,
        DialogMapa,
        DialogClient,
        DialogLiberar,
        DialogPrecio,
        DialogDescripcion,
        DialogErrorFacturacion
    ],
    entryComponents: [
        ExcepcionesComponent,
        DeleteAlertComponent,
        AlertDialogComponent,
        DialogMapa,
        DialogClient,
        DialogLiberar,
        DialogPrecio,
        DialogDescripcion,
        DialogErrorFacturacion
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        HttpClientModule,
        NgReduxModule,
        AngularFileUploaderModule,
        TranslateModule.forRoot(),
        // Google Maps
        AgmCoreModule.forRoot({
            apiKey: 'AIzaSyBOV5YhUsM0c3dKkiXTFVNN0JZhZ4qB7v0',
            libraries: ['places']
        }),
        // Firebase
        AngularFireDatabaseModule,
        AngularFireAuthModule,
        AngularFireMessagingModule,
        AngularFireModule.initializeApp(environment.firebase),
        AngularFirestoreModule.enablePersistence(),

        // Fuse modules
        FuseModule.forRoot(fuseConfig),
        FuseSharedModule,
        FuseSidebarModule,

        // DEVEXTREME
        DevExtremeModule,
        DxDataGridModule,
        DxFileUploaderModule,
        DxCheckBoxModule,
        DxSelectBoxModule,
        DxButtonModule,
        DxDropDownBoxModule,
        DxAutocompleteModule,
        DxTemplateModule,
        DevExtremeModule,
        DxDataGridModule,
        DxFileUploaderModule,
        DxCheckBoxModule,
        DxSelectBoxModule,
        DxDropDownBoxModule,
        DxAutocompleteModule,
        DxTemplateModule,
        // TERMINA DEVEXTREME
        CommonModule,
        ContentModule,
        FooterModule,
        NavbarModule,
        QuickPanelModule,
        ToolbarModule,
        FlexLayoutModule,
        FuseDirectivesModule,
        FuseMaterialColorPickerModule,
        FuseSidebarModule,
        FormsModule,
        ReactiveFormsModule,
        PdfViewerModule,
        NgxExtendedPdfViewerModule,
        MaterialModule,
        NgbModule,
        NgReduxModule,
        AngularFireDatabaseModule,

        StoreModule.forRoot(reducers, {}),
        EffectsModule.forRoot([AuthEffects]),
        StoreDevtoolsModule.instrument({
            maxAge: 25,
            logOnly: environment.production,
        }),
        LoggerModule.forRoot({
            level: NgxLoggerLevel.DEBUG,
            serverLogLevel: NgxLoggerLevel.ERROR,
        }),

    ],
    providers: [
        CoalService,
        AuthService,
        AuthGuardService,
        CurrencyPipe,
        SessionInitializer,
        {
            provide: APP_INITIALIZER,
            useFactory: sessionInitializerProviderFactory,
            deps: [SessionInitializer],
            multi: true,
        },
        { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
        // ConfigActions,
        AsyncPipe,
        FuncionColor,
        ExcelService
    ],
    bootstrap: [
        AppComponent
    ]
})
export class AppModule {
    constructor(
        private ngRedux: NgRedux<ArchitectUIState>,
        private devTool: DevToolsExtension) {

        this.ngRedux.configureStore(
            rootReducer,
            {} as ArchitectUIState,
            [],
            [devTool.isEnabled() ? devTool.enhancer() : f => f]
        );

    }
}
