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
import { SeguridadRepository } from '../repository/seguridad.repository';

@JsonController('/seguridad')
export class SeguridadController {
    private repository: SeguridadRepository;

    constructor(repository: SeguridadRepository) {
        this.repository = repository;
    }

    // ************ Servicios GET ************

    
    // ************ END Servicios GET ************

    // ************ Servicios POST ************

   
    // ************ END Servicios POST ************

    // ************ Servicios PUT ************
    // ************ END Servicios POST ************

    // ************ Servicios DELETE ************
    // ************ END Servicios DELETE ************
}