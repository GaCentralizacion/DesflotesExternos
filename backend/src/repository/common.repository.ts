import { Service } from 'typedi';
import { default as config } from '../config';
import { Query } from '../data/query';
const jsonxml = require('jsontoxml');
import { isArray } from 'util';

@Service()
export class CommonRepository {
    private conf: any; // variabel para guardar la configuración
    query: any;

    constructor() {
        const env: string = process.env.NODE_ENV || 'development';
        this.conf = (config as any)[env]; // ejemplo de llamada al confg.js
        this.query = new Query();
    }

    // ************ SERVICIOS GET ************

    getMapeoDocumentos(query: any): PromiseLike<{}> {
        return this.query.spExecute(query, "[Relacion].[SEL_DOCSISCOEXPEDIENTE_SP]")
    }

    getEstados(query: any): PromiseLike<{}> {
        return this.query.spExecute(query, "[Catalogo].[SEL_ESTADO_SP]")
    }

    getAccion(query: any): PromiseLike<{}> {
        return this.query.spExecute(query, "[Catalogo].[SEL_ACCION_SP]")
    }

    getCondicion(query: any): PromiseLike<{}> {
        return this.query.spExecute(query, "[Catalogo].[SEL_CONDICION_SP]")
    }

    getCompaniaUnidad(query: any): PromiseLike<{}> {
        return this.query.spExecute(query, "[catalogo].[SEL_COMPANIAUNIDAD_SP]")
    }

    GetObjetoColumnsBase(query: any): PromiseLike<{}> {
        return this.query.spExecute(query, "[Catalogo].[SEL_COLUMNA_SP]")
    }

    getEstado(query: any): PromiseLike<{}> {
        return this.query.spExecute(query, "[Catalogo].[SEL_ESTADOUNIDAD_SP]")
    }

    getCompaniaSucursal(query: any): PromiseLike<{}> {
        return this.query.spExecute(query, "[Catalogo].[SEL_COMPANIA_SP]")
    }

    getDesflote(query: any): PromiseLike<{}> {
        return this.query.spExecute(query, "[Catalogo].[SEL_DESFLOTE_SP]")
    }

    getusuarioCentralizacion(query: any): PromiseLike<{}> {
        return this.query.spExecute(query, "[Catalogo].[SEL_DATOSUSUARIO_BPRO_SP]")
    }

    getClientes(query: any): PromiseLike<{}> {
        return this.query.spExecute(query, "[Reporte].[SEL_ALL_CLIENTES_SP]")
    }
    // ************* TERMINA GET *************

    // ************ SERVICIOS POST ************



    // ************* TERMINA POST *************

    // ************ SERVICIOS PUT ************
    // ************* TERMINA PUT *************

    // ************ SERVICIOS DELETE ************
    // ************* TERMINA DELETE *************
}