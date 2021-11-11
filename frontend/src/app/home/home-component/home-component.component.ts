import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AppState, selectPermisosState } from '../../store/app.states';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { SessionInitializer } from '../../services/session-initializer';
import { Router } from '@angular/router';
import { CoalService } from '../../services/coal.service';
import { BaseService } from '../../services/base.service';
import { ExcepcionesComponent } from 'app/utilerias/excepciones/excepciones.component';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-home-component',
  templateUrl: './home-component.component.html',
  styleUrls: ['./home-component.component.scss']
})
export class HomeComponentComponent implements OnInit {
  getStateNegocio: Observable<any>;
  objSeguridad: any[];
  modulo;


  constructor(
    private snackBar: MatSnackBar,
    private store: Store<AppState>
    , private sessionInitializer: SessionInitializer
    , private router: Router
    , private coalService: CoalService
    , private baseService: BaseService
    , public dialog: MatDialog,
  ) {

  }

  ngOnInit(): void {
    if (this.sessionInitializer.state) {

      this.objSeguridad = [];
      let objSeguridadTmo = [];
      objSeguridadTmo = this.baseService.getSecurityData().modulos;

      if (objSeguridadTmo.length > 0) {
        objSeguridadTmo.forEach((ob: any) => {
          if (ob.caption && typeof ob.caption !== 'object' && ob.caption !== null) {
            ob.caption = JSON.parse(ob.caption)
          }
          if (ob.caption.datos) {
            this.objSeguridad.push(ob);
          }
        });
      }

    } else {
      this.snackBar.open(`Tu sesión ha sido finalizada`, `Ok`, {
        duration: 2000
      });
      this.router.navigate(['login']);
    }

  }

  ErrorExcepcion() {
    this.coalService.getService('noexiste').subscribe(
      (res) => {

      }, (error) => {
        this.Excepciones(error, 2);
      }
    )
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
          moduloExcepcion: 'home',
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
