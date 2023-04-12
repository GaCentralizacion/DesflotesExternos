import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CoalService } from 'app/services/coal.service';
import { ExcepcionesComponent } from '../../../utilerias/excepciones/excepciones.component';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
// import { environment } from 'environments/environment';

export interface SendData {
    title: string;
    elementos: string;
    unidades: any;
};

@Component({
    selector: 'modal-formaPago',
    templateUrl: 'modal-formaPago.component.html',
    styleUrls: ['./modal-formaPago.component.scss'],
	providers: [CoalService]
})
export class DialogFormaPago implements OnInit {
    spinner = false;
    titulo: string;
    elementos: string;
    unidades: any;
    formasPago:any;
    formFormasDePago: FormGroup;
    retornarValores = { valorSelect: '' };

    constructor(private fb: FormBuilder,
        public dialogRef: MatDialogRef<DialogFormaPago>,
        @Inject(MAT_DIALOG_DATA) public data: SendData,
		private coalService: CoalService,
		public dialog: MatDialog,
		private snackBar: MatSnackBar) {
        this.titulo = data.title;
        this.elementos = data.elementos;
        this.unidades = data.unidades;
    };

    ngOnInit() {
        this.formFormasDePago = this.fb.group({
            valorFormaPago: ['', Validators.required],
        });
        this.getFormasPago();
    };

    getFormasPago = () =>{
        this.coalService.postService('reporte/getFormasPago', {}).subscribe((res : any)=>{
            if (res.err) {
				this.Excepciones(res.err, 4);
			} else if (res.excepcion) {
				this.Excepciones(res.excepcion, 3);
			} else {
				this.spinner = false;
				if (res.recordsets[0].length > 0) {
                    this.formasPago = res.recordsets[0];
				} else {
					this.snackBar.open('No se encontraton formas de pago, favor de contactar al administrador', 'Ok', { duration: 10000 });
				};
			};
        }, (error: any) => {
			this.Excepciones(error, 2);
		});
    };

    updFormaPago() {
        this.retornarValores.valorSelect = this.formFormasDePago.controls.valorFormaPago.value;
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
	};

}