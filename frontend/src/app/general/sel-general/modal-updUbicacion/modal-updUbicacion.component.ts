import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
// import { environment } from 'environments/environment';

export interface SendData {
    unidades: any;
    select: string;
    title: string;
    elementos: string;
  }

@Component({
    selector: 'modal-updUbicacion',
    templateUrl: 'modal-updUbicacion.component.html'
})
export class DialogUpdUbicacion implements OnInit {
    spinner = false;
    select: string;
    titulo: string;
    elementos: string;
    form = new FormGroup({
        ubicacion: new FormControl('', [Validators.required,Validators.maxLength(99)])
    });
    retornarValores = [{ confirm: 1, valorUbicacion:'' }];
    marca: any;
    modelo: any;
    carline: any;
    constructor(private fb: FormBuilder,
        public dialogRef: MatDialogRef<DialogUpdUbicacion>,
        @Inject(MAT_DIALOG_DATA) public data: SendData) {
        this.select = data.select;
        this.titulo = data.title;
        this.elementos = data.elementos;
        this.marca = data.unidades[0]?.marca;
        this.modelo = data.unidades[0]?.modelo;
        this.carline = data.unidades[0]?.carline;
    }
    ngOnInit() {
        this.spinner = true;
    }
    precio() {
        this.retornarValores[0].valorUbicacion = this.form.value.ubicacion;
    }

}