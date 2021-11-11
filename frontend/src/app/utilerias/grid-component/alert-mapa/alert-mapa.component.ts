import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'environments/environment';
import { MapsAPILoader } from '@agm/core';
// import { environment } from 'environments/environment';

export interface SendData {
    latitud: number,
    longitud: number
}

@Component({
    selector: 'mapa-dialog',
    templateUrl: 'alert-mapa.component.html',
    styleUrls: ['./alert-mapa.component.scss'],
})

export class DialogMapa implements OnInit {
    spinner = false;
    latitud: number;
    longitud: number;

    retornarValores = [{ confirm: 1, valorSelect: '' }];
    geoCoder: any;
    direccion: any;
    constructor(private fb: FormBuilder,
        public dialogRef: MatDialogRef<DialogMapa>,
        @Inject(MAT_DIALOG_DATA) public data: SendData,
        private mapsAPILoader: MapsAPILoader,
        private httpClient: HttpClient,) {
        this.latitud = data.latitud;
        this.longitud = data.longitud;
    }
    ngOnInit() {
        // this.spinner = true;
        this.mapsAPILoader.load().then(() => {
            // tslint:disable-next-line:new-parens
            this.geoCoder = new google.maps.Geocoder;
            this.GetDireccion();
        });
    }

    GetDireccion() {
        this.geoCoder.geocode({ location: { lat: this.latitud, lng: this.longitud } }, (results, status) => {
            if (status === 'OK') {
                if (results[0]) {
                    this.direccion = results[0].formatted_address;
                } else {
                    console.log('No results found');
                }
            } else {
                console.log('Geocoder failed due to: ' + status);
            }
        });
    }

    changeSelect(valor) {
        // this.retornarValores[0].valorSelect = valor;
    }

}