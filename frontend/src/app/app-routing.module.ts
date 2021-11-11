import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponentComponent } from './home/home-component/home-component.component';

import { LoginComponent } from './autenticacion/login/login.component';
import { AuthGuardService } from './services/auth-guard.service';

import {SelInventarioComponent} from './inventario/sel-inventario/sel-inventario.component';
import {SelNotificacionesComponent} from './notificaciones/sel-notificaciones/sel-notificaciones.component';
import {SelGeneralComponent} from './general/sel-general/sel-general.component';
import {InsCapturaComponent} from './captura/ins-captura/ins-captura.component';
import{SelReportesComponent} from './reportes/sel-reportes/sel-reportes.component';
import { from } from 'rxjs';

const routes: Routes = [
    { path: 'home', component: SelGeneralComponent, canActivate: [AuthGuardService] },
    { path: 'login', component: LoginComponent },
    { path: 'login/:usuarioBpro', component: LoginComponent },


    /*****************************************RUTAS DE CONTROL DESFLOTE **************************/
    { path: 'sel-inventario', component: SelInventarioComponent },
    { path: 'sel-notificaciones', component: SelNotificacionesComponent },
    { path: 'sel-general', component: SelGeneralComponent },
    { path: 'ins-captura', component: InsCapturaComponent },
    { path: 'sel-reporte', component: SelReportesComponent },
    { path: '**', component: SelGeneralComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes,
      {
        scrollPositionRestoration: 'enabled',
        anchorScrolling: 'enabled',
      })],
    exports: [RouterModule]
  })
  export class AppRoutingModule {
  }
