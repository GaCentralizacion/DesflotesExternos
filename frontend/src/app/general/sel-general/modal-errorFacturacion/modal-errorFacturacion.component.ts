import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CoalService } from 'app/services/coal.service';

export interface SendData {
    title: string;
    errorFactura: string;
};

@Component({
    selector: 'modal-errorFacturacion',
    templateUrl: 'modal-errorFacturacion.component.html',
    styleUrls: ['./modal-errorFacturacion.component.scss'],
    providers: [CoalService]
})
export class DialogErrorFacturacion implements OnInit {
    public title: string;
    public errorFactura: string;
    public spinner: boolean = false;

    constructor(private fb: FormBuilder,
        public dialogRef: MatDialogRef<DialogErrorFacturacion>,
        @Inject(MAT_DIALOG_DATA) public data: SendData,
        public dialog: MatDialog) {
        
        this.title = data.title;
        this.errorFactura = data.errorFactura;
    };

    ngOnInit() { };

}