import { Request } from 'express';
import multer from 'multer';
import sftpStorage from 'multer-sftp';
import { async } from 'q';
import {
	JsonController,
	UploadedFile,
	Body,
	Get,
	Post,
	Req,
	Put,
	Delete,
	Res,

} from 'routing-controllers';
import { DesfloteReporteRepository } from '../repository/desfloteReporte.repository';
const base64 = require('base64topdf');
let fs = require('fs');
var btoa = require('btoa');
const ftp = require("basic-ftp")
@JsonController('/reporte')
export class DesfloteReporteController {
	private repository: DesfloteReporteRepository;

	constructor(repository: DesfloteReporteRepository) {
		this.repository = repository;
	}

	// ************ Servicios GET ************

	/**
   * @description Obtiene la informacion de un reporte
   * @author Jose Alberto Polo Lara
   * SP: [Reporte].[SEL_GENERAL_SP] 
   * Url: http://{server}:{port}/reporte/GetDataReport
   * Wiki: 
   */
	@Get('/actualizaFacturas')
	GetDatactualizaFacturasaReport(@Req() req: Request) {
		return this.repository.actualizaFacturas(req.query);
	}



	/**
	* @description Obtiene la informacion de un reporte
	* @author Jose Alberto Polo Lara
	* SP: [Reporte].[SEL_GENERAL_SP] 
	* Url: http://{server}:{port}/reporte/GetDataReport
	* Wiki: 
	*/
	@Get('/GetDataReport')
	GetDataReport(@Req() req: Request) {
		return this.repository.GetDataReport(req.query);
	}

	/**
  * @description Obtiene la informacion de un reporte
  * @author Jose Alberto Polo Lara
  * SP: [Reporte].[SEL_PORCENTAJE_AVANCE_SP]
  * Url: http://{server}:{port}/reporte/porcentajeAvances
  * Wiki: 
  */
	@Get('/porcentajeAvances')
	porcentajeAvances(@Req() req: Request) {
		return this.repository.porcentajeAvances(req.query);
	}

	/**
	* @description Obtiene la informacion de un reporte
	* @author Jose Alberto Polo Lara
	* SP: [Reporte].[SEL_PORCENTAJE_AVANCE_SP]
	* Url: http://{server}:{port}/reporte/reporteGeneral
	* Wiki: 
	*/
	@Get('/reporteGeneral')
	reporteGeneral(@Req() req: Request) {
		return this.repository.reporteGeneral(req.query);
	}

	/**
   * @description Obtiene la informacion de un reporte
   * @author Jose Alberto Polo Lara
   * SP: [Reporte].[SEL_PROCESADAS_SP]
   * Url: http://{server}:{port}/reporte/getUnidadesProcesadas
   * Wiki: 
   */
	@Get('/getUnidadesProcesadas')
	getUnidadesProcesadas(@Req() req: Request) {
		return this.repository.getUnidadesProcesadas(req.query);
	}

	/**
   * @description Obtiene la informacion de un reporte
   * @author Jose Alberto Polo Lara
   * SP: [Reporte].[SEL_INVENTARIO_SP]
   * Url: http://{server}:{port}/reporte/GetDataInventario
   * Wiki: 
   */
	@Get('/GetDataInventario')
	GetDataInventario(@Req() req: Request) {
		return this.repository.GetDataInventario(req.query);
	}

	/**
  * @description Obtiene las coordenadas de un vehiculo
  * @author Jose Alberto Polo Lara
  * SP: [Reporte].[SEL_GPS_SP]
  * Url: http://{server}:{port}/reporte/GetPosicionVehiculo
  * Wiki: 
  */
	@Get('/GetPosicionVehiculo')
	GetPosicionVehiculo(@Req() req: Request) {
		return this.repository.GetPosicionVehiculo(req.query);
	}

	@Get('/updAndRefreshUnitDescription')
	updAndRefreshUnitDescription(@Req() req: Request) {
		return this.repository.updAndRefreshUnitDescription(req.query);
	};

	@Get('/selUsoCfdi')
	selUsoCfdi(@Req() req: Request) {
		return this.repository.selUsoCfdi(req.query);
	};

	@Get('/selConceptosContables')
	selConceptosContables(@Req() req: Request) {
		return this.repository.selConceptosContables(req.query);
	};

	// ************ END Servicios GET ************

