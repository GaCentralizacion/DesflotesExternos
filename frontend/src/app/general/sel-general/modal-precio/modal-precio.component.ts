import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
// import { environment } from 'environments/environment';

export interface SendData {
    title: string;
    elementos: string;
    unidades: any;
};

@Component({
    selector: 'modal-precio',
    templateUrl: 'modal-precio.component.html',
    styleUrls: ['./modal-precio.component.scss']
})
export class DialogPrecio implements OnInit {
    spinner = false;
    titulo: string;
    elementos: string;
    unidades: any;
    formPrecio = new FormControl('', [Validators.required])
    form = new FormGroup({ precio: this.formPrecio });
    retornarValores = { valorSelect: '' };

    constructor(private fb: FormBuilder,
        public dialogRef: MatDialogRef<DialogPrecio>,
        @Inject(MAT_DIALOG_DATA) public data: SendData) {
        this.titulo = data.title;
        this.elementos = data.elementos;
        this.unidades = data.unidades;

        if (this.unidades.length === 1) {
            this.formPrecio.setValue(this.unidades[0].precioVentaIva);
        };
    };
    ngOnInit() {
        this.spinner = true;
    }
    precio() {
        this.retornarValores.valorSelect = this.form.value.precio;
    }

}