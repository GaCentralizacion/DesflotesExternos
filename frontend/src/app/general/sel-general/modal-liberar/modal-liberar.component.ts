import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CoalService } from 'app/services/coal.service';
import { ExcepcionesComponent } from '../../../utilerias/excepciones/excepciones.component';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface SendData {
    title: string;
    subTitle: string;
    elementos: string;
    unidades: any;
};

@Component({
    selector: 'modal-liberar',
    templateUrl: 'modal-liberar.component.html',
    styleUrls: ['./modal-liberar.component.scss'],
    providers: [CoalService]
})
export class DialogLiberar implements OnInit {
    spinner = false;
    subTitle: string;
    titulo: string;
    elementos: string;
    vines: string = '';

    constructor(
        private fb: FormBuilder,
        public dialogRef: MatDialogRef<DialogLiberar>,
        @Inject(MAT_DIALOG_DATA) public data: SendData,
        private coalService: CoalService,
        public dialog: MatDialog,
        private snackBar: MatSnackBar) {

        //this.select = data.select;
        this.titulo = data.title;
        this.elementos = data.elementos;
        this.subTitle = data.subTitle;

        data.unidades.forEach((value, index) => {
            if (data.unidades.length === index + 1) {
                this.vines += `${value.numeroSerie}`;
            } else {
                this.vines += `${value.numeroSerie}, `;
            };
        });
    };

    ngOnInit() {
    };

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