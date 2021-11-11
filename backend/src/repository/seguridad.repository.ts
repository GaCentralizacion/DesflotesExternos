import { Service } from 'typedi';
import { default as config } from '../config';
import { Query } from '../data/query';
const jsonxml = require('jsontoxml');
import { isArray } from 'util';

@Service()
export class SeguridadRepository {
    private conf: any; // variabel para guardar la configuración
    query: any;

    constructor() {
        const env: string = process.env.NODE_ENV || 'development';
        this.conf = (config as any)[env]; // ejemplo de llamada al confg.js
        this.query = new Query();
    }

    // ************ SERVICIOS GET ************
    

    // ************* TERMINA GET *************

    // ************ SERVICIOS POST ************

    

    // ************* TERMINA POST *************

    // ************ SERVICIOS PUT ************
    // ************* TERMINA PUT *************

    // ************ SERVICIOS DELETE ************
    // ************* TERMINA DELETE *************
}