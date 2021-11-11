import { Injectable } from '@angular/core';
import { isArray } from 'util';

@Injectable()
export class Datos {

    /**
     * @description         Función para obtener el nodo Modulo de Seguridad V2
     * @param claveModulo   Key del módulo
     * @param modulos       Nodo 'modules' de seguridad V2
     * @param idClase       Id de la clase que deseamos filtrar
     * @author              Antonio Guerra
     */
    public static GetModulo(claveModulo: string, modulos: any) {
        const modulo: any = modulos.find((mod: any) => mod.key === claveModulo);
        if (!modulo) {
            return [];
        }
        modulo.camposClase = [];
        const m = modulos.find((mod: any) => mod.key === claveModulo);
        // POR CADA OBJETO BUSCAMOS DENTRO DE CAPTIO POR CLASE
        m.objects.forEach(obj => {
            if (obj.caption && obj.caption !== '') {
                const aux = JSON.parse(obj.caption);
                if (aux) {
                    modulo.camposClase.push({
                        nombre: obj.name,
                        label: aux.clase[0].label,
                        path: aux.clase[0].path
                    });
                } else {
                    modulo.camposClase.push({
                        nombre: obj.name,
                        label: '',
                        path: ''
                    });
                }
            } else {
                modulo.camposClase.push({
                    nombre: obj.name,
                    label: '',
                    path: ''
                });
            }
        });
        modulo.breadcrumb = JSON.parse(modulos.find((mod: any) => mod.key === claveModulo).caption).breadcrumb;
        return modulo;
    }

    /**
     * Metodo para generar la configuracion adecuada del BreadcrumbsComponent.
     * @param breadcrumbs Array del breadcrumb configurada desde la base de datos.
     * @param idClase La configuracion final de BreadcrumbsComponent se obtiene mediante el id de la clase.
     * @param parametros Lista de parametros que se agregarán en las url.
     * @returns Array de la configuracion final.
     * @author Andres Farias
     */
    public static GetConfiguracionBreadCrumb(breadcrumbs: any, parametros?: any[]): any[] {
        const breadcrumb = breadcrumbs.route.map((b: any) => {
            if (isArray(b.label)) {
                const labelFound = b.label;
                labelFound.url = b.url;
                return labelFound;
            } else {
                return b;
            }
        });
        breadcrumb.push({ label: 'Logo', url: breadcrumbs.logo[0].path });
        if (parametros) {
            // Reemplazamos los parametros de la url con los valores recibidos en la variable parametros.
            parametros.forEach((parametro) => {
                for (const key in parametro) {
                    if (parametro.hasOwnProperty(key)) {
                        const clave = '{' + key + '}';
                        breadcrumb.forEach((bread, index) => {
                            const breadcrumbConParametros = bread.url.split('/');
                            breadcrumbConParametros.forEach((elem, indexParametros) => {
                                if (elem === clave) {
                                    breadcrumbConParametros[indexParametros] = parametro[key];
                                }
                            });
                            breadcrumb[index].url = breadcrumbConParametros.join('/');
                        });
                    }
                }
            });
            return breadcrumb;
        } else {
            return breadcrumb;
        }

    }
}
