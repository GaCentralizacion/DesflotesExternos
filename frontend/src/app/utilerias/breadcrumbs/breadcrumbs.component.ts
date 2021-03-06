import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

export interface Breadcrumb {
  label: string;
  url: string;
}

export interface Orden {
  urlImagen: string;
  estado: string;
  ordenCompra: string;
}

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.scss']
})

export class BreadcrumbsComponent implements OnInit {
  // temporalmente idClase hasta ver como se va a rercibir este dato
  @Input() public ruta: Breadcrumb[];
  @Input() public ordenCompra: Orden[];
  public numero = 1;
  clases: any;
  claseName: string;
  rutaActiva: any;
  labelActivo: any;
  rutasHijas: any = [];
  public rutaIcono: any;

  constructor(
    private router: Router, private route: ActivatedRoute) {
    this.rutaActiva = route.routeConfig;
  }

  ngOnInit() {
    let rutaCompara = this.router.routerState.snapshot.url;
    if (rutaCompara === '/') {
      rutaCompara = '/sel-general'
    }
    if (this.ruta) {
      this.ruta.forEach(element => {
        if (element.label == 'Logo') {
          this.rutaIcono = element.url;
        } else if (element.url === rutaCompara) {
          this.labelActivo = element.label;
          delete element.label;
          delete element.url;
        } else {
          const labelhija = element.label === 'home' ? '' : ' ' + element.label;
          this.rutasHijas.push({
            label: labelhija,
            url: element.url
          });
        }
      });
    }
  }
}
