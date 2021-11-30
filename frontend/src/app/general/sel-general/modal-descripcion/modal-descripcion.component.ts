import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
// import { environment } from 'environments/environment';

export interface SendData {
    title: string;
    unitData: any;
    unitDescription: string;
};

@Component({
    selector: 'modal-descripcion',
    templateUrl: 'modal-descripcion.component.html',
    styleUrls: ['./modal-descripcion.component.scss']
})
export class DialogDescripcion implements OnInit {
    public title: string;
    public idUnidad: number;
    public unitDescription: string;
    public maxLengthTextArea: number = 5000;
    public descriptionAditional = new FormControl('', [Validators.required]);
    public formDescription = new FormGroup({ descriptionAditional: this.descriptionAditional })
    public retornarValores = { idUnidad: 0, description: '' };
    public disabled: boolean = true;

    constructor(private fb: FormBuilder,
        public dialogRef: MatDialogRef<DialogDescripcion>,
        @Inject(MAT_DIALOG_DATA) public data: SendData) {
        this.title = `${data.title} ${data.unitData.numeroSerie}`
        this.idUnidad = data.unitData.idUnidad;
        this.unitDescription = data.unitDescription;
    };

    ngOnInit() {
        this.descriptionAditional.setValue(this.unitDescription);
    };

    public saveDescription = () => {
        this.retornarValores.idUnidad = this.idUnidad;
        this.retornarValores.description = this.formDescription.value.descriptionAditional;
    };

}