import { Service } from 'typedi';
import { default as config } from '../config';
import { Query } from '../data/query';
import { isArray } from 'util';
import { async } from 'q';
import * as requestPost from 'request';
import { CommonRepository } from './common.repository';
import { createExpressServer, JsonController, Get, NotFoundError } from "routing-controllers";
import { resolve } from 'core-js/fn/promise';
import { reject } from 'lodash';
const pdf2base64 = require('pdf-to-base64');
const base64 = require('base64topdf');
let fs = require('fs');
const jsonxml = require('jsontoxml');
const ftp = require("basic-ftp")
const ncp = require('ncp').ncp;
const cron = require('node-cron')
const soap = require('soap');

@Service()
export class DesfloteReporteRepository {
    private conf: any; // variabel para guardar la configuración
    query: any;

    constructor(private common: CommonRepository) {
        const env: string = process.env.NODE_ENV || 'development';
        this.conf = (config as any)[env]; // ejemplo de llamada al confg.js
        this.query = new Query();
        // if (process.env.RUN_TASKS === "true" || process.env.RUN_TASKS === "1") {
        // console.log("cron")

        // cron.schedule('*/2 * * * *', () => {
        //     this.getUnidadesSubirIntelimotor({})
        //         .then((res: any) => {
        //             if (res.recordsets[0]?.length > 0) {
        //                 resolve(
        //                     this.procesaInsertIntelimotor(res.recordsets[0])
        //                 );
        //             } else {
        //                 // console.log('no crea nada')
        //             }
        //         })
        // })

        // cron.schedule('*/2 * * * *', () => {
        //     this.GetUnidadesOrdenCompra({ tipo: 'PRIMERA' })
        //         .then((res: any) => {
        //             // this.GeneraDatosOrden(1, 'PRIMERA')
        //             if (res.recordsets[0].length > 0) {
        //                 this.GeneraDatosOrden(res.recordsets[0], 'PRIMERA')
        //             } else {
        //                 // console.log('no crea nada')
        //             }
        //         })


        //     this.GetUnidadesOrdenCompra({ tipo: 'SEGUNDA' })
        //         .then((res: any) => {
        //             // this.GeneraDatosOrden(1, 'PRIMERA')
        //             if (res.recordsets[0].length > 0) {
        //                 this.GeneraDatosOrden(res.recordsets[0], 'SEGUNDA')
        //             } else {
        //                 // console.log('no crea nada')
        //             }
        //         })
        // })

        // cron.schedule('*/3 * * * *', () => {
        //     this.GetFacturasSubir({ tipo: 'PRIMERA' })
        //         .then((res: any) => {
        //             const resultado = res.recordsets[0]
        //             this.PostSubeDocumentosFactura(resultado)
        //                 .then((result: any) => {
        //                     console.log('resultadooooooo =================     ', result)
        //                     const unidadesCorrectas = result.filter((x: any) => x.validacion === true);
        //                     if (unidadesCorrectas.length > 0) {
        //                         let xmlUnidades = `<unidades>`;
        //                         for (const e of unidadesCorrectas) {
        //                             xmlUnidades += `<unidad><idUnidad>${e.idUnidad}</idUnidad></unidad>`
        //                         }
        //                         xmlUnidades += `</unidades>`
        //                         const datos = {
        //                             xmlUnidades,
        //                             tipo: 'PRIMERA'
        //                         }
        //                         this.PostActualizaBanderaFactura(datos);
        //                     }
        //                 });
        //         })

        //     this.GetFacturasSubir({ tipo: 'SEGUNDA' })
        //         .then((res: any) => {
        //             const resultado = res.recordsets[0]
        //             this.PostSubeDocumentosFactura(resultado)
        //                 .then((result: any) => {
        //                     console.log('resultadooooooo =================     ', result)
        //                     const unidadesCorrectas = result.filter((x: any) => x.validacion === true);
        //                     if (unidadesCorrectas.length > 0) {
        //                         let xmlUnidades = `<unidades>`;
        //                         for (const e of unidadesCorrectas) {
        //                             xmlUnidades += `<unidad><idUnidad>${e.idUnidad}</idUnidad></unidad>`
        //                         }
        //                         xmlUnidades += `</unidades>`
        //                         const datos = {
        //                             xmlUnidades,
        //                             tipo: 'SEGUNDA'
        //                         }
        //                         this.PostActualizaBanderaFactura(datos);
        //                     }
        //                 });
        //         })
        // })
        // }
    }

    // ************ SERVICIOS GET ************
    GetDataReport(query: any): PromiseLike<{}> {
        let sp = "[desfloteExterno].[SEL_DATA_DESFLOTES_SP]";
        return this.query.spExecute(query, sp);
    }


    porcentajeAvances(query: any): PromiseLike<{}> {
        let sp = "[Reporte].[SEL_PORCENTAJE_AVANCE_SP]";
        return this.query.spExecute(query, sp);
    }

    reporteGeneral(query: any): PromiseLike<{}> {
        let sp = "[Reporte].[SEL_REPORTEGENERAL_SP]";
        return this.query.spExecute(query, sp);
    }

    getUnidadesProcesadas(query: any): PromiseLike<{}> {
        let sp = "[Reporte].[SEL_PROCESADAS_SP]";
        return this.query.spExecute(query, sp);
    }

    GetDataInventario(query: any): PromiseLike<{}> {
        let sp = "[Reporte].[SEL_INVENTARIO_SP]";
        return this.query.spExecute(query, sp);
    }

    GetUnidadesOrdenCompra(query: any): PromiseLike<{}> {
        return this.query.spExecute(query, "[Reporte].[SEL_UNIDADES_TO_ORDENCOMPRA_SP]")
    }

    GetFacturasSubir(query: any): PromiseLike<{}> {
        return this.query.spExecute(query, "[Reporte].[SEL_FACTURAS_SUBIR_SP]")
    }

    GetPosicionVehiculo(query: any): PromiseLike<{}> {
        return this.query.spExecute(query, "[Reporte].[SEL_GPS_SP]")
    }

    // ************* TERMINA GET *************

    // ************ SERVICIOS POST ************

    ObtenerFactura(body: any): any {
        return new Promise((resolve, reject) => {
            try {
                const args = { RFCEMISOR: body.rfcEmisor, RFCRECEPTOR: body.rfcReceptor, SERIE: body.serie, FOLIO: body.folio };
                soap.createClient(config.development.WSInvoce, function (err: any, client: any) {
                    if (err) {
                        console.error('ErorrSOAP', err);
                        reject({ success: 0, data: [] });
                    } else {
                        client.MuestraFactura(args, function (err: any, response: any) {
                            if (err) reject({ success: 0, data: [] });
                            else {
                                resolve({ success: 1, data: response });
                            };
                        });
                    };
                });
            } catch (error) {
                reject({ success: 0, data: [] });
            };
        });
    };

    PostComprobantePago(body: any): any {
        let folioOrden = body.folioOrden;
        return new Promise((resolve, reject) => {
            const soap = require('soap');
            const url = 'http://192.168.20.89:8091/WS_Gen_Pdf.asmx?WSDL';
            const args = { Tipo: 'PAC', Documento: folioOrden, Nodo: 14 };
            soap.createClient(url, function (err: any, client: any) {
                if (err) console.error(err);
                else {
                    client.GenerarPdfArray(args, function (err: any, response: any) {
                        if (err) reject(err);
                        else {
                            let res = { recordsets: [[{ documento: '' }]] }
                            res.recordsets[0][0].documento = response.GenerarPdfArrayResult.base64Binary;
                            resolve(res)
                        }
                    })
                }
            });
        })
    }


