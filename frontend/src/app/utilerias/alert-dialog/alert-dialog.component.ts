import { Component, OnInit, Inject } from '@angular/core';
import { ExcepcionesComponent } from '../excepciones/excepciones.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { environment } from 'environments/environment';

/**
 * Obtenemos el Mensaje a mostrar
 */
export interface SendData {
  message: string;
}

@Component({
  selector: 'app-alert-dialog',
  templateUrl: './alert-dialog.component.html',
  styleUrls: ['./alert-dialog.component.sass']
})
export class AlertDialogComponent implements OnInit {

  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<AlertDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SendData
  ) {
  }

  ngOnInit() {
  }

  cancelar(): void {
    try {
      this.dialogRef.close();
    } catch (error) {
      this.excepciones(error, 1);
    }
  }

  excepciones(stack, tipoExcepcion: number) {
    try {
      const dialogRef = this.dialog.open(ExcepcionesComponent, {
        width: '60%',
        data: {
          idTipoExcepcion: tipoExcepcion,
          idOperacion: 1,
          idAplicacion: environment.aplicacionesId,
          moduloExcepcion: 'app-alert-dialog',
          mensajeExcepcion: '',
          stack
        }
      });

      dialogRef.afterClosed().subscribe((result: any) => {
      });
    } catch (error) {
      console.error(error);
    }
  }

}