	// ************ Servicios POST ************

	/**
	 * @description Registra unidades externas de un template de Excel
	 * @author José Alberto Polo Lara
	 * SP:[Reporte].[INS_UNIDADESEXTERNAS_SP]
	 * Url: http://{server}:{port}/reporte/PostRegistroExternos
	 * Wiki:
	 */

	@Post("/PostRegistroExternos")
	PostRegistroExternos(@Body({ options: { limit: '50mb', extended: true, parameterLimit: 500000 } }) body: Request) {
		return this.repository.PostRegistroExternos(body);
	}

	/**
	* @description Asigna unidades a una compañia específica
	* @author José Alberto Polo Lara
	* SP:[Reporte].[INS_UNIDADASIGNACIONTRAMITE_SP]
	* Url: http://{server}:{port}/reporte/PostAsignacion
	* Wiki:
	*/

	// @Post("/PostAsignacion")
	// PostAsignacion(@Body({ options: { limit: '50mb', extended: true, parameterLimit: 500000 } }) body: Request) {
	//   return this.repository.PostAsignacion(body);
	// }


	/**
  * @description Registra una cotizacion para segunda asignacion de desflote
  * @author José Alberto Polo Lara
  * SP:[Reporte].[INS_COTIZACION_SP]
  * Url: http://{server}:{port}/reporte/PostGenerarCotizacion
  * Wiki:
  */

	@Post("/PostGenerarCotizacion")
	PostGenerarCotizacion(@Body({ options: { limit: '50mb', extended: true, parameterLimit: 500000 } }) body: Request) {
		return this.repository.PostGenerarCotizacion(body);
	}


	/**
  * @description Actualiza los precios de venta
  * @author José Alberto Polo Lara
  * SP:[Reporte].[INS_COTIZACION_SP]
  * Url: http://{server}:{port}/reporte/UpdPrecio
  * Wiki:
  */

	@Post("/UpdPrecio")
	UpdPrecio(@Body({ options: { limit: '50mb', extended: true, parameterLimit: 500000 } }) body: Request) {
		return this.repository.UpdPrecio(body);
	}

	/**
  * @description Registra una cotizacion para segunda asignacion de desflote
  * @author José Alberto Polo Lara
  * SP:[Reporte].[INS_COTIZACION_SP]
  * Url: http://{server}:{port}/reporte/PostGenerarCotizacion
  * Wiki:
  */

	// @Post("/ObtenerFactura")
	// ObtenerFactura(@Body({ options: { limit: '50mb', extended: true, parameterLimit: 500000 } }) body: Request) {
	// 	return this.repository.ObtenerFactura(body);
	// }


	/**
  * @description Obtiene la segunda factura
  * @author José Alberto Polo Lara
  * SP:
  * Url: http://{server}:{port}/reporte/PostGenerarCotizacion
  * Wiki:
  */

	@Post("/PostBuscaSegundaFactura")
	PostBuscaSegundaFactura(@Body({ options: { limit: '50mb', extended: true, parameterLimit: 500000 } }) body: Request) {
		return this.repository.PostBuscaSegundaFactura(body);
	}

	/**
  * @description Sincroniza los documentos de sisco a Expediente de Seminuevos
  * @author José Alberto Polo Lara
  * SP:
  * Url: http://{server}:{port}/reporte/ArregloDocumentos
  * Wiki:
  */

	@Post('/ArregloDocumentos')
	ArregloDocumentos(@Body({ options: { limit: '50mb', extended: true, parameterLimit: 500000 } }) body: any, req: any, res: any) {
		return this.repository.ArregloDocumentos(body);
	}

	/**
  * @description Sincroniza las facturas a expediente de seminuevos
  * @author José Alberto Polo Lara
  * SP:
  * Url: http://{server}:{port}/reporte/PostSubirFactura
  * Wiki:
  */

	@Post('/PostSubirFactura')
	PostSubirFactura(@Body({ options: { limit: '50mb', extended: true, parameterLimit: 500000 } }) body: any, req: any, res: any) {
		return this.repository.PostSubirFactura(body);
	}


	/**
  * @description Inserta registros de documentos en Expediente seminuevos
  * @author José Alberto Polo Lara
  * SP:
  * Url: http://{server}:{port}/reporte/InsDocumentosExpediente
  * Wiki:
  */