    PostBuscaSegundaFactura(body: any): any {
        const http = require("http");
        let url = body.url;
        return new Promise((resolve, reject) => {
            let file = fs.createWriteStream(`factura.pdf`);
            http.get(url, (response: any) => {
                var stream = response.pipe(file);
                stream.on("finish", () => {
                    if (!fs.existsSync(`factura.pdf`)) {
                        resolve({ documento: 0 })
                    } else {
                        pdf2base64("factura.pdf")
                            .then(
                                (respuesta: any) => {
                                    fs.unlink('factura.pdf', (err: any) => {
                                        if (err) throw err;
                                    });
                                    resolve({ documento: respuesta })
                                }
                            )
                            .catch(
                                (error: any) => {
                                    console.log(error); //Exepection error....
                                }
                            )
                    }

                });
            })
        });
    }

    PostRegistroExternos(body: any): any {
        let propiedades: any = [];
        let idCompania: number;
        idCompania = body.idCompania;
        body.UnidadesExternas.forEach((prop: any) => {
            propiedades.push({
                propiedad: {
                    numeroSerie: prop.numeroSerie,
                    desflote: prop.desflote,
                    marca: prop.marca,
                    submarca: prop.submarca,
                    modelo: prop.modelo,
                    accion: prop.accion === undefined ? "Sin Accion" : prop.accion,

                }
            })
        });
        var xml = jsonxml({ propiedades: propiedades });
        return new Promise((resolve, reject) => {
            resolve(this.query.spExecuteParam({
                idCompania: idCompania,
                xmlUnidadesExternas: xml,
            }
                , "[Reporte].[INS_UNIDADEXTERNAXML_SP]"));
        });
    }

    InsDocumentosExpedienteSegundaAsignacion(body: any): any {
        let propiedades: any = [];
        let idCompaniaAnterior: number;
        let idSucursalAnterior: number;
        let idCompaniaDestino: number;
        let idSucursalDestino: number;
        // idCompania = body.idCompania;
        // idSucursal = body.idSucursal;

        body.forEach((prop: any) => {
            idCompaniaAnterior = prop.idCompaniaAnterior;
            idSucursalAnterior = prop.idSucursalAnterior;
            idCompaniaDestino = prop.idCompania;
            idSucursalDestino = prop.idSucursal;
            propiedades.push({
                propiedad: {
                    numeroSerie: prop.numeroSerie,
                    idCompaniaAnterior: idCompaniaAnterior,
                    idSucursalAnterior: idSucursalAnterior,
                    idCompaniaDestino: idCompaniaDestino,
                    idSucursalDestino: idSucursalDestino,
                    factura: prop.facturacion

                }
            })
        });
        var xml = jsonxml({ propiedades: propiedades });
        return new Promise((resolve, reject) => {
            this.query.spExecuteParam({ xmlVIN: xml, }, "[Reporte].[INS_DOCUMENTOEXPEDIENTEASIGNACIONDOS_SP]").then(
                (res: any) => {
                    resolve(this.ClonarExpediente(res.recordsets[0]));
                }
            ).catch((error: any) => {
                reject(error);
            });

        });
    }

    ClonarExpediente(body: any): any {
        let ArregloDocumentos: any = [];
        const https = require("http");
        ArregloDocumentos = body;
        let nombreDocumentoOrigen;
        return new Promise((resolve, reject) => {
            ArregloDocumentos.forEach((x: any) => {
                if (x.id_documento === 6 || x.id_documento === 7) {
                    nombreDocumentoOrigen = x.factura;
                } else {
                    nombreDocumentoOrigen = x.nombreDocumento;
                }
                if (x.id_documento === 6) {
                    if (!fs.existsSync(`${x.rutaActual}`)) {
                        fs.mkdirSync(`${x.rutaActual}`, { recursive: true }, (err: any) => {
                            console.log(err)
                        });
                        let file = fs.createWriteStream(`${x.rutaActual}${x.nombreDocumento}`);
                        https.get(`${x.rutaAnterior}${nombreDocumentoOrigen}`, (response: any) => {
                            var stream = response.pipe(file);
                            stream.on("finish", () => {
                                console.log("done");

                            });
                        })
                    } else {
                        let file = fs.createWriteStream(`${x.rutaActual}${x.nombreDocumento}`);
                        https.get(`${x.rutaAnterior}${nombreDocumentoOrigen}`, (response: any) => {
                            var stream = response.pipe(file);
                            stream.on("finish", () => {
                                console.log("done");

                            });
                        })
                    }
                } else {
                    if (!fs.existsSync(`${x.rutaActual}`)) {
                        fs.mkdirSync(`${x.rutaActual}`, { recursive: true }, (err: any) => {
                            console.log(err)
                        });
                        ncp(`${x.rutaAnterior}${nombreDocumentoOrigen}`, `${x.rutaActual}${x.nombreDocumento}`,
                            (err: any) => {
                                if (err) {
                                    return console.error(err);
                                }
                                resolve('Documentos copiados')
                            });
                    } else {
                        ncp(`${x.rutaAnterior}${nombreDocumentoOrigen}`, `${x.rutaActual}${x.nombreDocumento}`,
                            (err: any) => {
                                if (err) {
                                    return console.error(err);
                                }
                                resolve('Documentos copiados')
                            });

                    }
                }

            })
        })
    }


    InsDocumentosExpediente(body: any): any {
        let propiedades: any = [];
        let idCompania: number;
        let idSucursal: number;
        // idCompania = body.idCompania;
        // idSucursal = body.idSucursal;

        body.forEach((prop: any) => {
            idCompania = prop.idCompania;
            idSucursal = prop.idSucursal;
            propiedades.push({
                propiedad: {
                    numeroSerie: prop.numeroSerie,
                    idCompania: idCompania,
                    idSucursal: idSucursal
                }
            })
        });
        var xml = jsonxml({ propiedades: propiedades });
        return new Promise((resolve, reject) => {
            this.query.spExecuteParam({ xmlVIN: xml, }, "[Reporte].[INS_DOCUMENTOEXPEDIENTE_SP]").then(
                (res: any) => {
                    resolve(this.ArregloDocumentos(res.recordsets[0]));
                    console.log(res.recordsets[0]);
                }
            ).catch((error: any) => {
                reject(error);
            });

        });
    }
    getUnidadesSubirIntelimotor(body: any): PromiseLike<{}> {
        return this.query.spExecute(body, "[Reporte].[SEL_UNIDADES_SUBIR_INTELIMOTORS_SP]")
    }
    async procesaInsertIntelimotor(body: any): Promise<any> {
        let arreglo = body
        return new Promise(async (resolve, reject) => {
            let contenedor: any = []
            for (let i = 0; i < arreglo.length; i++) {
                try {
                    // ************No borrar*******************************
                    let r = await this.validaInsertIntelimotor(arreglo[i])
                    contenedor.push({ success: true, vin: arreglo[i]?.vin, recordsets: r })
                } catch (error) {
                    contenedor.push({ success: false, vin: arreglo[i]?.vin, error: error })
                }
            }
            let unidadIntelimotorInsertado: any = []
            let unidadIntelimotorExistente: any = []
            let unidadIntelimotorError: any = []
            const unidadesError = contenedor.filter((o: any) => o.recordsets?.estatus == 500)
            const unidadesCorrectas = contenedor.filter((y: any) => y.recordsets?.estatus == 200)
            // const unidadesExistentes = contenedor.filter((y:any)=>y.recordsets?.estatus == 200 && y.recordsets?.estado == 0 )
            unidadesCorrectas.forEach((x: any) => {
                const res = x.recordsets
                // estado == 0 insert estado ==1 no inserta
                if (res.id != undefined && res.estado == 1) {
                    unidadIntelimotorInsertado.push({
                        vehiculo: {
                            idUnidadIntemilotors: res.id,
                            vin: res.vin,
                            idUnidad: res.idUnidad,
                            mensaje: res.msgRespuesta,
                            estado: 0
                        }
                    })
                } else if (res.id != undefined && res.estado == 0) {
                    unidadIntelimotorExistente.push({
                        vehiculo: {
                            idUnidadIntemilotors: res.id,
                            vin: res.vin,
                            idUnidad: res.idUnidad,
                            mensaje: res.msgRespuesta,
                            estado: 0
                        }
                    })
                }
            })
            unidadesError.forEach((x: any) => {
                const res = x.recordsets
                // estado == 0 insert estado ==1 no inserta
                if (res.estado == 3) {
                    unidadIntelimotorError.push({
                        vehiculo: {
                            idUnidadIntemilotors: String(0),
                            vin: res.vin,
                            idUnidad: res.idUnidad,
                            mensaje: res.msgRespuesta,
                            estado: 1
                            // msg: res.msg
                        }
                    })
                }
            })
            if (unidadIntelimotorInsertado.length > 0) {
                var xml = jsonxml({ autoIntelimotor: unidadIntelimotorInsertado })
                this.query.spExecuteParam({ XMLRespuesta: xml }, "[Reporte].[UPD_UNIDAD_INTELIMOTOR_SP]").then(
                    (res: any) => {
                        // console.log(res);
                        // resolve(contenedor)
                        unidadIntelimotorInsertado = []
                    }
                ).catch((error: any) => {
                    reject(error);
                });
                // console.log(xml)
            }
            if (unidadIntelimotorExistente.length > 0) {
                var xml = jsonxml({ autoIntelimotor: unidadIntelimotorExistente })
                this.query.spExecuteParam({ XMLRespuesta: xml }, "[Reporte].[UPD_UNIDAD_INTELIMOTOR_SP]").then(
                    (res: any) => {
                        // console.log(res);
                        unidadIntelimotorExistente = []
                        // resolve(contenedor)
                    }
                ).catch((error: any) => {
                    reject(error);
                });
                // console.log(xml)
            }
            if (unidadIntelimotorError.length > 0) {
                var xml = jsonxml({ autoIntelimotor: unidadIntelimotorError })
                this.query.spExecuteParam({ XMLRespuesta: xml }, "[Reporte].[UPD_UNIDAD_INTELIMOTOR_SP]").then(
                    (res: any) => {
                        // console.log(res);
                        // resolve(contenedor)
                        unidadIntelimotorError = []
                    }
                ).catch((error: any) => {
                    reject(error);
                });
                // console.log(xml)
            }
            if (unidadIntelimotorExistente == '' && unidadIntelimotorError == '' && unidadIntelimotorInsertado) {
                resolve(contenedor)
            }
        }).catch((error: any) => { reject(error); })

    }

