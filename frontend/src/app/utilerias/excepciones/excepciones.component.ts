import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ExcepcionesService } from './excepciones.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NGXLogger } from 'ngx-logger';
import { ExcepcionTipoGlobal } from './excepcionTipoGlobal';
import { Observable } from 'rxjs/Observable';
import { SessionInitializer } from '../../services/session-initializer';

export interface SendData {
  idTipoExcepcion: number;
  idOperacion: number;
  idAplicacion: string;
  moduloExcepcion: string;
  mensajeExcepcion: string;
  stack: any;
}

@Component({
  selector: 'app-excepciones',
  templateUrl: './excepciones.component.html',
  styleUrls: ['./excepciones.component.scss'],
  providers: [ExcepcionesService]
})
export class ExcepcionesComponent implements OnInit {
  public ver = 1;
  tipoMensaje;
  errorMsg;


  constructor(
    private logger: NGXLogger,
    private snackBar: MatSnackBar,
    private _excepcionService: ExcepcionesService,
    public dialogRef: MatDialogRef<ExcepcionesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SendData,
    private sessionInitializer: SessionInitializer
  ) {
    this.errorMsg = data.stack;
    this.tipoMensaje = ExcepcionTipoGlobal.arr[data.idTipoExcepcion];
    this.data.mensajeExcepcion = 'Error de' + this.tipoMensaje;
    if (data.idTipoExcepcion !== 1) {
      this.data.stack = JSON.stringify(this.data.stack, undefined, 2);
    } else {
      // tslint:disable-next-line:no-shadowed-variable
      const h = Object.keys(this.data).map(key => this.data[key]);
      const o = {
        message: h[6]['message'],
        stack: h[6]['stack']
      };
      this.data.stack = JSON.stringify(o, undefined, 2);
    }
    try {
      const err = JSON.parse(this.data.stack);
      if (err.statusText && (err.statusText.toUpperCase() === 'UNAUTHORIZED')) {
        this.dialogRef.close();
        this.snackBar.open(`Tu sesión ha sido finalizada`, `Ok`, {
          duration: 2000
        });
        Observable.timer(1000)
          .subscribe(() => {
            this.sessionInitializer.setStateLogOut();
          });
      }
    } catch{
      this.snackBar.open(`Tu sesión ha sido finalizada`, `Ok`, {
        duration: 2000
      });
      Observable.timer(1000)
        .subscribe(() => {
          this.sessionInitializer.setStateLogOut();
        });
    }
  }

  ngOnInit(): void {
  }

  /*
 Cerramos el Dialog
 */
  cerrar(): void {
    this.dialogRef.close();
  }

  /*
  Formamos la Data y enviamos a la base de datos
  */
  enviar() {
    try {
      const data = {
        idTipoExcepcion: this.data.idTipoExcepcion,
        idOperacion: this.data.idOperacion,
        idAplicacion: this.data.idAplicacion,
        moduloExcepcion: this.data.moduloExcepcion,
        mensajeExcepcion: this.data.mensajeExcepcion,
        stacktraceExcepcion: this.data.stack
      };
      this._excepcionService.postService('excepcion/postInsExcepcion', data).subscribe(
        (res: any) => {
          this.snackBar.open('Ticket levantado', 'Ok', {
            duration: 2000
          });
          this.dialogRef.close();
        },
        (error: any) => {
          this.logger.error(error);
        }
      );
    } catch (err) {
      console.error(err);
    }
  }

  /*
  Abre y oculta el collapse donde esta el error
  */
  cambio() {
    try {
      if (this.ver === 1) {
        this.ver--;
      } else {
        this.ver++;
      }
    } catch (err) {
      console.error(err);
    }
  }


}
