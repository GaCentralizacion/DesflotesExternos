import { global } from 'core-js';


// ********** Middleware Para conectar al servicio de seguridad

import { Middleware, ExpressMiddlewareInterface } from "routing-controllers";
import * as requestPost from 'request';
import { default as config } from '../config';

@Middleware({ type: "before" })
export class SeguridadMiddleware implements ExpressMiddlewareInterface {
    private conf: any;
    constructor() {
        const env: string = process.env.NODE_ENV || 'development';
        this.conf = (config as any)[env];
    }

    use(request: any, response: any, next: any): void {
        if (request.headers != undefined && request.headers != null && request.headers.authorization != undefined && request.headers.authorization != null) {
            global.UserId = request.headers.authorization;
            next(false);
        } else {
            response.status(401).send({ error: 'El usuario no se encuentra autorizado', recordsets: [] })
            // next(false);
        }
    }
}