    validaInsertIntelimotor(body: any): Promise<any> {
        return new Promise(async (resolve, reject) => {
            const http = require("https");
            const apiKey = this.conf.intelimotor.apiKey;
            const apiSecret = this.conf.intelimotor.apiSecret;
            const host = this.conf.intelimotor.host
            const vin = body.vin
            const idCompania = body.idCompania
            const idSucursal = body.idSucursal
            // const url1 = `${host}/units/vin/${vin}?apiKey=${apiKey}&apiSecret=${apiSecret}`
            const url1 = `${host}/integrations/andrade/units/${vin}/${idCompania}/${idSucursal}?apiKey=${apiKey}&apiSecret=${apiSecret}`
            requestPost.get({
                url: url1,
                // body: datos,
                // json: true
            }, async (err1: any, httpResponse1: any, body1: any) => {
                //console.log(err1, httpResponse1, body1)
                if (!err1) {
                    const respuesta = JSON.parse(body1);
                    // VALIDA SI EXISTE EL VIN EN INTELIMOTOR
                    // if (!respuesta?.error) {
                    if (respuesta.data != '') {
                        //  if(respuesta.data[0]?.isSold == false){
                        if (!respuesta?.error) {
                            resolve(
                                {
                                    estatus: 200,
                                    id: respuesta.data[0]?.id,
                                    vin: respuesta.data[0]?.vin,
                                    idUnidad: body.idUnidad,
                                    // marca: 
                                    // version : respuesta.data.trim,
                                    msg: 'El VIN ya se encuentra registrado',
                                    estado: 0,//ESTADO 0 cuando el VIN ya fue registrado
                                    msgRespuesta: "El Vin ya se encuentra registrado en la Empresa: " + idCompania + " Sucursal:" + idSucursal + " ID:" + respuesta.data[0]?.id + " isSold:" + respuesta.data[0]?.isSold + " Estatus" + JSON.stringify(respuesta)
                                }
                            )
                        } else {
                            resolve(
                                {
                                    estatus: 500,
                                    res: respuesta,
                                    idUnidad: body.idUnidad,
                                    msg: "Error Valida Existencia",
                                    msgRespuesta: respuesta.error,
                                    estado: 3, //estado 3 error al insertar en Intelimotors
                                    vin: body.vin
                                }
                            )
                        }
                        // }
                    } else {
                        let r = await this.PostInsertIntelimotor(body)
                        resolve(r)
                    }

                } else {
                    resolve('err1.message');
                }
            }
            )
        }).catch((err: any) => {
            reject(err)
        })
    }
    PostInsertIntelimotor(body: any): Promise<any> {
        return new Promise(async (resolve, reject) => {
            const http = require("https");
            const apiKey = this.conf.intelimotor.apiKey;
            const apiSecret = this.conf.intelimotor.apiSecret;
            const host = this.conf.intelimotor.host
            const datos = {
                businessUnitId: body.idSucursalIntelimotors,
                ref: body.idUnidad,
                vin: body.vin,
                brandIds: [String(body.EQI_BRAND)],
                modelIds: [String(body.EQI_MODELS)],
                yearIds: [String(body.EQI_YEARS)],
                trimIds: [String(body.EQI_TRIMS)],
                useCustomTrim: false,
                customTrim: null,
                kms: body.km,
                type: "owned",
                consignmentFeeType: null,
                buyPrice: body.precioVentaIva,
                buyDate: parseInt((new Date().getTime() / 1000).toFixed(0)),
                listPrice: body.precioVenta,
                pictures: [],
                customValues: [],
                imported: true,
                useExternalCatalog: false
            }
            // }
            const url = `${host}/units?apiKey=${apiKey}&apiSecret=${apiSecret}`
            requestPost.post({
                url: url,
                body: datos,
                json: true
            }, async (err1: any, httpResponse1: any, body1: any) => {
                // console.log("RES",err1, httpResponse1, body1)
                if (!err1) {
                    const respuesta = body1;
                    //console.log("respuesta",respuesta)
                    if (!respuesta?.error) {
                        //console.log("respuesta2",respuesta)
                        resolve(
                            {
                                estatus: 200,
                                res: respuesta,
                                id: respuesta.data.id,
                                idUnidad: body.idUnidad,
                                msg: "Registro exitoso",
                                msgRespuesta: respuesta,
                                estado: 1, //estado 1 registro exitoso,
                                vin: body.vin
                            }
                        )
                    } else {
                        resolve(
                            {
                                estatus: 500,
                                res: respuesta,
                                idUnidad: body.idUnidad,
                                msg: "Error PostIntelimotors",
                                msgRespuesta: respuesta.error,
                                estado: 3, //estado 3 error al insertar en Intelimotors
                                vin: body.vin
                            }
                        )
                    }

                } else {
                    resolve('err1.message');
                }
            }
            )

        }).catch((err) => {
            reject(err)
        })
    }

    FormatoTiempo() {
        const fecha = new Date()
        const h = fecha.getHours();
        const m = fecha.getMinutes();
        const s = fecha.getSeconds();
        const ms = fecha.getMilliseconds();
        return h + ':' + m + ':' + s + '.000';
    }

    FormatoFecha(inputFormat: any) {
        function pad(s: any) { return (s < 10) ? '0' + s : s; }
        const d = new Date(inputFormat)
        return [d.getFullYear(), pad(d.getMonth() + 1), pad(d.getDate())].join('-')
    }

