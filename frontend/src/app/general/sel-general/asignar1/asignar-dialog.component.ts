import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
// import { environment } from 'environments/environment';

export interface SendData {
    select: string;
    title: string;
    elementos: string;
  }

@Component({
    selector: 'asignar-dialog',
    templateUrl: 'asignar-dialog.component.html'
})
export class DialogAsignar implements OnInit {
    spinner = false;
    select: string;
    titulo: string;
    elementos: string;
    form = new FormGroup({
        idDuenoUnidad: new FormControl('', [Validators.required]),
    });
    retornarValores = [{ confirm: 1, valorSelect: '' }];
    constructor(private fb: FormBuilder,
        public dialogRef: MatDialogRef<DialogAsignar>,
        @Inject(MAT_DIALOG_DATA) public data: SendData) {
        this.select = data.select;
        this.titulo = data.title;
        this.elementos = data.elementos;
    }
    ngOnInit() {
        this.spinner = true;
    }
    changeSelect(valor) {
        this.retornarValores[0].valorSelect = valor;
    }

}