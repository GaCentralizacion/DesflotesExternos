import { Request } from 'express';
import {
    JsonController,
    UploadedFile,
    Body,
    Get,
    Post,
    Req,
    Put,
    Delete,

} from 'routing-controllers';
import { CommonRepository } from '../repository/common.repository';

@JsonController('/common')
export class CommonController {
    private repository: CommonRepository;

    constructor(repository: CommonRepository) {
        this.repository = repository;
    }

    // ************ Servicios GET ************

    /**
     * @description Obtiene el Mapeo de documentos SiscoVSExpediente de seminuevos
     * @author Jose Alberto Polo Lara
     * SP: [Relacion].[SEL_DOCSISCOEXPEDIENTE_SP] 
     * Url: http://{server}:{port}/common/getMapeoDocumentos
     * Wiki: 
     */
    @Get('/getMapeoDocumentos')
    getMapeoDocumentos(@Req() req: Request) {
        return this.repository.getMapeoDocumentos(req.query);
    }

    /**
     * @description Obtiene el Catalogo de estados de la republica mexicana
     * @author Jose Alberto Polo Lara
     * SP: [Catalogo].[SEL_ESTADO_SP] 
     * Url: http://{server}:{port}/common/getEstados
     * Wiki: 
     */
    @Get('/getEstados')
    getEstados(@Req() req: Request) {
        return this.repository.getEstados(req.query);
    }

    /**
     * @description Obtiene el listado de Acciones
     * @author Jose Alberto Polo Lara
     * SP: [Catalogo].[SEL_ACCION_SP] 
     * Url: http://{server}:{port}/common/getAccion
     * Wiki: 
     */
    @Get('/getAccion')
    getAccion(@Req() req: Request) {
        return this.repository.getAccion(req.query);
    }

    /**
     * @description Obtiene el listado de condiciones
     * @author Jose Alberto Polo Lara
     * SP: [Catalogo].[SEL_CONDICION_SP] 
     * Url: http://{server}:{port}/common/getCondicion
     * Wiki: 
     */
    @Get('/getCondicion')
    getCondicion(@Req() req: Request) {
        return this.repository.getCondicion(req.query);
    }

    /**
   * @description Obtiene el listado de columnas configuradas
   * @author Jose Alberto Polo Lara
   * SP: [catalogo].[SEL_COMPANIAUNIDAD_SP] 
   * Url: http://{server}:{port}/common/getCompaniaUnidad
   * Wiki: 
   */
    @Get('/getCompaniaUnidad')
    getCompaniaUnidad(@Req() req: Request) {
        return this.repository.getCompaniaUnidad(req.query);
    }

    /**
   * @description Obtiene el listado de columnas configuradas
   * @author Jose Alberto Polo Lara
   * SP: [Catalogo].[SEL_COLUMNA_SP] 
   * Url: http://{server}:{port}/common/GetObjetoColumnsBase
   * Wiki: 
   */
    @Get('/GetObjetoColumnsBase')
    GetObjetoColumnsBase(@Req() req: Request) {
        return this.repository.GetObjetoColumnsBase(req.query);
    }

    /**
   * @description Obtiene el listado de compañias
   * @author Jose Alberto Polo Lara
   * SP: [Catalogo].[SEL_COMPANIA_SP] 
   * Url: http://{server}:{port}/common/getCompaniaSucursal
   * Wiki: 
   */
    @Get('/getCompaniaSucursal')
    getCompaniaSucursal(@Req() req: Request) {
        return this.repository.getCompaniaSucursal(req.query);
    }

    /**
    * @description Obtiene el listado de estados
    * @author Jose Alberto Polo Lara
    * SP: [Catalogo].[SEL_ESTADOUNIDAD_SP] 
    * Url: http://{server}:{port}/common/getEstado
    * Wiki: 
    */
    @Get('/getEstado')
    getEstado(@Req() req: Request) {
        return this.repository.getEstado(req.query);
    }

    /**
    * @description Obtiene el listado de desflote
    * @author Jose Alberto Polo Lara
    * SP: [Catalogo].[SEL_DESFLOTE_SP] 
    * Url: http://{server}:{port}/common/getDesflote
    * Wiki: 
    */
    @Get('/getDesflote')
    getDesflote(@Req() req: Request) {
        return this.repository.getDesflote(req.query);
    }

    /**
    * @description Obtiene el usuario bpro
    * @author Jose Alberto Polo Lara
    * SP: [bpro].[SEL_DATOSUSUARIO_BPRO_SP] 
    * Url: http://{server}:{port}/common/getusuarioCentralizacion
    * Wiki: 
    */
    @Get('/getusuarioCentralizacion')
    getusuarioCentralizacion(@Req() req: Request) {
        return this.repository.getusuarioCentralizacion(req.query);
    }

    @Get('/getClientes')
    getClientes(@Req() req: Request) {
        return this.repository.getClientes(req.query);
    }

    // ************ END Servicios GET ************

    // ************ Servicios POST ************


    // ************ END Servicios POST ************

    // ************ Servicios PUT ************
    // ************ END Servicios POST ************

    // ************ Servicios DELETE ************
    // ************ END Servicios DELETE ************
}