    FechaDiaCorrecto(fecha: any) {
        return new Date(new Date(fecha).getTime() + new Date(fecha).getTimezoneOffset() * 60000)
    }

    GeneraDatosOrden(arr: any, tipo: string) {
        this.common.getCompaniaSucursal({}).then((res: any) => {
            const empresas = res.recordsets[0];
            const catalogoMarcas = res.recordsets[2];
            const data = []
            for (let e = 0; e < arr.length; e++) {
                let fechaFactura
                let factura
                let precioCompra;
                let precioVenta;
                if (tipo === 'PRIMERA') {
                    factura = arr[e].factura1
                    fechaFactura = this.FormatoFecha(this.FechaDiaCorrecto(arr[e].fechaFactura1))
                    // precioCompra = arr[e].precioVenta1
                    // precioVenta = (precioCompra + ((precioCompra / 100) * 10))
                    precioCompra = arr[e].precioCompraIva
                    // precioVenta = arr[e].precioVentaIva porcentajeAplicar1
                    //  precioVenta = (arr[e].precioVentaIva + (arr[e].precioVentaIva * 0.20))
                    precioVenta = (arr[e].precioVentaIva + (arr[e].precioVentaIva * arr[e].porcentajeAplica))
                } else {
                    fechaFactura = this.FormatoFecha(this.FechaDiaCorrecto(arr[e].fechaFactura2))
                    factura = arr[e].factura2
                    // factura = 'DESFLOTE'

                    // precioCompra = e.precioCompra2
                    // precioVenta = e.precioVenta2
                    // precioCompra = arr[e].precioVenta1
                    // precioVenta = (precioCompra + ((precioCompra / 100) * 10))

                    precioCompra = arr[e].precioCompraIva
                    // precioVenta = arr[e].precioVentaIva
                    //  precioVenta = (arr[e].precioVentaIva + (arr[e].precioVentaIva * 0.20))
                    precioVenta = (arr[e].precioVentaIva + (arr[e].precioVentaIva * arr[e].porcentajeAplica))

                }
                // tslint:disable-next-line:max-line-length
                // const marca = catalogoMarcas.filter((x: any) => x.Marca == arr[e].marca.toUpperCase() && x.idCompania == arr[e].idCompaniaOrden && x.idSucursal == arr[e].idSucursalOrden)
                const marca = catalogoMarcas.filter((x: any) => x.Marca == arr[e].marca.toUpperCase() && x.idCompania == arr[e].idCompaniaOrden)
                const datosEmpresa = empresas.filter((x: any) => x.idCompania == arr[e].idCompaniaOrden && x.idSucursal == arr[e].idSucursalOrden)
                const fecha = new Date();
                const fechaFormato = this.FormatoFecha(new Date(fecha.setDate(fecha.getDate() + 2)));
                const fechaPedimento = this.FormatoFecha(this.FechaDiaCorrecto(arr[e].fechaPedimento))
                const fechaPromesa = this.FormatoFecha(this.FechaDiaCorrecto(arr[e].fechaPromesa))
                const fechaAnticipo = this.FormatoFecha(this.FechaDiaCorrecto(arr[e].fechaAnticipo))
                const tiempoPromesa = this.FormatoTiempo();
                let rfcCompania = ''
                let idProveedor = 0
                let desflote = 0
                if (tipo === 'PRIMERA') {
                    rfcCompania = arr[e].rfcCompania
                    idProveedor = arr[e].idProveedorCompania
                    desflote = 1
                } else if (tipo === 'SEGUNDA') {
                    rfcCompania = arr[e].rfcCompania1
                    idProveedor = arr[e].idProveedorCompania1
                    desflote = 2
                }
                data.push({
                    idCompaniaAnterior: arr[e].idCompania1,
                    idSucursalAnterior: arr[e].idSucursal1,
                    idUnidad: arr[e].unidadId,
                    asignacion: tipo,
                    IdEmpresa: arr[e].idCompaniaOrden,
                    IdSucursal: arr[e].idSucursalOrden,
                    RfcCompaniaAsignacion: datosEmpresa[0].rfcCompania,
                    rfcCompania,
                    NumeroSerie: arr[e].numeroSerie,
                    Marca: marca[0].idMarca,
                    Modelo: arr[e].submarca,
                    AnioModelo: parseInt(arr[e].modelo),
                    ClaveVehicular: arr[e].claveVehicular,
                    Kilometraje: arr[e].kilometraje,
                    Placas: arr[e].placas,
                    ColorInterior: arr[e].colorInterior,
                    ColorExterior: arr[e].colorExterior,
                    Combustible: arr[e].combustibleIdentificador, //DESDE ARRAY
                    Transmision: arr[e].idTransmision,
                    TipoUnidad: arr[e].idTipoUnidad,
                    Ubicacion: datosEmpresa[0].idUbicacion,
                    TipoAdquisicion: arr[e].tipoAdquisicion, //ajuste de case
                    OrigenUnidad: arr[e].idOrigenUnidad,
                    OrigenMotor: arr[e].idOrigenMotor,
                    CompraToma: datosEmpresa[0].tomaCompra,
                    FacturaCompra: factura,
                    FechaFactura: fechaFactura,
                    Moneda: arr[e].idMoneda,
                    Aduana: datosEmpresa[0].idAduana,
                    NoPedimento: arr[e].noPedimento,
                    FechaPedimento: fechaPedimento,
                    SerieImportacion: arr[e].serieImportacion,
                    Proveedor: idProveedor,
                    // Proveedor: 21654,
                    PrecioCompraIva: precioCompra,
                    PrecioVentaIva: precioVenta,
                    FechaPromesa: fechaFormato,
                    HoraPromesa: tiempoPromesa,
                    Vendedor: arr[e].idVendedor,
                    // Vendedor: 57001,
                    NoMotor: arr[e].noMotor,
                    Cilindros: arr[e].cilindros,
                    Capacidad: arr[e].capacidad,
                    Puertas: arr[e].puertas,
                    EstadoPlacas: arr[e].idEstadoPlacas,
                    CalcomaniaLegalizacion: arr[e].calcomaniaLegalizacion,
                    Comentarios: arr[e].comentarios,
                    Anticipo: 0,
                    CantidadAnticipo: 0,
                    PorcentajeAnticipo: 0,
                    FechaAnticipo: fechaAnticipo,
                    idUsuarioBpro: arr[e].idUsuarioBpro,
                    Desflote: desflote,
                    rutaPdf: arr[e].rutaPDF,
                    rutaXml: arr[e].rutaXML
                })
            }
            const envioDatos = {
                datos: data,
                tipo
            }
            this.PostOrdenCompra(envioDatos).then(
                async (resp: any) => {
                    const unidadesBien = resp.filter((x: any) => x.estatus === 200)
                    if (unidadesBien.length > 0) {
                        // if (tipo === 'PRIMERA') {
                        setTimeout(async () => {
                            this.PostCopiaDocumentosPdf(unidadesBien, tipo)
                            if (tipo === 'PRIMERA') {
                                await this.InsDocumentosExpedienteFactura(unidadesBien)
                                    .then(async () => {
                                        await this.InsDocumentosExpediente(unidadesBien)
                                    })
                            } else if (tipo === 'SEGUNDA') {
                                await this.InsDocumentosExpedienteSegundaAsignacion(unidadesBien)
                            }
                            // this.PostCopiaDocumentosPdf(unidadesBien).then(
                            //     (resCopiaDoc: any) => {
                            //         const datos = resCopiaDoc.filter((x: any) => x.validacion === true);
                            //         if (datos.length > 0) {
                            //             setTimeout(() => {
                            //                 this.PostSubeDocumentosFactura(datos);
                            //             }, 20000);
                            //         }
                            //     }
                            // );
                        }, 20000);
                    }
                }
                // }
            )
        })
    }