	@Post('/InsDocumentosExpediente')
	InsDocumentosExpediente(@Body({ options: { limit: '50mb', extended: true, parameterLimit: 500000 } }) body: any, req: any, res: any) {
		return this.repository.InsDocumentosExpediente(body);
	}


	/**
  * @description Actualiza precio de venta
  * @author José Alberto Polo Lara
  * SP: [Reporte].[UPD_PRECIOVENTAIVA_SP]
  * Url: http://{server}:{port}/reporte/PostUpdPrecioVentaIva
  * Wiki:
  */

	@Post('/PostUpdPrecioVentaIva')
	PostUpdPrecioVentaIva(@Body({ options: { limit: '50mb', extended: true, parameterLimit: 500000 } }) body: any, req: any, res: any) {
		return this.repository.PostUpdPrecioVentaIva(body);
	}


	/**
  * @description Actualiza precio de venta
  * @author José Alberto Polo Lara
  * SP: [Reporte].[UPD_PRECIOVENTAIVA_SP]
  * Url: http://{server}:{port}/reporte/PostUpdUbicacion
  * Wiki:
  */

	@Post('/PostUpdUbicacion')
	PostUpdUbicacion(@Body({ options: { limit: '50mb', extended: true, parameterLimit: 500000 } }) body: any, req: any, res: any) {
		return this.repository.PostUpdUbicacion(body);
	}


	/**
  * @description Actualiza precio de venta
  * @author José Alberto Polo Lara
  * SP: [Reporte].[UPD_PRECIOVENTAIVA_SP]
  * Url: http://{server}:{port}/reporte/PostUpdSituacion
  * Wiki:
  */

	@Post('/PostUpdSituacion')
	PostUpdSituacion(@Body({ options: { limit: '50mb', extended: true, parameterLimit: 500000 } }) body: any, req: any, res: any) {
		return this.repository.PostUpdSituacion(body);
	}


	/**
  * @description Actualiza columna de baja
  * @author José Alberto Polo Lara
  * SP: [Reporte].[UPD_BAJA_SP]
  * Url: http://{server}:{port}/reporte/PostUpdBaja
  * Wiki:
  */

	@Post('/PostUpdBaja')
	PostUpdBaja(@Body({ options: { limit: '50mb', extended: true, parameterLimit: 500000 } }) body: any, req: any, res: any) {
		return this.repository.PostUpdBaja(body);
	}


	/**
  * @description Inserta registros de documentos en Expediente seminuevos
  * @author José Alberto Polo Lara
  * SP:
  * Url: http://{server}:{port}/reporte/InsDocumentosExpedienteFactura
  * Wiki:
  */

	@Post('/InsDocumentosExpedienteFactura')
	InsDocumentosExpedienteFactura(@Body({ options: { limit: '50mb', extended: true, parameterLimit: 500000 } }) body: any, req: any, res: any) {
		return this.repository.InsDocumentosExpedienteFactura(body);
	}

	@Post('/PostOrdenCompra')
	// #region documentación
	/*
	Nombre:         PostOrdenCompra
	Autor:          Uriel Hernandez
	Fecha:          28/04/2021
	Descripción:    Crea una orden de compra
	SP:             
	Url:            http://{server}:{port}/deflote/PostOrdenCompra
	Wiki:           ...
	*/
	// #endregion
	PostOrdenCompra(@Body() body: Request) {
		return this.repository.PostOrdenCompra(body);
	}


	@Post('/PostComprobantePago')
	// #region documentación
	/*
	Nombre:         PostOrdenCompra
	Autor:          Uriel Hernandez
	Fecha:          28/04/2021
	Descripción:    Crea una orden de compra
	SP:             
	Url:            http://{server}:{port}/deflote/PostOrdenCompra
	Wiki:           ...
	*/
	// #endregion
	PostComprobantePago(@Body() body: Request) {
		return this.repository.PostComprobantePago(body);
	}

	@Post('/PostSubeDocumentosFactura')
	// #region documentación
	/*
	Nombre:         PostOrdenCompra
	Autor:          Uriel Hernandez
	Fecha:          20/05/2021
	Descripción:    Sube los documentos de la factura
	SP:             
	Url:            http://{server}:{port}/deflote/PostSubeDocumentosFactura
	Wiki:           ...
	*/
	// #endregion
	async PostSubeDocumentosFactura(@Body() body: Request) {
		return await this.repository.PostSubeDocumentosFactura(body);
	}

