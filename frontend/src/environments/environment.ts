// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  //serviceUrl: 'http://192.168.20.123:4070/',
  serviceUrl: 'http://localhost:4070/',
  seguridadUrl: 'https://apiseguridad.grupoandrade.com/',
  //seguridadUrl: 'http://192.168.20.137:4000/',
  aplicacionesId: 18,
  nombreAplicacion: 'Desflotes Externos',
  excepcionUrl: 'http://192.168.20.137:4001/',
  fileServerUrl: 'http://192.168.20.137:4002/',
  googleAPIkey: 'AIzaSyBOV5YhUsM0c3dKkiXTFVNN0JZhZ4qB7v0',
  firebase: {
    apiKey: 'AIzaSyDajrY7AZrgmno4EiqlWG_dd5xts6xNeHI',
    authDomain: 'coal-dc26f.firebaseapp.com',
    databaseURL: 'https://coal-dc26f.firebaseio.com',
    projectId: 'coal-dc26f',
    storageBucket: 'coal-dc26f.appspot.com'
  },
  envName: 'develop',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