    async PostOrdenCompra(body: any): Promise<any> {

        // console.log('Start');
        // const fruitsToGet = ['apple', 'grape', 'pear'];

        // for (let index = 0; index < fruitsToGet.length; index++) {
        //     const fruit = fruitsToGet[index];
        //     const numFruit = await getNumFruit(fruit);
        //     console.log(numFruit);
        // }

        // console.log('End');

        return new Promise(async (resolve, reject) => {
            await this.PostAutenticacionBpro()
                .then(async (res: any) => {
                    const token = res.Token;
                    let enviarDatos: any = [];
                    const data = body.datos
                    for (let e = 0; e < data.length; e++) {
                        const datos = {
                            IdEmpresa: data[e].IdEmpresa,
                            IdSucursal: data[e].IdSucursal,
                            NumeroSerie: data[e].NumeroSerie,
                            Marca: data[e].Marca,
                            Modelo: data[e].Modelo,
                            AnioModelo: data[e].AnioModelo,
                            ClaveVehicular: data[e].ClaveVehicular,
                            Kilometraje: data[e].Kilometraje,
                            Placas: data[e].Placas,
                            ColorInterior: data[e].ColorInterior,
                            ColorExterior: data[e].ColorExterior,
                            Combustible: data[e].Combustible,
                            Transmision: data[e].Transmision,
                            TipoUnidad: data[e].TipoUnidad,
                            Ubicacion: data[e].Ubicacion,
                            TipoAdquisicion: data[e].TipoAdquisicion,
                            OrigenUnidad: data[e].OrigenUnidad,
                            OrigenMotor: data[e].OrigenMotor,
                            CompraToma: data[e].CompraToma,
                            FacturaCompra: data[e].FacturaCompra,
                            FechaFactura: data[e].FechaFactura,
                            Moneda: data[e].Moneda,
                            Aduana: data[e].Aduana,
                            NoPedimento: data[e].NoPedimento,
                            FechaPedimento: data[e].FechaPedimento,
                            SerieImportacion: data[e].SerieImportacion,
                            Proveedor: data[e].Proveedor,
                            PrecioCompraIva: data[e].PrecioCompraIva,
                            PrecioVentaIva: data[e].PrecioVentaIva,
                            FechaPromesa: data[e].FechaPromesa,
                            HoraPromesa: data[e].HoraPromesa,
                            Vendedor: data[e].Vendedor,
                            NoMotor: data[e].NoMotor,
                            Cilindros: data[e].Cilindros,
                            Capacidad: data[e].Capacidad,
                            Puertas: data[e].Puertas,
                            EstadoPlacas: data[e].EstadoPlacas,
                            CalcomaniaLegalizacion: data[e].CalcomaniaLegalizacion,
                            Comentarios: data[e].Comentarios,
                            Anticipo: data[e].Anticipo,
                            CantidadAnticipo: data[e].CantidadAnticipo,
                            PorcentajeAnticipo: data[e].PorcentajeAnticipo,
                            FechaAnticipo: data[e].FechaAnticipo,
                            Desflote: data[e].Desflote,

                        }
                        const dat = await this.ProcesaOrden(token, datos, data[e])
                        enviarDatos.push(dat)
                    }
                    let xmlDatos = `<unidades>`;
                    for (const e of enviarDatos) {
                        xmlDatos += `<unidad><estatus>${e.estatus}</estatus><idUnidad>${e.idUnidad}</idUnidad><idCompania>${e.idCompania}</idCompania><idSucursal>${e.idSucursal}</idSucursal><ordenCompra>${e.ordenCompra}</ordenCompra><asignacion>${e.asignacion}</asignacion><message>${e.message}</message><numeroSerie>${e.numeroSerie}</numeroSerie></unidad>`;
                    }
                    xmlDatos += `</unidades>`;

                    await this.PostAsignacion(xmlDatos, body.tipo, enviarDatos, resolve, reject);



                })
                .catch((error: any) => {
                    reject(error)
                })

        })
    }

    async ProcesaOrden(token: any, datos: any, datosArreglo: any): Promise<{}> {
        return new Promise(async (resolve, reject) => {
            const ruta = `${this.conf.bpro.protocolo}://${this.conf.bpro.host}:${this.conf.bpro.port}/api/OrdenCompra`;
            await requestPost.post({
                url: ruta,
                body: datos,
                json: true,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            }, async (err1: any, httpResponse1: any, body1: any) => {
                if (!err1) {
                    const respuesta = JSON.stringify(body1);
                    if (body1.status !== 'Error' && respuesta.indexOf("Error") < 0 && respuesta.indexOf("Bad Request") < 0 && respuesta.indexOf("200") > 0) {
                        resolve({
                            estatus: 200,
                            idUnidad: datosArreglo.idUnidad,
                            idCompania: datosArreglo.IdEmpresa,
                            idSucursal: datosArreglo.IdSucursal,
                            ordenCompra: body1.OrdenCompra,
                            asignacion: datosArreglo.asignacion,
                            message: JSON.stringify(body1),
                            numeroSerie: datosArreglo.NumeroSerie,
                            idUsuarioBpro: datosArreglo.idUsuarioBpro,
                            facturacion: datosArreglo.FacturaCompra,
                            folio: body1.OrdenCompra,
                            rfcCompania: datosArreglo.rfcCompania,
                            RfcCompaniaAsignacion: datosArreglo.RfcCompaniaAsignacion,
                            proveedor: datosArreglo.Proveedor,
                            idCompaniaAnterior: datosArreglo.idCompaniaAnterior,
                            idSucursalAnterior: datosArreglo.idSucursalAnterior,
                            rutaPdf: datosArreglo.rutaPdf,
                            rutaXml: datosArreglo.rutaXml,
                        })
                    } else {
                        resolve({
                            estatus: 500,
                            idUnidad: datosArreglo.idUnidad,
                            idCompania: datosArreglo.IdEmpresa,
                            idSucursal: datosArreglo.IdSucursal,
                            ordenCompra: body1.OrdenCompra,
                            asignacion: datosArreglo.asignacion,
                            message: JSON.stringify(body1),
                            numeroSerie: datosArreglo.NumeroSerie
                        })
                    }
                } else {
                    resolve({
                        estatus: 500,
                        idUnidad: datosArreglo.idUnidad,
                        idCompania: datosArreglo.IdEmpresa,
                        idSucursal: datosArreglo.IdSucursal,
                        ordenCompra: body1.OrdenCompra,
                        asignacion: datosArreglo.asignacion,
                        message: JSON.stringify(err1),
                        numeroSerie: datosArreglo.NumeroSerie
                    })
                }

            });
        })
    }

    PostFacturaEntrega(body: any): any {
        let propiedades: any = [];
        body.forEach((prop: any) => {
            propiedades.push({
                propiedad: {
                    folio: prop.ordenCompra,
                    idperfil: prop.idUsuarioBpro,
                    opcion: 1,
                    idAprobacion: 0
                }
            })
        });
        var xml = jsonxml({ propiedades: propiedades });
        return new Promise((resolve, reject) => {
            this.query.spExecuteParam({ xmlUnidades: xml, }, "[Reporte].[INS_FACTURA_ENTREGA_SP]").then(
                (res: any) => {
                    resolve(res)
                }
            ).catch((error: any) => {
                reject(error);
            });
        });
    }

