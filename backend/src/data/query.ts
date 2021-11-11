import * as sql from 'mssql';
import { default as confDB } from './config';
import * as Q from 'q';
import { application } from 'express';
import { global } from 'core-js';


/**
 * @summary En este archivo van todos los metodos referentes a la conoxción con las bases de datos
 * 
 */
export class Query {
    constructor() {
    }

    private dbConnect(callback: Function): Q.IPromise<{}> {
        const env: string = process.env.NODE_ENV || 'development';
        var deferred = Q.defer<any>();
        var dbConn = new sql.ConnectionPool((confDB as any)[env]);
        dbConn.connect()
            .then(() => callback(dbConn, deferred))
            .catch(deferred.reject);

        return deferred.promise;
    }

    public spExecute(params: any, SP: string) {
        return this.dbConnect((dbConn: any, deferred: Q.Deferred<{}>) => {
            var request = new sql.Request(dbConn);

            const KEYS$ = Object.keys(params);
            for (const KEY$ of KEYS$) {
                request.input(`${KEY$}`, params[KEY$]);
            }
            let errSQL = '';
            if (!params.UserId) {
                request.input('idUsuario', global.UserId);
            }
            request.output("err", sql.VarChar(500), errSQL)
            request.execute(SP).then((recordsets: sql.IProcedureResult<any>) => {
                var msj = {
                    error: recordsets.output.err,
                    excepcion: undefined,
                    recordsets: recordsets.recordsets
                }
                dbConn.close();
                deferred.resolve(msj);
            }).catch((err) => {
                var msj = {
                    error: undefined,
                    excepcion: err,
                    recordsets: null
                }

                dbConn.close();
                deferred.reject(msj);
            });
        });
    }

    public spExecuteParam(params: any, SP: string, cb?: Function) {
        return this.dbConnect((dbConn: any, deferred: Q.Deferred<{}>) => {
            var request = new sql.Request(dbConn);
            const KEYS$ = Object.keys(params);
            for (const KEY$ of KEYS$) {
                request.input(`${KEY$}`, params[KEY$]);
            }
            if (!params.UserId) {
                request.input('idUsuario', global.UserId);
            }
            let errSQL = '';
            // request.input('UserId', global.UserId);
            request.output("err", sql.VarChar(500), errSQL)
            request.execute(SP).then((recordsets: sql.IProcedureResult<any>) => {
                var msj = {
                    error: recordsets.output.err,
                    excepcion: undefined,
                    recordsets: recordsets.recordsets
                };

                dbConn.close();
                if (cb) cb(msj);
                else deferred.resolve(msj);
            }).catch((err) => {
                var msj = {
                    error: errSQL,
                    excepcion: err,
                    recordsets: undefined
                };
                dbConn.close();
                if (cb) cb(msj);
                else deferred.reject(msj);
            });
        });
    }

}


