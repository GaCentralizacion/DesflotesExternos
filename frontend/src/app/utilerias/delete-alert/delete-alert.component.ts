import { Component, OnInit, Inject } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA
} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NGXLogger } from 'ngx-logger';
import { CoalService } from '../../services/coal.service';
import { ExcepcionesComponent } from '../excepciones/excepciones.component';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

/*
Obtenemos la tada que nos manda el componente padre al Dialog
*/
export interface SendData {
  usuario?: boolean,
  ruta: any;
  data: any;
}

@Component({
  selector: 'app-delete-alert',
  templateUrl: './delete-alert.component.html',
  styleUrls: ['./delete-alert.component.scss'],
  providers: [CoalService]
})
export class DeleteAlertComponent implements OnInit {
  public numero = 1;
  headers: HttpHeaders
  constructor(
    public dialog: MatDialog,
    private logger: NGXLogger,
    private snackBar: MatSnackBar,
    private coalService: CoalService,
    private httpClient: HttpClient,
    public dialogRef: MatDialogRef<DeleteAlertComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SendData
  ) {
  }

  ngOnInit() { }

  /*
  Validamos que la data sea correcta con su ruta para eliminarla
  */
  eliminar() {
    try {
      this.numero = 0;
      if (this.data.usuario) {
        this.headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        this.httpClient.delete(environment.seguridadUrl + this.data.ruta + '?' + this.data.data, { headers: this.headers }).subscribe((res: any) => {
          if (res.err) {
            this.numero = 1;
            this.excepciones(res.err, 4);
          } else if (res.excepcion) {
            this.numero = 1;
            this.excepciones(res.excepcion, 3);
          } else {
            if (res.error) {
              this.numero = 1;
              this.dialogRef.close(1);
              this.snackBar.open(res.error, "Ok", {
                duration: 2000
              });
            } else {

              this.numero = 1;
              this.dialogRef.close(1);
              this.snackBar.open("Eliminado exitosamente.", "Ok", {
                duration: 2000
              });
            }
          }
        },
          (error: any) => {
            this.numero = 1;
            this.excepciones(error, 2);
          })
      } else {
        this.coalService
          .deleteService(this.data.ruta, this.data.data)
          .subscribe(
            (res: any) => {
              if (res.err) {
                this.numero = 1;
                this.excepciones(res.err, 4);
              } else if (res.excepcion) {
                this.numero = 1;
                this.excepciones(res.excepcion, 3);
              } else {
                if (res.error.length > 0) {
                  this.numero = 1;
                  this.dialogRef.close(1);
                  this.snackBar.open(res.error, "Ok", {
                    duration: 2000
                  });
                } else {

                  this.numero = 1;
                  this.dialogRef.close(1);
                  this.snackBar.open("Eliminado exitosamente.", "Ok", {
                    duration: 2000
                  });
                }
              }
            },
            (error: any) => {
              this.numero = 1;
              this.excepciones(error, 2);
            }
          );
      }
    } catch (error) {
      this.excepciones(error, 1);
    }
  }

  /*
  Si cancelan se cierra el Dialog
  */
  cancelar(): void {
    try {
      this.dialogRef.close();
    } catch (error) {
      this.excepciones(error, 1);
    }
  }

  /*
  En caso de que algun metodo, consulta a la base de datos o conexión con el servidor falle, se abrira el dialog de excepciones
  */
  excepciones(stack, tipoExcepcion: number) {
    try {
      const dialogRef = this.dialog.open(ExcepcionesComponent, {
        width: '60%',
        data: {
          idTipoExcepcion: tipoExcepcion,
          idOperacion: 1,
          idAplicacion: environment.aplicacionesId,
          moduloExcepcion: 'app-delete-alert',
          mensajeExcepcion: '',
          stack: stack
        }
      });

      dialogRef.afterClosed().subscribe((result: any) => {
        this.numero = 1;
      });
    } catch (error) {
      this.numero = 1;
      console.error(error);
    }
  }
}