    PostGenerarCotizacion(body: any): any {
        let propiedades: any = [];
        let idCompania: number;
        let idSucursal: number;
        let idUsuarioBpro: number;
        let rfcCompania: String;
        idCompania = body.idCompania;
        idSucursal = body.idSucursal;
        rfcCompania = body.rfcCompania;
        idUsuarioBpro = body.idUsuarioBpro;
        body.unidadesSeleccionadas.forEach((prop: any) => {
            propiedades.push({
                propiedad: {
                    unidadId: prop.unidadId,
                    numeroSerie: prop.numeroSerie,
                    autolinea: prop.submarca,
                    modelo: prop.modelo,
                    colorExterior: prop.colorExterior,
                    colorInterior: prop.colorInterior,
                    precioCompra: prop.precioVentaIva,
                    idMoneda: prop.idMoneda,
                    idCompania: prop.idCompania1,
                    idSucursal: prop.idSucursal1
                }
            })
        });
        var xml = jsonxml({ propiedades: propiedades });
        return new Promise((resolve, reject) => {
            const data = {
                idUsuarioBpro: idUsuarioBpro,
                idCompaniaDestino: idCompania,
                idSucursalDestino: idSucursal,
                rfcCompania: rfcCompania,
                xmlUnidades: xml,
            }
            resolve(this.query.spExecuteParam(data, "[Reporte].[INS_COTIZACION_SP]"));
        });
    }

    PostAsignacion(xmlDatos: any, tipo: string, arreglo: any, resolve: any, reject: any): any {
        const datos = {
            xmlUnidadesAsignar: xmlDatos,
            tipo
        }
        this.query.spExecuteParam(datos, "[Reporte].[INS_UNIDADASIGNACIONTRAMITE_SP]").then((res: any) => {
            resolve(arreglo)
        }).catch((error: any) => {
            reject(error)
        })
    }

    async PostAutenticacionBpro() {
        let ruta: string;
        let body: { dealerId: any; apiKey: any; apiSecret: any; };
        ruta = `${this.conf.bpro.protocolo}://${this.conf.bpro.host}:${this.conf.bpro.port}/api/login/authenticate`;
        body = {
            dealerId: this.conf.bpro.dealerId,
            apiKey: this.conf.bpro.apiKey,
            apiSecret: this.conf.bpro.apiSecret,
        }
        // }
        return new Promise(async (resolve, reject) => {
            requestPost.post({
                url: ruta,
                body: body,
                json: true
            }, function (err: any, httpResponse: any, x: any) {
                if (!err) {

                    resolve(x);
                } else {
                    reject(err)
                }
            });
        })
    }

    InsDocumentosExpedienteFactura(body: any): any {
        let propiedades: any = [];
        let idCompania: number;
        let idSucursal: number;
        // idCompania = body.idCompania;
        // idSucursal = body.idSucursal;


        body.forEach((prop: any) => {
            idCompania = prop.idCompania
            idSucursal = prop.idSucursal
            propiedades.push({
                propiedad: {
                    numeroSerie: prop.numeroSerie,
                    idCompania: idCompania,
                    idSucursal: idSucursal,
                    factura: prop.facturacion
                }
            })
        });
        var xml = jsonxml({ propiedades: propiedades });
        return new Promise((resolve, reject) => {
            this.query.spExecuteParam({ xmlVIN: xml, }, "[Reporte].[INS_DOCUMENTOEXPEDIENTEFACTURA_SP]").then(
                (res: any) => {
                    this.PostSubirFactura(res.recordsets[0]);
                    resolve(res.recordsets[0]);
                }
            ).catch((error: any) => {
                reject(error);
            });
        });
    }


    PostSubirFactura(body: any): any {
        return new Promise((resolve, reject) => {
            let ArregloDocumentos: any = [];
            const https = require("http");
            let validaSerie = 'inicial';
            let auxSerie = 'inicial';
            ArregloDocumentos = body;
            ArregloDocumentos.forEach((x: any) => {
                if (!fs.existsSync(`${x.rutaExpediente}${x.id_expediente}\\CXP\\`)) {
                    fs.mkdirSync(`${x.rutaExpediente}${x.id_expediente}\\CXP\\`, { recursive: true }, (err: any) => {
                        console.log(err)
                    });
                    let file = fs.createWriteStream(`${x.rutaExpediente}${x.id_expediente}\\CXP\\${x.nombreDocumento}`);
                    https.get(`${this.conf.proveedorFactura.rutaPdf}${x.nombrefactura}.pdf`, (response: any) => {
                        var stream = response.pipe(file);
                        stream.on("finish", () => {
                            console.log("done");

                        });
                    })
                    // ncp(`${this.conf.proveedorFactura.rutaPdf}${x.nombrefactura}.pdf`, `${x.rutaExpediente}${x.id_expediente}\\CXP\\${x.nombreDocumento}`,
                    //     (err: any) => {
                    //         if (err) {
                    //             return console.error(err);
                    //         }
                    //         resolve('Documentos copiados')
                    //     });
                } else {
                    let file = fs.createWriteStream(`${x.rutaExpediente}${x.id_expediente}\\CXP\\${x.nombreDocumento}`);
                    https.get(`${this.conf.proveedorFactura.rutaPdf}${x.nombrefactura}.pdf`, (response: any) => {
                        var stream = response.pipe(file);
                        stream.on("finish", () => {
                            console.log("done");

                        });
                    })
                    // ncp(`${this.conf.proveedorFactura.rutaPdf}${x.nombrefactura}.pdf`, `${x.rutaExpediente}${x.id_expediente}\\CXP\\${x.nombreDocumento}`,
                    //     (err: any) => {
                    //         if (err) {
                    //             return console.error(err);
                    //         }
                    //         resolve('Documentos copiados')
                    //     });
                }
            })
        })
    }