	@Post('/PostSubeDocumentoComprobante')
	// #region documentación
	/*
	Nombre:         PostOrdenCompra
	Autor:          Uriel Hernandez
	Fecha:          20/05/2021
	Descripción:    Sube los documentos de la factura
	SP:             
	Url:            http://{server}:{port}/deflote/PostSubeDocumentoComprobante
	Wiki:           ...
	*/
	// #endregion
	async PostSubeDocumentoComprobante(@Body() body: Request) {
		return await this.repository.PostSubeDocumentoComprobante(body);
	}

	@Post('/PostCopiaDocumentosPdf')
	// #region documentación
	/*
	Nombre:         PostOrdenCompra
	Autor:          Uriel Hernandez
	Fecha:          20/05/2021
	Descripción:    Sube los documentos de la factura
	SP:             
	Url:            http://{server}:{port}/deflote/PostSubeDocumentosPdf
	Wiki:           ...
	*/
	// #endregion
	async PostCopiaDocumentosPdf(@Body() body: Request) {
		return await this.repository.PostCopiaDocumentosPdf(body, '');
	}

	@Post('/PostFacturaEntrega')
	// #region documentación
	/*
	Nombre:         PostOrdenCompra
	Autor:          Uriel Hernandez
	Fecha:          20/05/2021
	Descripción:    Sube los documentos de la factura
	SP:             
	Url:            http://{server}:{port}/deflote/PostFacturaEntrega
	Wiki:           ...
	*/
	// #endregion
	PostFacturaEntrega(@Body() body: Request) {
		return this.repository.PostFacturaEntrega(body);
	}

	@Post('/PostUpdFactura')
	// #region documentación
	/*
	Nombre:         PostOrdenCompra
	Autor:          Uriel Hernandez
	Fecha:          20/05/2021
	Descripción:    Sube los documentos de la factura
	SP:             
	Url:            http://{server}:{port}/deflote/PostUpdFactura
	Wiki:           ...
	*/
	// #endregion
	PostUpdFactura(@Body() body: Request) {
		return this.repository.PostUpdFactura(body);
	}

	@Post('/PostValidaExpediente')
	// #region documentación
	/*
	Nombre:         PostOrdenCompra
	Autor:          Uriel Hernandez
	Fecha:          20/05/2021
	Descripción:    Sube los documentos de la factura
	SP:             
	Url:            http://{server}:{port}/deflote/PostValidaExpediente
	Wiki:           ...
	*/
	// #endregion
	PostValidaExpediente(@Body() body: Request) {
		return this.repository.PostValidaExpediente(body);
	}

	@Post('/PostAsignacionMismaEmpresa')
	// #region documentación
	/*
	Nombre:         PostAsignacionMismaEmpresa
	Autor:          Uriel Hernandez
	Fecha:          24/06/2021
	Descripción:    Sube los documentos de la factura
	SP:             
	Url:            http://{server}:{port}/deflote/PostAsignacionMismaEmpresa
	Wiki:           ...
	*/
	// #endregion
	PostAsignacionMismaEmpresa(@Body() body: Request) {
		return this.repository.PostAsignacionMismaEmpresa(body);
	}

	@Post('/sellUnit')
	sellUnit(@Body() body: Request) {
		return this.repository.sellUnit(body);
	};

	@Post('/deleteVenta')
	deleteVenta(@Body() body: Request) {
		return this.repository.deleteVenta(body);
	};

	@Post('/ObtenerFactura')
	ObtenerFactura(@Body() body: Request) {
		return this.repository.ObtenerFactura(body);
	};

	@Post('/sellUnitDescription')
	sellUnitDescription(@Body() body: Request) {
		return this.repository.sellUnitDescription(body);
	};

	// ************ END Servicios POST ************

	// ************ Servicios PUT ************
	@Put('/updatePrice')
	updatePrice(@Body() body: Request) {
		return this.repository.updatePrice(body);
	};

	@Put('/updUnitDescription')
	updUnitDescription(@Body() body: Request) {
		return this.repository.updUnitDescription(body);
	};

	// ************ END Servicios POST ************

	// ************ Servicios DELETE ************
	// ************ END Servicios DELETE ************
}


function res(req: any, res: any, arg2: (err: any) => void) {
	throw new Error('Function not implemented.');
}
