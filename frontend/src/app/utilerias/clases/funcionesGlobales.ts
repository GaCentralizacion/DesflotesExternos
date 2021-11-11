import { Injectable } from '@angular/core';

@Injectable()
export class FuncionesGlobales {
    constructor() { }

    /**
     * @description             Funcion recursiva para obtener el arbol de hijos de un Nodo padre
     * @param data              Arreglo que debe contener la propiedad Father y Children para armar el árbol recursivo
     * @author                  Antonio Guerra
     */
    public static GetRecursividad(data: any) {
        let modulos = [];

        try {
            data.forEach(node => {
                try {
                    if (!node.father) {
                        node.children = []
                        return modulos.push(node);
                    }
                    const parentIndex = data.findIndex(x => x.id === node.father);
                    if (parentIndex > 0) {
                        if (!data[parentIndex].children) {
                            return data[parentIndex].children = [node];
                        }
                        node.children = []
                        data[parentIndex].children.push(node);
                    }
                } catch (err) {
                    console.log(err);
                }
            });
        } catch (err) {
            console.log(err);
        }
        return modulos;
    }
}