    PostCopiaDocumentosPdf(body: any, tipo: string): any {
        return new Promise((resolve, reject) => {
            let arregloRutas: any = []
            if (tipo === 'PRIMERA') {
                arregloRutas = [
                    {
                        ruta: this.conf.proveedorFactura.rutaPdf,
                        extension: '.pdf',
                        extension2: 'pdf'
                    },
                    {
                        ruta: this.conf.proveedorFactura.rutaXml,
                        extension: '.xml',
                        extension2: 'xml'
                    }
                ];
            } else {
                arregloRutas = [
                    {
                        extension: '.pdf',
                        extension2: 'pdf'
                    },
                    {
                        extension: '.xml',
                        extension2: 'xml'
                    }
                ];
            }
            // let contador = 0
            for (let e = 0; e < body.length; e++) {
                // contador++
                // let contador2 = 0
                for (let x = 0; x < arregloRutas.length; x++) {
                    let rutaCompleta
                    if (tipo === 'PRIMERA') {
                        rutaCompleta = arregloRutas[x].ruta
                    } else {
                        if (arregloRutas[x].extension2 === 'pdf') {
                            rutaCompleta = body[e].rutaPdf
                        } else if (arregloRutas[x].extension2 === 'xml') {
                            rutaCompleta = body[e].rutaXml
                        }
                    }
                    let factura = body[e].facturacion;
                    if (tipo === 'PRIMERA') {
                        const https = require("http");
                        let file = fs.createWriteStream(`C:\\APLICACIONES\\Proveedores\\GIT\\proveedores\\app\\static\\files\\${factura}${arregloRutas[x].extension}`);
                        https.get(`${rutaCompleta}${factura}${arregloRutas[x].extension}`, (response: any) => {
                            var stream = response.pipe(file);
                            stream.on("finish", () => {
                                console.log('done')
                                if (arregloRutas[x].extension === '.pdf') {
                                    if (response.statusCode === 200) {
                                        body[e].existeFactura = true;
                                    }
                                    else {
                                        body[e].existeFactura = false;
                                    }
                                }

                                let arr: any = [];
                                if (x + 1 === arregloRutas.length) {
                                    const validacion = arr.filter((y: any) => y === 2)
                                    if (validacion.length > 0) {
                                        body[e].validacion = false
                                    } else {
                                        body[e].validacion = true
                                    }
                                    if (x + 1 === arregloRutas.length && e + 1 === body.length) {
                                        this.PostExisteFactura(body, tipo)
                                        resolve(body);
                                    }
                                }

                            });
                        })
                        // ncp(`${rutaCompleta}${factura}${arregloRutas[x].extension}`, `C:\\APLICACIONES\\Proveedores\\GIT\\proveedores\\app\\static\\files\\${factura}${arregloRutas[x].extension}`,
                        //     async (err: any) => {
                        //         let arr: any = [];
                        //         if (err) {
                        //             console.log(err);
                        //             arr.push(2);
                        //             if (x + 1 === arregloRutas.length) {
                        //                 console.log('entra')
                        //                 const validacion = arr.filter((y: any) => y === 2)
                        //                 console.log(validacion, arr)
                        //                 if (validacion) {
                        //                     body[e].validacion = false
                        //                 } else {
                        //                     body[e].validacion = true
                        //                 }
                        //                 if (x + 1 === arregloRutas.length && e + 1 === body.length) {
                        //                     resolve(body);
                        //                 }
                        //             }
                        //         } else {
                        //             if (x + 1 === arregloRutas.length) {
                        //                 const validacion = arr.filter((y: any) => y === 2)
                        //                 if (validacion.length > 0) {
                        //                     body[e].validacion = false
                        //                 } else {
                        //                     body[e].validacion = true
                        //                 }
                        //                 if (x + 1 === arregloRutas.length && e + 1 === body.length) {
                        //                     resolve(body);
                        //                 }
                        //             }
                        //         }
                        //     });
                    }
                    else {
                        //aqui vamos a acceder al servicio web de las facturas
                        const https = require("http");
                        let file = fs.createWriteStream(`C:\\APLICACIONES\\Proveedores\\GIT\\proveedores\\app\\static\\files\\${factura}${arregloRutas[x].extension}`);
                        https.get(`${rutaCompleta}${factura}${arregloRutas[x].extension}`, (response: any) => {
                            var stream = response.pipe(file);
                            stream.on("finish", () => {
                                console.log('done')
                                if (arregloRutas[x].extension === '.pdf') {
                                    if (response.statusCode === 200) {
                                        body[e].existeFactura = true;
                                    }
                                    else {
                                        body[e].existeFactura = false;
                                    }
                                }
                                let arr: any = [];
                                if (x + 1 === arregloRutas.length) {
                                    const validacion = arr.filter((y: any) => y === 2)
                                    if (validacion.length > 0) {
                                        body[e].validacion = false
                                    } else {
                                        body[e].validacion = true
                                    }
                                    if (x + 1 === arregloRutas.length && e + 1 === body.length) {
                                        this.PostExisteFactura(body, tipo)
                                        resolve(body);
                                    }
                                }

                            });
                        })
                    }

                }
            }
        })
    }

    PostSubeDocumentosFactura(body: any): any {
        return new Promise(async (resolve, reject) => {
            const that = this;
            const arregloRutas = [
                {
                    // ruta: this.conf.proveedorFactura.rutaPdf,
                    extension: '.pdf',
                    extension2: 'pdf'
                },
                {
                    // ruta: this.conf.proveedorFactura.rutaXml,
                    extension: '.xml',
                    extension2: 'xml'
                }
            ];
            // let contador = 0
            for (let e = 0; e < body.length; e++) {
                // contador++
                // let contador2 = 0
                for (let x = 0; x < arregloRutas.length; x++) {
                    let arr: any = [];
                    const fecha = this.FechaFormatoDMY();
                    const datos = {
                        dir: this.conf.proveedorFactura.rutaArchivos,
                        folio: body[e].folio,
                        proveedor: body[e].proveedor,
                        rfc: body[e].rfcCompania,
                        tipo: arregloRutas[x].extension2,
                        nombre: `${body[e].facturacion}.${arregloRutas[x].extension2}`,
                        idRol: '2',
                        rfcProviderOC: body[e].RfcCompaniaAsignacion,
                        tipoDocumento: '1',
                        fechaOC: fecha
                    }

                    const validaFactura = await this.SubeFacturas(datos);
                    arr.push(validaFactura)
                    if (x === arregloRutas.length - 1) {
                        const validacion = arr.filter((y: any) => y === 2)
                        if (validacion.length > 0) {
                            body[e].validacion = false
                        } else {
                            body[e].validacion = true
                        }
                        if (x === arregloRutas.length - 1 && e === body.length - 1) {
                            resolve(body);
                        }
                    }

                }
            }
        })
    }

    async SubeFacturas(datos: any,) {
        return new Promise(async (resolve, reject) => {
            const ruta = `${this.conf.proveedorFactura.host}`;
            await requestPost.post({
                url: ruta,
                body: datos,
                json: true,
            }, function (err1: any, httpResponse1: any, body1: any) {
                console.log(body1)
                if (body1.indexOf('guardados') > 0 || body1.indexOf('terminado') > 0) {
                    // contador2++
                    resolve(1)
                } else {
                    // contador2++
                    resolve(2);
                }
            });
        })
    }

    PostSubeDocumentoComprobante(body: any): any {
        return new Promise(async (resolve, reject) => {
            let contador = 0
            for (const e of body) {
                contador++
                let arr: any = [];
                const ruta = `${this.conf.proveedorComprobante.host}?id=3|${e.folio}|15|1|1|2|1|C:/APLICACIONES/Centralizacion/Git/digitalizacion/app/uploads/15.pdf`;
                await requestPost.post({
                    url: ruta,
                    body: '',
                    json: true,
                }, function (err1: any, httpResponse1: any, body1: any) {
                    console.log(body1)
                    if (body1 === 1.0 || body1 === '1.0') {
                        arr.push(1)
                    } else {
                        arr.push(2);
                    }
                    const validacion = arr.filter((y: any) => y === 2)
                    if (validacion.length > 0) {
                        e.validacion = false
                    } else {
                        e.validacion = true
                    }
                    if (contador === body.length) {
                        resolve(body);
                    }
                });
            }
        })
    }

    PostValidaExpediente(body: any): PromiseLike<{}> {
        return this.query.spExecute(body, '[Reporte].[UPD_OBJPROPCONT_SP]')
    }

    FechaFormatoDMY() {
        let date = new Date()
        let day = date.getDate()
        let month = date.getMonth() + 1
        let year = date.getFullYear()

        if (month < 10) {
            return `${day}/0${month}/${year}`
        } else {
            return `${day}/${month}/${year}`
        }
    }

    ArregloDocumentos(body: any): any {
        let ArregloDocumentos: any = [];
        let validaSerie = 'inicial';
        let auxSerie = 'inicial';
        ArregloDocumentos = body;
        const https = require("https");
        let contador = 0;
        return new Promise((resolve, reject) => {
            ArregloDocumentos.forEach((x: any) => {
                if (!fs.existsSync(`${x.rutaExpediente}`)) {
                    fs.mkdirSync(`${x.rutaExpediente}`, { recursive: true }, (err: any) => {
                        console.log(err)
                    });

                    let file = fs.createWriteStream(`${x.rutaExpediente}${x.nombreExpediente}`);
                    if (x.ruta != null) {
                        let ruta = x.ruta.replace('\\', '/');
                        x.ruta = ruta;
                    }
                    const request = https.get(x.ruta, (response: any) => {
                        var stream = response.pipe(file);
                        stream.on("finish", () => {
                            console.log("done");
                            contador++;
                            if (contador === ArregloDocumentos.length) {
                                resolve("Se estan sincronizando los documentos");
                            }
                        }).on('error', function (err: any) { // Handle errors
                            console.log("error");
                            contador++;
                            if (contador === ArregloDocumentos.length) {
                                resolve("Se estan sincronizando los documentos");
                            }
                        });
                    })
                    request.on('error', (err: any) => {
                        contador++;
                        if (contador === ArregloDocumentos.length) {
                            resolve("Se estan sincronizando los documentos");
                        }
                        console.log(err.message);
                    });
                } else {
                    let file = fs.createWriteStream(`${x.rutaExpediente}${x.nombreExpediente}`);
                    if (x.ruta != null) {
                        let ruta = x.ruta.replace('\\', '/');
                        x.ruta = ruta;
                    }
                    const request = https.get(x.ruta, (response: any) => {
                        var stream = response.pipe(file);
                        stream.on("finish", () => {
                            console.log("done");
                            contador++;
                            if (contador === ArregloDocumentos.length) {
                                resolve("Se estan sincronizando los documentos");
                            }
                        }).on('error', function (err: any) { // Handle errors
                            console.log("error");
                            contador++;
                            if (contador === ArregloDocumentos.length) {
                                resolve("Se estan sincronizando los documentos");
                            }
                        });
                    })

                    request.on('error', (err: any) => {
                        contador++;
                        if (contador === ArregloDocumentos.length) {
                            resolve("Se estan sincronizando los documentos");
                        }
                        console.log(err.message);
                    });

                }
            })
        })
    }

