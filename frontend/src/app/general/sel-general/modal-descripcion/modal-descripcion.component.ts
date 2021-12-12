import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CoalService } from 'app/services/coal.service';
import { environment } from 'environments/environment';
import { ExcepcionesComponent } from '../../../utilerias/excepciones/excepciones.component';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface SendData {
    title: string;
    unitData: any;
    unitDescription: string;
};

@Component({
    selector: 'modal-descripcion',
    templateUrl: 'modal-descripcion.component.html',
    styleUrls: ['./modal-descripcion.component.scss'],
    providers: [CoalService]
})
export class DialogDescripcion implements OnInit {
    public title: string;
    public idUnidad: number;
    public unitDescription: string;
    public maxLengthTextArea: number = 5000;
    public descriptionAditional = new FormControl('', [Validators.required]);
    public formDescription = new FormGroup({ descriptionAditional: this.descriptionAditional })
    public retornarValores = { idUnidad: 0, description: '' };
    public disabled: boolean = false;
    public spinner: boolean = false;
    public existeBPRO: boolean = false;
    public tieneDescripcion: boolean = false;
    public miniumClass: boolean = false;

    constructor(private fb: FormBuilder,
        public dialogRef: MatDialogRef<DialogDescripcion>,
        @Inject(MAT_DIALOG_DATA) public data: SendData,
        private coalService: CoalService,
        public dialog: MatDialog,
        private snackBar: MatSnackBar) {
        this.title = `${data.title} ${data.unitData.numeroSerie}`
        this.idUnidad = data.unitData.idUnidad;
        this.unitDescription = data.unitDescription;
        this.descriptionAditional.setValue(this.unitDescription);
        this.existeBPRO = data.unitData.existeBPRO === 1 ? true : false;
        this.tieneDescripcion = data.unitData.tieneDescripcion === 1 ? true : false;
        this.miniumClass = this.unitDescription.length >= 200 ? false : true;
    };

    ngOnInit() { };

    public editDescription = disable => {
        this.disabled = disable;
    };

    public editDescriptionBpro = disableBpro => {
        this.tieneDescripcion = disableBpro;
    };

    public refreshInitialDescription = () => {
        this.spinner = true;
        const url = `reporte/updAndRefreshUnitDescription?idUnidad=${this.idUnidad}`;
        this.coalService.getService(url).subscribe((res: any) => {
            if (res.err) {
                this.spinner = true;
                this.Excepciones(res.err, 4);
            } else if (res.excepcion) {
                this.spinner = true;
                this.Excepciones(res.excepcion, 3);
            } else {
                if (res.recordsets[0][0].success === 1) {
                    this.unitDescription = res.recordsets[0][0].descripcionUnidad
                    this.descriptionAditional.setValue(this.unitDescription);
                    this.disabled = false;
                    this.spinner = false;
                } else {
                    this.spinner = false;
                    this.snackBar.open(res.recordsets[0][0].msg, 'Ok', { duration: 10000 });
                };
            };
        }, (error: any) => {
            this.spinner = false;
            this.Excepciones(error, 2);
        });
    };

    public saveDescription = () => {
        this.retornarValores.idUnidad = this.idUnidad;
        this.retornarValores.description = this.formDescription.value.descriptionAditional;
    };


    /** Metedos generales*/
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