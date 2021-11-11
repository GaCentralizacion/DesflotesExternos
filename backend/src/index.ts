process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = "0";

import 'reflect-metadata';
import { createExpressServer, useContainer, Action, UnauthorizedError } from 'routing-controllers';
import { Container, ContainerInstance, Token } from 'typedi';
import { default as config } from './config';
import { global } from 'core-js';
import { SeguridadMiddleware } from './controllers/seguridadMiddleware.controller';

import { SeguridadRepository } from './repository/seguridad.repository';
import { SeguridadController } from './controllers/seguridad.controller';
Container.get(SeguridadRepository);


import { CommonRepository } from './repository/common.repository';
import { CommonController } from './controllers/common.controller';
Container.get(CommonRepository);

import { DesfloteReporteRepository } from './repository/desfloteReporte.repository';
import { DesfloteReporteController } from './controllers/desfloteReporte.controller';
Container.get(DesfloteReporteRepository);


global.UserId = 3;
//obtenemos el puerto del conf
const env: string = process.env.NODE_ENV || 'development';
const conf: any = (config as any)[env];
Container.set('ConfigGlobal', conf);

useContainer(Container);



// generamos el Express
let app = createExpressServer({
    cors: true,
    controllers: [ // Cada uno de los controlests de arriba
        SeguridadController,
        CommonController,
        DesfloteReporteController
    ],
    middlewares: [SeguridadMiddleware]
});

// si no se asigna puerto desde el servidor de aplicación
const PORT = process.env.PORT || conf.port;

app.listen(PORT);
console.log(`Running local server on http://localhost:${PORT}`);