    PostUpdPrecioVentaIva(body: any): any {
        let propiedades: any = [];
        let precioVentaIva: number;
        precioVentaIva = body.precioVentaIva;
        body.xmlVIN.forEach((prop: any) => {
            propiedades.push({
                propiedad: {
                    idUnidad: prop.idUnidad,
                }
            })
        });
        var xml = jsonxml({ propiedades: propiedades });
        return new Promise((resolve, reject) => {
            const data = {
                xmlVIN: xml,
                precioVentaIva: precioVentaIva
            }
            resolve(this.query.spExecuteParam(data, "[Reporte].[UPD_PRECIOVENTAIVA_SP]"));
        });
    }

    PostUpdUbicacion(body: any): any {
        let propiedades: any = [];
        let ubicacion: String;
        ubicacion = body.ubicacion;
        body.xmlVIN.forEach((prop: any) => {
            propiedades.push({
                propiedad: {
                    idUnidad: prop.idUnidad,
                }
            })
        });
        var xml = jsonxml({ propiedades: propiedades });
        return new Promise((resolve, reject) => {
            const data = {
                xmlVIN: xml,
                ubicacion: ubicacion
            }
            resolve(this.query.spExecuteParam(data, "[Reporte].[UPD_UBICACION_SP]"));
        });
    }

    PostUpdSituacion(body: any): any {
        let propiedades: any = [];
        let situacion: String;
        situacion = body.situacion;
        body.xmlVIN.forEach((prop: any) => {
            propiedades.push({
                propiedad: {
                    idUnidad: prop.idUnidad,
                }
            })
        });
        var xml = jsonxml({ propiedades: propiedades });
        return new Promise((resolve, reject) => {
            const data = {
                xmlVIN: xml,
                situacion: situacion
            }
            resolve(this.query.spExecuteParam(data, "[Reporte].[UPD_SITUACION_SP]"));
        });
    }

    PostUpdBaja(body: any): any {
        let propiedades: any = [];
        let baja: String;
        baja = body.baja;
        body.xmlVIN.forEach((prop: any) => {
            propiedades.push({
                propiedad: {
                    idUnidad: prop.idUnidad,
                }
            })
        });
        var xml = jsonxml({ propiedades: propiedades });
        return new Promise((resolve, reject) => {
            const data = {
                xmlVIN: xml,
                bajaDescripcion: baja
            }
            resolve(this.query.spExecuteParam(data, "[Reporte].[UPD_BAJA_SP]"));
        });
    }

    PostExisteFactura(query: any, tipo: any): PromiseLike<{}> {
        let propiedades: any = [];
        query.forEach((prop: any) => {
            propiedades.push({
                propiedad: {
                    idUnidad: prop.idUnidad,
                    asignacion: tipo,
                    factura: prop.facturacion,
                    existeFactura: prop.existeFactura
                }
            })
        });
        var xml = jsonxml({ propiedades: propiedades });
        return new Promise((resolve, reject) => {
            const data = {
                xmlVIN: xml,
            }
            resolve(this.query.spExecuteParam(data, "[Reporte].[UPD_EXISTEFACTURA_SP]"));
        });
    }

    PostUpdFactura(query: any): PromiseLike<{}> {
        return this.query.spExecute(query, "[Reporte].[UPD_FACTURA_SP]")
    }

    PostActualizaBanderaFactura(body: any): PromiseLike<{}> {
        return this.query.spExecute(body, "[Reporte].[UPD_BANDERA_FACTURA_SP]")
    }

    PostAsignacionMismaEmpresa(body: any): PromiseLike<{}> {
        return this.query.spExecute(body, "[Reporte].[INS_UNIDADASIGNACIONTRAMITEMISMA_SP]")
    }

    UpdPrecio(body: any): PromiseLike<{}> {
        return this.query.spExecute(body, "[Reporte].[UPD_PRECIO_VENTA_SP]")
    }


    actualizaFacturas(body: any): any {
        return new Promise((resolve, reject) => {
            let ArregloDocumentos: any = [{ id_expediente: '5202', nombreFactura: 'BA000000082' },
            { id_expediente: '5204', nombreFactura: 'BA000000083' },
            { id_expediente: '5205', nombreFactura: 'BA000000084' },
            { id_expediente: '5206', nombreFactura: 'BA000000085' },

            ];
            let contador = 0
            const https = require("http");
            ArregloDocumentos.forEach((x: any) => {

                // setTimeout( () => {
                if (!fs.existsSync(`E:\\app\\public\\Imagenes\\expedienteDigitalSeminuevos\\expediente_${x.id_expediente}\\CXP\\`)) {
                    fs.mkdirSync(`E:\\app\\public\\Imagenes\\expedienteDigitalSeminuevos\\expediente_${x.id_expediente}\\CXP\\`, { recursive: true }, (err: any) => {
                        console.log(err)
                    });
                    let file = fs.createWriteStream(`E:\\app\\public\\Imagenes\\expedienteDigitalSeminuevos\\expediente_${x.id_expediente}\\CXP\\FacturaDistribuidora.pdf`);
                    https.get(`http://192.168.20.105:8081/CHEV/CFD/pdf/AZC/${x.nombreFactura}.pdf`, (response: any) => {
                        var stream = response.pipe(file);
                        stream.on("finish", () => {
                            console.log("done");
                            contador++
                            if (contador === ArregloDocumentos.length) {
                                resolve('copiando documentos')
                            }

                        });
                    })
                } else {
                    let file = fs.createWriteStream(`E:\\app\\public\\Imagenes\\expedienteDigitalSeminuevos\\expediente_${x.id_expediente}\\CXP\\FacturaDistribuidora.pdf`);
                    https.get(`http://192.168.20.105:8081/CHEV/CFD/pdf/AZC/${x.nombreFactura}.pdf`, (response: any) => {
                        var stream = response.pipe(file);
                        stream.on("finish", () => {
                            console.log("done");
                            contador++
                            if (contador === ArregloDocumentos.length) {
                                resolve('copiando documentos')
                            }
                        });
                    })
                }
                // }, 1000);
            })
        })
    }

    sellUnit(body: any): PromiseLike<{}> {
        return this.query.spExecute(body, "[desfloteExterno].[INS_VENTA_UNIT_SP]")
    };

    deleteVenta(body: any): PromiseLike<{}> {
        return this.query.spExecute(body, "[desfloteExterno].[DEL_VENTA_UNIT_SP]")
    };

    // ************* TERMINA POST *************

    // ************ SERVICIOS PUT ************
    updatePrice(body: any): PromiseLike<{}> {
        return this.query.spExecute(body, "[desfloteExterno].[UPD_PRICE_UNIT_SP]")
    };
    // ************* TERMINA PUT *************

    // ************ SERVICIOS DELETE ************
    // ************* TERMINA DELETE *************
}


