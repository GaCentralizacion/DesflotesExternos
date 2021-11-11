import * as http from 'http';
import * as https from 'https';
import { IPromise, defer } from 'q';
import * as util from './util.helper';
const request = require('request')

export function postJsonRequest(
   protocolo: string,
   host: string,
   port: string,
   path: string,
   data: any,
   custHeaders?: any): IPromise<any> {
   var deferred = defer<any>();
   const headers = custHeaders ? { 'Content-Type': 'application/json', 'Content-Length': data.length, ...custHeaders } : { 'Content-Type': 'application/json', 'Content-Length': data.length };
   request.post(`${protocolo}://${host}:${port}${path}`, {
      json: data,
      headers: headers
   }, (error: any, res: any, body: any) => {
      if (error) {
         deferred.reject(error);
      } else {
         deferred.resolve(body);
      }
   });
   return deferred.promise;
}

export function sendJsonPost(
   protocolo: string,
   host: string,
   port: number,
   path: string,
   object: any,
   custHeaders?: any
): IPromise<any> {
   const deferred = defer();
   let data = '';
   let headers = {};
   if (object) {
      if (typeof object === 'string') {
         data = object;
      } else {
         data = JSON.stringify(object);
      }
   }

   if (custHeaders) {
      headers = {
         'Content-Type': 'application/json',
         'Content-Length': data.length,
         ...custHeaders
      }
   } else {
      headers = {
         'Content-Type': 'application/json',
         'Content-Length': data.length
      }
   }

   const options = {
      hostname: host,
      port: port,
      path: path,
      method: 'POST',
      headers: headers
   };

   var htt;

   if (protocolo === 'https') {
      htt = https;
   } else {
      htt = http;
   }
   const req = htt.request(options, (res: any) => {

      var body = '';
      res.on('data', (d: any) => {
         body += d;

      });

      res.on('end', () => {
         // Data reception is done, do whatever with it!
         try {
            var parsed = JSON.parse(body);
            deferred.resolve(parsed);
         } catch (e) {
            deferred.reject(e);
         }
      });
   });

   req.on('error', e => {
      deferred.reject(e);
   });

   req.write(data);
   req.end();

   return deferred.promise;
};

export function sendJsonPostArch(
   host: string,
   port: number,
   path: string,
   object: any,
   cb: Function,
   custHeaders?: any
) {

   let data = '';
   let headers = {};
   if (object) {
      if (typeof object === 'string') {
         data = object;
      } else {
         data = JSON.stringify(object);
      }
   }

   if (custHeaders) {
      headers = {
         'Content-Type': 'application/json',
         ...custHeaders
      }
   } else {
      headers = {
         'Content-Type': 'application/json'
      }
   }

   const options = {
      hostname: host,
      port: port,
      path: path,
      method: 'POST',
      headers: headers
   };

   const req = http.request(options, (res: any) => {

      let body: any = [];
      res.on('data', (d: any) => {
         body.push(d);
      });

      res.on('end', () => {
         // Data reception is done, do whatever with it!
         try {
            cb(null, body);
         } catch (e) {
            cb(e, null);
         }
      });
   });

   req.on('error', e => {
      cb(e, null);
   });

   req.write(data);
   req.end();
};

export function sendGet(
   protocolo: string,
   host: string,
   port: number,
   path: string,
   object: any,
   custHeaders?: any
): IPromise<any> {
   const deferred = defer();
   let headers = {};
   let data = '';
   if (object) {
      if (typeof object === 'string') {
         data = object;
      } else {
         data = util.serializeUrl(object);
      }
   }

   if (custHeaders) {
      headers = {
         'Content-Type': 'application/json',
         'Content-Length': data.length,
         ...custHeaders
      }
   } else {
      headers = {
         'Content-Type': 'application/json',
         'Content-Length': data.length,
      }
   }

   const options = {
      hostname: host,
      port: port,
      path: `${path}?${data}`,
      method: 'GET',
      headers: headers
   };

   var htt;
   if (protocolo === 'https') {
      htt = https;
   } else {
      htt = http;
   }
   const req = htt.request(options, (res: any) => {
      var body = '';
      res.on('data', (d: any) => {
         body += d;
      });

      res.on('end', () => {
         // Data reception is done, do whatever with it!
         try {
            var parsed = JSON.parse(body);
            deferred.resolve(parsed);
         } catch (e) {
            deferred.reject(e);
         }
      });
   });

   req.on('error', e => {
      deferred.reject(e);
   });

   req.end();

   return deferred.promise;
};
