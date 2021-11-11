import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CoalService } from '../../../services/coal.service';
// import { environment } from 'environments/environment';

export interface SendData {
    select: string;
    marca: string;
}

@Component({
    selector: 'dialog-modelo-version',
    templateUrl: 'modelo-version.component.html'
})
export class DialogModeloVersion implements OnInit {
    spinner = false;
    select: string;
    marca: string;
    catalogoVersion: any = [];

    form = new FormGroup({
        idDuenoUnidad: new FormControl('', [Validators.required]),
    });
    retornarValores = [{ confirm: 1, valorSelect: '', valorVersion:''}];
    constructor(private fb: FormBuilder,
        private coalService: CoalService,
        public dialogRef: MatDialogRef<DialogModeloVersion>,
        @Inject(MAT_DIALOG_DATA) public data: SendData) {
        this.select = data.select;
        this.marca = data.marca;

    }
    ngOnInit() {
        // this.spinner = true;

    }
    changeSelect(valor) {
        this.catalogoVersion.length = 0;
        this.coalService.getService(`reporte/getVersionIntelimotors?idmarca=${this.marca}&idModelo=${valor}`).subscribe(
            (res: any) => {
                if (res.err) {
                    //   this.Excepciones(res.err, 4);
                } else if (res.excepcion) {
                    //   this.Excepciones(res.excepcion, 3);
                } else {
                    this.catalogoVersion = res.recordsets[0];
                }
            }, (error: any) => {
                // this.Excepciones(error, 2);
            }
        );
        this.retornarValores[0].valorSelect = valor;
    }
    changeVersion(valor){
        this.retornarValores[0].valorVersion = valor;
    }

}