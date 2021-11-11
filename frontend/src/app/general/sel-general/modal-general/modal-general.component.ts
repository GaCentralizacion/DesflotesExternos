import { Component, OnInit, Inject } from '@angular/core';
import { ExcepcionesComponent } from '../../../utilerias/excepciones/excepciones.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { environment } from 'environments/environment';
import { AlertDialogComponent } from 'app/utilerias/alert-dialog/alert-dialog.component';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CoalService } from 'app/services/coal.service';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { AppDateAdapter, APP_DATE_FORMATS } from '../../../models/formato-fecha-datepicker';

/**
 * Obtenemos el Mensaje a mostrar
 */
export interface SendData {
  vin: string
}

@Component({
  selector: 'app-modal-general',
  templateUrl: './modal-general.component.html',
  styleUrls: ['./modal-general.component.sass'],
  providers: [CoalService, { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS }]
})
export class ModalGeneralComponent implements OnInit {

  generalForm = new FormGroup({
    // marca: new FormControl('', [Validators.required]),
    accion: new FormControl(''),
    condiciones: new FormControl(''),
    entidadEmplacamiento: new FormControl(''),
    unidadEntregadaTexcoco: new FormControl(''),
    columna1: new FormControl(''),
    expedientes: new FormControl(''),
    bajaPlacas: new FormControl(''),
    entregadaAgencia: new FormControl(''),
    nombreRecibio: new FormControl(''),
    fechaEntrega: new FormControl(''),
  })
  estados: any;
  acciones: any;
  condiciones: any;

  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<AlertDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SendData,
    private coalService: CoalService,
  ) {
  }

  ngOnInit() {
    this.GetEstados();
    this.GetAccion();
    this.GetCondicion();
  }

  GetEstados() {
    this.coalService.getService(`common/getEstados`).subscribe(
      (res: any) => {
        if (res.err) {
          this.Excepciones(res.err, 4);
        } else if (res.excepcion) {
          this.Excepciones(res.excepcion, 3);
        } else {
          this.estados = res.recordsets[0];
        }
      }, (error: any) => {
        this.Excepciones(error, 2);
      }
    );
  }

  GetAccion() {
    this.coalService.getService(`common/getAccion`).subscribe(
      (res: any) => {
        if (res.err) {
          this.Excepciones(res.err, 4);
        } else if (res.excepcion) {
          this.Excepciones(res.excepcion, 3);
        } else {
          this.acciones = res.recordsets[0];
        }
      }, (error: any) => {
        this.Excepciones(error, 2);
      }
    );
  }

  GetCondicion() {
    this.coalService.getService(`common/getCondicion`).subscribe(
      (res: any) => {
        if (res.err) {
          this.Excepciones(res.err, 4);
        } else if (res.excepcion) {
          this.Excepciones(res.excepcion, 3);
        } else {
          this.condiciones = res.recordsets[0];
        }
      }, (error: any) => {
        this.Excepciones(error, 2);
      }
    );
  }

  Cancelar(): void {
    try {
      this.dialogRef.close();
    } catch (error) {
      this.Excepciones(error, 1);
    }
  }

  Excepciones(stack, tipoExcepcion: number) {
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
