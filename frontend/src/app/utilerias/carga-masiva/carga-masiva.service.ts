import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class CargaMasivaService {
    url: string;
    headers: HttpHeaders;
    constructor(private http: HttpClient) {
        this.headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        this.url = environment.serviceUrl;
    }

    postService(ruta: string, body?: any, headers?: HttpHeaders) {
        if (headers) { this.headers = headers; }
        return this.http.post(this.url + ruta, body, { headers: this.headers });
    }
}
