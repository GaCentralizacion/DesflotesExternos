import { Component, OnInit, Inject } from '@angular/core';
import { CoalService } from '../../services/coal.service';
import { environment } from '../../../environments/environment';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import {
  IGridOptions,
  IColumns,
  IExportExcel,
  ISearchPanel,
  IScroll,
  Toolbar,
  IColumnHiding,
  ICheckbox,
  IEditing,
  IColumnchooser,
  TiposdeDato,
  TiposdeFormato

} from '../../interfaces';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { BaseService } from '../../../app/services/base.service';
import { Datos } from '../../models/datos.model';
import { DeleteAlertComponent } from '../../../app/utilerias/delete-alert/delete-alert.component';
import { ExcepcionesComponent } from '../../../app/utilerias/excepciones/excepciones.component';
import { AsignaBreadcrumb } from 'app/store/actions/permisos.actions';
import { Store } from '@ngrx/store';
import { AppState } from 'app/store/app.states';
import { AlertDialogComponent } from 'app/utilerias/alert-dialog/alert-dialog.component';
import { DialogAsignar } from './asignar1/asignar-dialog.component';
import { DialogUpdPrecio } from './modal-updPrecio/modal-updPrecio.component';
import { DialogBajaUnidad } from './modal-bajaUnidad/modal-bajaUnidad.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ModalGeneralComponent } from './modal-general/modal-general.component';
import { ModalIntellimotorsComponent } from './modal-intellimotors/modal-intellimotors.component';
import { DialogUpdUbicacion } from './modal-updUbicacion/modal-updUbicacion.component';
import { DialogSituacionUnidad } from './modal-situacionUnidad/modal-situacionUnidad.component';

import { DialogModeloVersion } from './asignarModeloVersion/modelo-version.component';
import { ModalExpedienteComponent } from './modal-expediente/modal-expediente.component';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CdkTreeModule } from '@angular/cdk/tree';

@Component({
  selector: 'app-sel-general',
  templateUrl: './sel-general.component.html',
  styleUrls: ['./sel-general.component.scss'],
  providers: [CoalService]
})
export class SelGeneralComponent implements OnInit {
  claveModulo = 'app-sel-general';
  caja = [];

  // Grid variables
  gridOptions: IGridOptions;
  columnsGeneral = [];
  exportExcel: IExportExcel;
  searchPanel: ISearchPanel;
  scroll: IScroll;
  toolbarGeneral: Toolbar[];
  columnHiding: IColumnHiding;
  Checkbox: ICheckbox;
  Editing: IEditing;
  Columnchooser: IColumnchooser;
  sucAceptanSeminuevos: any = [];
  lat = 19.787222;
  lng = -97.514167;
  zoom: number = 16
  primera: number = 0;
  segunda: number = 0;
  datosevent: any = [];
  modulo: any;
  breadcrumb: any;
  spinner = false;
  activaTab = true;
  lstUnidadCompania = [];
  objetosSelected;
  lstDataReport = [];
  dataReport = [];
  verGrid = false;
  lstEstado = [];
  lstbPro = [];
  companias = [];
  lstDesflote = [];
  lstMapeoDocumentos = [];
  distribuidores = [];
  fecha: string;
  idEstado: number;
  historialCaja = [];
  listadoSerie = "";
  porcentajePrimera: number;
  porcentajeSegunda: number;
  facturasPendientesPrimera: number;
  ordenesPendientesPrimera: number;
  facturasPendientesSegunda: number;
  ordenesPendientesSegunda: number;
  getGeneralForm = new FormGroup({
    idDuenoUnidad: new FormControl('', [Validators.required]),
    idDesflote: new FormControl('', [Validators.required]),
    idEstado: new FormControl(''),
  });

  idMarca;
  idMarcaFinal = '';
  idMarcaFinal12 = '';

  reporte = [];
  idUsuario: any;
  data = []
  catalogoModelo: any = [];
  catalogoVersion: any = [];
  columnas2 = [
    // {
    //   caption: 'Id unidad',
    //   dataField: 'unidadId',
    //   // fixed: true,
    //   allowEditing: false,
    //   cssClass: 'general'
    // },
    {
      caption: 'VIN',
      dataField: 'numeroSerie',
      fixed: true,
      allowEditing: false,
      cssClass: 'general'
    },
    {
      caption: 'Submarca',
      dataField: 'submarca',
      allowEditing: false,
      fixed: true,
      cssClass: 'general'
    },
    {
      caption: 'Ubicación actual',
      // dataField: 'numeroSerie',
      allowEditing: false,
      cssClass: 'general',
      cellTemplate: 'mapa'
    },
    // {
    //   caption: 'Traslados',
    //   dataField: 'traslados',
    //   cellTemplate: 'trasladosTemplate'
    // },
    {
      caption: 'Primera Asignación',
      dataField: 'compania1',
      allowEditing: false,
      cssClass: 'asignacion1'
    },
    {
      caption: 'Orden de compra 1',
      dataField: 'ordenCompra1',
      cellTemplate: 'cellTemplate',
      allowEditing: false,
      cssClass: 'asignacion1'
    },
    {
      caption: 'Documentos',
      dataField: 'documentosPrimera',
      cellTemplate: 'documentoModal',
      allowEditing: false,
      cssClass: 'asignacion1'
    },
    {
      caption: 'Factura1',
      dataField: 'factura1',
      allowEditing: false,
      cssClass: 'asignacion1',
      cellTemplate: 'pdfFactura'
    },

    {
      caption: 'Baja',
      dataField: 'baja',
      allowEditing: false,
      cssClass: 'asignacion1',

    },

    {
      caption: 'Precio Final a facturar',
      dataField: 'precioVenta1',
      dataType: TiposdeDato.number,
      format: TiposdeFormato.moneda,
      allowEditing: false,
      cssClass: 'asignacion1'
    },
    {
      caption: 'Pagada',
      dataField: 'estatusFactura1',
      allowEditing: false,
      cssClass: 'asignacion1',
      cellTemplate: 'fotoFactura'
    },
    {
      caption: 'Ubicacion actual de la unidad',
      dataField: 'ubicacion',
      cellTemplate: 'linkTraslados',
      allowEditing: false,
      cssClass: 'asignacion1'
    },
    {
      caption: 'Datos Intelimotors',
      dataField: 'datosIntelimotors',
      dataType: 'string',
      allowEditing: false,
      cssClass: 'asignacion1'
    },
    // {
    //   caption: 'Versión',
    //   dataField: 'versionIntelimotors',
    //   dataType: 'string',
    //   allowEditing: false,
    //   cssClass: 'asignacion1'
    // },
    {
      caption: 'Segunda Asignacion',
      dataField: 'compania2',
      allowEditing: false,
      cssClass: 'asignacion2'
    },
    {
      caption: 'Sucursal 2',
      dataField: 'sucursal2',
      allowEditing: false,
      cssClass: 'asignacion2'
    },
    {
      caption: 'Cotización',
      dataField: 'folioCotizacion',
      allowEditing: false,
      cssClass: 'asignacion2'
    },
    {
      caption: 'Orden de compra 2',
      dataField: 'ordenCompra2',
      cellTemplate: 'cellTemplate',
      allowEditing: false,
      cssClass: 'asignacion2'
    },
    {
      caption: 'Documentos',
      dataField: 'documentos',
      cellTemplate: 'documentoModal2',
      allowEditing: false,
      cssClass: 'asignacion2'
    },
    {
      caption: 'Factura 2',
      dataField: 'factura2',
      allowEditing: false,
      cssClass: 'asignacion2',
      cellTemplate: 'pdfFacturaSegunda'
    },
    {
      caption: 'Pagada',
      dataField: 'estatusFactura2',
      allowEditing: false,
      cssClass: 'asignacion2',
      cellTemplate: 'fotoFactura'
    },
    {
      caption: 'Precio Final a facturar 2',
      dataField: 'precioVenta2',
      dataType: TiposdeDato.number,
      format: TiposdeFormato.moneda,
      allowEditing: false,
      cssClass: 'asignacion2'
    },
    {
      caption: 'Factura Cliente',
      dataField: 'facturaCliente',
      allowEditing: false,
      cssClass: 'cliente',
      cellTemplate: 'pdfFacturaCliente'
    },
    {
      caption: 'Vendido a',
      dataField: 'vendido',
      allowEditing: false,
      cssClass: 'cliente'
    },
    {
      caption: 'Precio Final',
      dataField: 'precioFinal',
      dataType: TiposdeDato.number,
      format: TiposdeFormato.moneda,
      allowEditing: false,
      cssClass: 'cliente'
    },
    {
      caption: 'Utilidad',
      dataField: 'utilidad',
      dataType: TiposdeDato.number,
      format: TiposdeFormato.moneda,
      allowEditing: false,
      cssClass: 'cliente'
    },
  ];
  toolbar = []
  idCompania: any;
  idDesflote: any;
  catalogoMarcas: any;
  pdf: any;
  mostrarLectura: any = false;

  constructor(
    public dialog: MatDialog,
    private coalService: CoalService,
    private baseService: BaseService,
    private router: Router,
    private snackBar: MatSnackBar,
    private store: Store<AppState>,
  ) {
    this.store.dispatch(new AsignaBreadcrumb({
      breadcrumb: null
    }));
  }

  ngOnInit() {
    const getStateUser = this.baseService.getUserData();
    this.idUsuario = getStateUser.user.id
    this.modulo = Datos.GetModulo(this.claveModulo, getStateUser.permissions.modules);
    if (this.modulo.breadcrumb) {
      this.breadcrumb = Datos.GetConfiguracionBreadCrumb(this.modulo.breadcrumb);
      this.store.dispatch(new AsignaBreadcrumb({
        breadcrumb: this.breadcrumb
      }));
    }
    if (this.modulo.camposClase.find(x => x.nombre === 'LogoCard')) {
      this.mostrarLectura = true;
    }

    this.getCompaniaUnidad();
    this.getEstado();
    this.getCompania();
    this.getDesflote();
    this.usuarioCentralizacion(getStateUser.usuarioBpro)
    this.ObjectGrid();
  }


  contarUnidadesProcesadas() {

    this.coalService.getService(`reporte/getUnidadesProcesadas`).subscribe(
      (res: any) => {
        if (res.err) {
          this.Excepciones(res.err, 4);

        } else if (res.excepcion) {
          this.Excepciones(res.excepcion, 3);

        } else {

          this.primera = res.recordsets[0][0].contadorPrimera;
          this.segunda = res.recordsets[1][0].contadorSegunda;
        }
      }, (error: any) => {

        this.Excepciones(error, 2);
      }
    );


  }


  usuarioCentralizacion(usuarioBpro) {
    this.lstbPro = [];
    this.coalService.getService(`common/getusuarioCentralizacion?idUsuarioBpro=${usuarioBpro}`).subscribe(
      (res: any) => {
        if (res.err) {
          this.Excepciones(res.err, 4);
        } else if (res.excepcion) {
          this.Excepciones(res.excepcion, 3);
        } else {
          this.lstbPro = res.recordsets[0];
        }
      }, (error: any) => {
        this.Excepciones(error, 2);
      }
    );
  }
  porcentajeAvances() {
    this.coalService.getService(`reporte/porcentajeAvances?idCompaniaUnidad=${this.idCompania}&idDesflote=${this.idDesflote}`).subscribe(
      (res: any) => {
        if (res.err) {
          this.Excepciones(res.err, 4);
        } else if (res.excepcion) {
          this.Excepciones(res.excepcion, 3);
        } else {
          this.porcentajePrimera = res.recordsets[0][0].porcentajePrimera;
          this.porcentajeSegunda = res.recordsets[1][0].porcentajeSegunda;
          this.facturasPendientesPrimera = res.recordsets[2][0].facturasPendientesPrimera;
          this.ordenesPendientesPrimera = res.recordsets[3][0].ordenesPendientesPrimera;
          this.facturasPendientesSegunda = res.recordsets[4][0].facturasPendientesSegunda;
          this.ordenesPendientesSegunda = res.recordsets[5][0].ordenesPendientesSegunda;
        }
      }, (error: any) => {
        this.Excepciones(error, 2);
      }
    );
  }

  GenerateReport() {
    this.verGrid = false;
    this.spinner = true;
    this.lstDataReport = [];
    this.dataReport = [];
    this.idCompania = this.getGeneralForm.controls.idDuenoUnidad.value;
    this.idDesflote = this.getGeneralForm.controls.idDesflote.value;
    this.porcentajeAvances()
    this.coalService.getService(`reporte/GetDataReport?idCompania=${this.idCompania}&idDesflote=${this.idDesflote}`).subscribe(
      (res: any) => {
        if (res.err) {
          this.Excepciones(res.err, 4);
        } else if (res.excepcion) {
          this.Excepciones(res.excepcion, 3);
        } else {
          for (const e of res.recordsets[0]) {
            e.fechaFin = this.FechaDiaCorrecto(e.fechaFin)
            e.fechaInicio = this.FechaDiaCorrecto(e.fechaInicio)
          }
          // this.contarUnidadesProcesadas();
          this.reporte = res.recordsets[0];
          // this.data = this.reporte.filter(x => x.llaveEstado !== 'SIA')
          const datos = [];
          this.reporte.forEach(val => datos.push(Object.assign({}, val)));
          this.data = datos.filter(x => x.llaveEstado !== 'SIA')
          const arregloDoc = ['./assets/images/iconos-coal/doc/comprobantes.pdf', './assets/images/iconos-coal/doc/comprobante2.pdf', './assets/images/iconos-coal/doc/comprobante3df.pdf']
          // for (const e of this.data) {
          //   e.estatusFactura1 = arregloDoc[Math.floor(Math.random() * arregloDoc.length)]
          //   e.estatusFactura2 = arregloDoc[Math.floor(Math.random() * arregloDoc.length)]
          // }


          this.data.forEach(x => {
            if (x.datosIntelimotors === 0) {
              x.opacity = 0.2
            }
          })
          for (const e of this.reporte) {
            if (e.llaveEstado !== 'SIA') {
              e.backgroundcolor = '#a4b3f5'
            } else {
              if (e.estatusOrden === 'PEN1') {
                e.backgroundcolor = '#ffea4d'
                e.estado = 'PENDIENTE'
              } else if (e.estatusOrden === 'PEN2') {
                e.backgroundcolor = '#ffea4d'
                e.factura2 = 'PENDIENTE'
                e.ordenCompra2 = 'PENDIENTE'
              }
            }

            // if (e.estatusOrden === 'PEN2') {
            //   e.estado = 'PENDIENTE 2'
            //   e.backgroundcolor = '#ffea4d'
            //   e.factura2 = 'PENDIENTE'
            //   e.ordenCompra2 = 'PENDIENTE'
            // }
          }

          for (const e of this.data) {
            if (e.estatusOrden === 'PEN2') {
              e.backgroundcolor = '#ffea4d'
              e.factura2 = 'PENDIENTE'
              e.ordenCompra2 = 'PENDIENTE'
            }
          }
          this.verGrid = true;
        }
        this.spinner = false;
      }, (error: any) => {
        this.Excepciones(error, 2);
        this.spinner = false
      }
    );
  }

  FechaDiaCorrecto(fecha) {
    return new Date(new Date(fecha).getTime() + new Date(fecha).getTimezoneOffset() * 60000)
  }

  sincronizarDocumentos() {
    const dialogRef = this.dialog.open(AlertDialogComponent,
      {
        width: '350px',
        data: '¿Desea Sincronizar documentos?'
      }
    );
    dialogRef.afterClosed().subscribe(resultado => {
      if (resultado) {
        this.spinner = true;
        this.lstMapeoDocumentos = [];
        let unidadesSeleccionadas = {
          unidadesSeleccionadas: this.datosevent
        }
        this.coalService.postService(`reporte/InsDocumentosExpediente`, unidadesSeleccionadas).subscribe(
          (res: any) => {
            if (res.err) {
              this.Excepciones(res.err, 4);
            } else if (res.excepcion) {
              this.Excepciones(res.excepcion, 3);
            } else {
              console.log(res.recordsets[0]);
              this.spinner = false;
              // this.lstMapeoDocumentos = res.recordsets[0];
              // console.log(this.lstMapeoDocumentos);
              // let body = {
              //   ArregloDocumentos: this.lstMapeoDocumentos
              // }
              // if (this.lstMapeoDocumentos != null && this.lstMapeoDocumentos.length > 0) {
              //   this.coalService.postService(`reporte/ArregloDocumentos`, body).subscribe(
              //     (res: any) => {
              //       if (res.err) {
              //         this.Excepciones(res.err, 4);
              //       } else if (res.excepcion) {
              //         this.Excepciones(res.excepcion, 3);
              //       } else {
              //         this.snackBar.open('Sincronizando Documentación', 'Ok', { duration: 5000 });
              //         this.spinner = false
              //       }
              //       this.spinner = false
              //     }, (error: any) => {
              //       this.Excepciones(error, 2);
              //       this.spinner = false
              //     }
              //   )
              // } else {
              //   this.snackBar.open('No hay documentos a sincronizar', 'Ok', { duration: 5000 });
              // }
            }
            this.spinner = false
          }, (error: any) => {
            this.Excepciones(error, 2);
            this.spinner = false
          }
        )
      } else {
        this.snackBar.open('Sincronización cancelada', 'Ok', { duration: 5000 });
      }
    });
  }

  getCompaniaUnidad() {
    this.coalService.getService(`common/getCompaniaUnidad`).subscribe(
      (res: any) => {
        if (res.err) {
          this.Excepciones(res.err, 4);
        } else if (res.excepcion) {
          this.Excepciones(res.excepcion, 3);
        } else {
          this.lstUnidadCompania = res.recordsets[0];
        }
      }, (error: any) => {
        this.Excepciones(error, 2);
      }
    );
  }

  getEstado() {
    this.coalService.getService(`common/getEstado`).subscribe(
      (res: any) => {
        if (res.err) {
          this.Excepciones(res.err, 4);
        } else if (res.excepcion) {
          this.Excepciones(res.excepcion, 3);
        } else {
          this.lstEstado = res.recordsets[0];
        }
      }, (error: any) => {
        this.Excepciones(error, 2);
      }
    );
  }

  getCompania() {
    this.coalService.getService(`common/getCompaniaSucursal`).subscribe(
      (res: any) => {
        if (res.err) {
          this.Excepciones(res.err, 4);
        } else if (res.excepcion) {
          this.Excepciones(res.excepcion, 3);
        } else {
          this.companias = res.recordsets[0];
          this.catalogoMarcas = res.recordsets[2];
          this.sucAceptanSeminuevos = res.recordsets[3];
        }
      }, (error: any) => {
        this.Excepciones(error, 2);
      }
    );
  }

  getDesflote() {
    this.coalService.getService(`common/getDesflote`).subscribe(
      (res: any) => {
        if (res.err) {
          this.Excepciones(res.err, 4);
        } else if (res.excepcion) {
          this.Excepciones(res.excepcion, 3);
        } else {
          this.lstDesflote = res.recordsets[0];
        }
      }, (error: any) => {
        this.Excepciones(error, 2);
      }
    );
  }

  ChangeTab($event) {
    // console.log(this.lstTipoReporte[$event.index].idTipoReporte);
    this.verGrid = false;
    setTimeout(() => this.verGrid = true, 800);
  }

  AsignacionMismaEmpresa(unidades) {
    this.spinner = true;
    let xmlUnidadesAsignar = `<unidades>`
    for (const e of unidades) {
      xmlUnidadesAsignar += `<unidad><idUnidad>${e.idUnidad}</idUnidad><idCompania>${e.idCompania1}</idCompania><idSucursal>${e.idSucursal1}</idSucursal><ordenCompra>${e.ordenCompra1}</ordenCompra><numeroSerie>${e.numeroSerie}</numeroSerie></unidad>`
    }
    xmlUnidadesAsignar += `</unidades>`
    const data = {
      xmlUnidadesAsignar
    }
    this.coalService.postService(`reporte/PostAsignacionMismaEmpresa`, data).subscribe(
      (res: any) => {
        if (res.err) {
          this.spinner = false
          this.Excepciones(res.err, 4);
        } else if (res.excepcion) {
          this.spinner = false
          this.Excepciones(res.excepcion, 3);
        } else {
          this.snackBar.open(res.recordsets[0][0].mensaje, 'Ok', { duration: 5000 });

          this.GenerateReport();
        }
      }, (error: any) => {
        this.Excepciones(error, 2);
        this.spinner = false
      }
    )
  }

  GenerarCotizacion(unidades, result) {
    const body = {
      idUsuarioBpro: this.lstbPro[0].idUsuarioBpro,
      idCompania: result.valorSelect.idCompania,
      idSucursal: result.valorSelect.idSucursal,
      rfcCompania: result.valorSelect.rfcCompania,
      unidadesSeleccionadas: unidades
    }
    this.spinner = true;
    this.coalService.postService(`reporte/PostGenerarCotizacion`, body).subscribe(
      (res: any) => {
        if (res.err) {
          this.spinner = false
          this.Excepciones(res.err, 4);
        } else if (res.excepcion) {
          this.spinner = false
          this.Excepciones(res.excepcion, 3);
        } else {
          this.snackBar.open(res.recordsets[0][0].mensaje, 'Ok', { duration: 5000 });

          this.GenerateReport();
        }
      }, (error: any) => {
        this.Excepciones(error, 2);
        this.spinner = false
      }
    )
  }

  asignacion(datos, tipo) {
    const data = []
    for (const e of this.datosevent) {
      this.spinner = true
      let fechaFactura
      let factura
      let precioCompra;
      let precioVenta;
      if (tipo === 'PRIMERA') {
        factura = e.factura1
        fechaFactura = this.FormatoFecha(this.FechaDiaCorrecto(e.fechaFactura1))
        precioCompra = e.precioVenta1
        precioVenta = (precioCompra + ((precioCompra / 100) * 10))
      } else {
        fechaFactura = this.FormatoFecha(this.FechaDiaCorrecto(e.fechaFactura2))
        factura = e.factura2
        // precioCompra = e.precioCompra2
        // precioVenta = e.precioVenta2
        precioCompra = e.precioVenta1
        precioVenta = (precioCompra + ((precioCompra / 100) * 10))
      }
      // tslint:disable-next-line:max-line-length
      const marca = this.catalogoMarcas.filter(x => x.Marca === e.marca.toUpperCase() && x.idCompania === datos.valorSelect.idCompania && x.idSucursal === datos.valorSelect.idSucursal)
      const fecha = new Date();
      const fechaFormato = this.FormatoFecha(new Date(fecha.setDate(fecha.getDate() + 2)));
      const fechaPedimento = this.FormatoFecha(this.FechaDiaCorrecto(e.fechaPedimento))
      const fechaPromesa = this.FormatoFecha(this.FechaDiaCorrecto(e.fechaPromesa))
      const fechaAnticipo = this.FormatoFecha(this.FechaDiaCorrecto(e.fechaAnticipo))
      const tiempoPromesa = this.FormatoTiempo();
      let rfcCompania = ''
      let idProveedor = 0
      if (tipo === 'PRIMERA') {
        rfcCompania = e.rfcCompania
        idProveedor = e.idProveedorCompania
      } else if (tipo === 'SEGUNDA') {
        rfcCompania = e.rfcCompania1
        idProveedor = e.idProveedorCompania1
      }
      data.push({
        idUnidad: e.unidadId,
        asignacion: tipo,
        IdEmpresa: datos.valorSelect.idCompania,
        IdSucursal: datos.valorSelect.idSucursal,
        RfcCompaniaAsignacion: datos.valorSelect.rfcCompania,
        rfcCompania,
        NumeroSerie: e.numeroSerie,
        Marca: marca[0].idMarca,
        Modelo: e.submarca,
        AnioModelo: parseInt(e.modelo),
        ClaveVehicular: e.claveVehicular,
        Kilometraje: e.kilometraje,
        Placas: e.placas,
        ColorInterior: e.colorInterior,
        ColorExterior: e.colorExterior,
        Combustible: e.idCombustible,
        Transmision: e.idTransmision,
        TipoUnidad: e.idTipoUnidad,
        Ubicacion: e.idUbicacion,
        TipoAdquisicion: datos.valorSelect.tipoAdquisicion,
        OrigenUnidad: e.idOrigenUnidad,
        OrigenMotor: e.idOrigenMotor,
        CompraToma: datos.valorSelect.tomaCompra,
        FacturaCompra: factura,
        FechaFactura: fechaFactura,
        Moneda: e.idMoneda,
        Aduana: datos.valorSelect.idAduana,
        NoPedimento: e.noPedimento,
        FechaPedimento: fechaPedimento,
        SerieImportacion: e.serieImportacion,
        Proveedor: idProveedor,
        // Proveedor: 21654,
        PrecioCompraIva: precioCompra,
        PrecioVentaIva: precioVenta,
        FechaPromesa: fechaFormato,
        HoraPromesa: tiempoPromesa,
        Vendedor: e.idVendedor,
        // Vendedor: 57001,
        NoMotor: e.noMotor,
        Cilindros: e.cilindros,
        Capacidad: e.capacidad,
        Puertas: e.puertas,
        EstadoPlacas: e.idEstadoPlacas,
        CalcomaniaLegalizacion: e.calcomaniaLegalizacion,
        Comentarios: e.comentarios,
        Anticipo: 0,
        CantidadAnticipo: 0,
        PorcentajeAnticipo: 0,
        FechaAnticipo: fechaAnticipo,
        idUsuarioBpro: this.lstbPro[0].idUsuarioBpro,
      })
    }
    this.spinner = true
    this.ProcesaCompra(data, tipo);
    // if (tipo === 'PRIMERA') {
    //   this.ProcesaCompra(data);
    // } else {
    //   this.ProcesaSegundaCompra(data);
    // }
  }

  FormatoTiempo() {
    const fecha = new Date()
    const h = fecha.getHours();
    const m = fecha.getMinutes();
    const s = fecha.getSeconds();
    const ms = fecha.getMilliseconds();
    return h + ':' + m + ':' + s + '.000';
  }

  FormatoFecha(inputFormat) {
    function pad(s) { return (s < 10) ? '0' + s : s; }
    const d = new Date(inputFormat)
    return [d.getFullYear(), pad(d.getMonth() + 1), pad(d.getDate())].join('-')
  }

  ProcesaCompra(datos, tipo) {
    this.spinner = true;
    const data = {
      datos,
      tipo
    }
    this.coalService.postService(`reporte/PostOrdenCompra`, data).subscribe(
      (res: any) => {
        this.spinner = false
        if (res.err) {
          this.Excepciones(res.err, 4);
        } else if (res.excepcion) {
          this.Excepciones(res.excepcion, 3);
        } else {
          const unidadesMal = res.filter(x => x.estatus === 500)
          const unidadesBien = res.filter(x => x.estatus === 200)
          if (unidadesMal && unidadesMal.length >= 1) {
            for (const e of unidadesMal) {
              if (JSON.parse(e.message).Message) {
                e.mensaje = JSON.parse(e.message).Message
              } else if (JSON.parse(e.message).Mensaje) {
                e.mensaje = JSON.parse(e.message).Mensaje
              } else if (JSON.parse(e.message).description) {
                e.mensaje = JSON.parse(e.message).description
              }
            }
            const dialogRef = this.dialog.open(ModalIntellimotorsComponent, {
              disableClose: false,
              width: '100%',
              data: {
                unidades: unidadesMal
              }
            });
            dialogRef.afterClosed().subscribe(result => {
            })
          }
          if (unidadesBien && unidadesBien.length >= 1 && tipo === 'PRIMERA') {
            this.spinner = true;
            // this.ValidaExpediente(unidadesBien)
            setTimeout(() => {
              this.PostCopiaDocumentosPdf(unidadesBien);
            }, 30000);
          }
          this.GenerateReport();

        }
      }, (error: any) => {
        this.spinner = false
        this.Excepciones(error, 2)
      }
    )
  }

  ValidaExpediente(arr) {
    this.spinner = true
    let xmlOrdenCompra = `<ordenes>`
    for (const e of arr) {
      xmlOrdenCompra += `<orden><ordenCompra>${e.ordenComora}</ordenCompra></orden>`
    }
    xmlOrdenCompra += `</ordenes>`
    const datos = {
      xmlOrdenCompra
    }
    this.coalService.postService(`reporte/PostValidaExpediente`, datos).subscribe(
      (res: any) => {
        this.spinner = true
        if (res.err) {
          this.Excepciones(res.err, 4);
        } else if (res.excepcion) {
          this.Excepciones(res.excepcion, 3);
        } else {
          this.PostCopiaDocumentosPdf(arr);
        }
      }, (error: any) => {
        this.spinner = true
        this.Excepciones(error, 2);
      }
    );
  }

  PostCopiaDocumentosPdf(arr) {
    // arr = [{
    //   RfcCompaniaAsignacion: "AUN1402117H9"
    //   , asignacion: "PRIMERA"
    //   , estatus: 200
    //   , facturacion: "GA000019128"
    //   , folio: "AU-AU-UNI-US-PE-1346"
    //   , idCompania: 1
    //   , idSucursal: 3
    //   , idUnidad: 180446
    //   , idUsuarioBpro: 71
    //   , message: '{\"Codigo\":\"200 OK\",\"Mensaje\":\"Se ha generado la orden de compra correctamente.\",\"idEmpresa\":\"1\",    ,\"Empresa\":\"ANDRADE UNIVERSIDAD SA DE CV\",\"idSucursal\":\"3\",\"Sucursal\":\"UNIVERSIDAD\",\"OrdenCompra\":\"AU-AU-UNI-US-PE-1346\",    ,\"NoInventarioDMS\":\"202157\"}'
    //   , numeroSerie: "1C4HJXDG2KW644616"
    //   , ordenCompra: "AU-AU-UNI-US-PE-1346"
    //   , proveedor: 113
    //   , rfcCompania: "AAN910409I35"
    //   , validacion: false
    // }]
    this.spinner = true
    this.coalService.postService(`reporte/PostCopiaDocumentosPdf`, arr).subscribe(
      (res: any) => {
        if (res.err) {
          this.Excepciones(res.err, 4);
        } else if (res.excepcion) {
          this.Excepciones(res.excepcion, 3);
        } else {
          const datos = res.filter(x => x.validacion === true);
          if (datos.length > 0) {
            setTimeout(() => {
              this.PostSubeDocumentosFactura(arr);
            }, 1000);
          }
        }
        this.spinner = false
      }, (error: any) => {
        this.spinner = false
        this.Excepciones(error, 2)
      })
  }

  PostSubeDocumentosFactura(arr) {
    // arr = [{
    //   RfcCompaniaAsignacion: "AUN1402117H9"
    //   , asignacion: "PRIMERA"
    //   , estatus: 200
    //   , facturacion: "GA000019119"
    //   , folio: "AU-AU-UNI-US-PE-1340"
    //   , idCompania: 1
    //   , idSucursal: 3
    //   , idUnidad: 180439
    //   , idUsuarioBpro: 71
    //   , message: "{\"Codigo\":\"200 OK\",\"Mensaje\":\"Se ha generado la orden de compra correctamente.\",\"idEmpresa\":\"1\",,\"Empresa\":\"ANDRADE UNIVERSIDAD SA DE CV\",\"idSucursal\":\"3\",\"Sucursal\":\"UNIVERSIDAD\",\"OrdenCompra\":\"AU-AU-UNI-US-PE-1340\",,\"NoInventarioDMS\":\"202151\"}"
    //   , numeroSerie: "1C4HJXDG2KW633759"
    //   , ordenCompra: "AU-AU-UNI-US-PE-1340"
    //   , proveedor: 113
    //   , rfcCompania: "AAN910409I35"
    // }]
    this.spinner = true
    this.coalService.postService(`reporte/PostSubeDocumentosFactura`, arr).subscribe(
      (res: any) => {
        if (res.err) {
          this.Excepciones(res.err, 4);
        } else if (res.excepcion) {
          this.Excepciones(res.excepcion, 3);
        } else {
          const datos = res.filter(x => x.validacion === true);
          if (datos.length > 0) {
            this.PostSubeDocumentoComprobante(datos);
          }
        }
        this.spinner = false
      }, (error: any) => {
        this.spinner = false
        this.Excepciones(error, 2)
      })
  }

  PostSubeDocumentoComprobante(arr) {
    // arr = [{
    //   RfcCompaniaAsignacion: "AUN1402117H9"
    //   , asignacion: "PRIMERA"
    //   , estatus: 200
    //   , facturacion: "GA000019119"
    //   , folio: "AU-AU-UNI-US-PE-1340"
    //   , idCompania: 1
    //   , idSucursal: 3
    //   , idUnidad: 180439
    //   , idUsuarioBpro: 71
    //   , message: '{\"Codigo\":\"200 OK\",\"Mensaje\":\"Se ha generado la orden de compra correctamente.\",\"idEmpresa\":\"1\",,,\"Empresa\":\"ANDRADE UNIVERSIDAD SA DE CV\",\"idSucursal\":\"3\",\"Sucursal\":\"UNIVERSIDAD\",\"OrdenCompra\":\"AU-AU-UNI-US-PE-1340\",,,\"NoInventarioDMS\":\"202151\"}'
    //   , numeroSerie: "1C4HJXDG2KW633759"
    //   , ordenCompra: "AU-AU-UNI-US-PE-1340"
    //   , proveedor: 113
    //   , rfcCompania: "AAN910409I35"
    //   , validacion: true
    // }]
    this.spinner = true
    this.coalService.postService(`reporte/PostSubeDocumentoComprobante`, arr).subscribe(
      (res: any) => {
        if (res.err) {
          this.Excepciones(res.err, 4);
        } else if (res.excepcion) {
          this.Excepciones(res.excepcion, 3);
        } else {
          const datos = res.filter(x => x.validacion === true);
          if (datos.length > 0) {
            this.PostFacturaEntrega(datos);
          }
        }
        this.spinner = false
      }, (error: any) => {
        this.spinner = false
        this.Excepciones(error, 2)
      })
  }

  PostFacturaEntrega(datos) {
    this.spinner = true
    this.coalService.postService(`reporte/PostFacturaEntrega`, datos).subscribe(
      (res: any) => {
        if (res.err) {
          this.Excepciones(res.err, 4);
        } else if (res.excepcion) {
          this.Excepciones(res.excepcion, 3);
        } else {
          console.log(res);
          this.sincronizarDocumentos()
        }
        this.spinner = false
      }, (error: any) => {
        this.spinner = false
        this.Excepciones(error, 2)
      })
  }

  ProcesaSegundaCompra(datos) {
    this.spinner = true;
    this.coalService.postService(`reporte/PostOrdenSegundaCompra`, datos).subscribe(
      (res: any) => {
        if (res.err) {
          this.Excepciones(res.err, 4);
        } else if (res.excepcion) {
          this.Excepciones(res.excepcion, 3);
        } else {
          const unidadesMal = res.filter(x => x.estatus === 500)
          if (unidadesMal && unidadesMal.length >= 1) {
            for (const e of unidadesMal) {
              if (JSON.parse(e.message).Message) {
                e.mensaje = JSON.parse(e.message).Message
              } else if (JSON.parse(e.message).Mensaje) {
                e.mensaje = JSON.parse(e.message).Mensaje
              } else if (JSON.parse(e.message).description) {
                e.mensaje = JSON.parse(e.message).description
              }
            }
            const dialogRef = this.dialog.open(ModalIntellimotorsComponent, {
              disableClose: false,
              width: '100%',
              data: {
                unidades: unidadesMal
              }
            });
            dialogRef.afterClosed().subscribe(result => {
            })
          }
          this.GenerateReport();
        }
        this.spinner = false
      }, (error: any) => {
        this.spinner = false
        this.Excepciones(error, 2)
      }
    )
  }

  Alerta() {
    this.AlertDialog('Por favor de verificar');
  }


  AlertDialog(message: string) {
    try {
      const dialogRef = this.dialog.open(AlertDialogComponent, {
        width: '500px',
        data: {
          message
        }
      });

      dialogRef.afterClosed().subscribe((result: any) => { });
    } catch (error) {
      this.Excepciones(error, 1);
    }
  }

  ObjectGrid() {
    this.toolbarGeneral = [];
    /*
   Columnas de la tabla
   */
    try {

      /*
      Parametros de Paginacion de Grit
      */
      const pageSizes = ['10', '25', '50', '100'];

      /*
      Parametros de Exploracion
      */
      this.exportExcel = { enabled: true, fileName: 'Historico' };
      // ******************PARAMETROS DE COLUMNAS RESPONSIVAS EN CASO DE NO USAR HIDDING PRIORITY**************** */
      this.columnHiding = { hide: true };
      // ******************PARAMETROS DE PARA CHECKBOX**************** */
      this.Checkbox = { checkboxmode: 'multiple' };  // *desactivar con none*/
      // ******************PARAMETROS DE PARA EDITAR GRID**************** */
      this.Editing = { allowupdate: true, mode: 'cell' }; // *cambiar a batch para editar varias celdas a la vez*/
      // ******************PARAMETROS DE PARA SELECCION DE COLUMNAS**************** */
      this.Columnchooser = { columnchooser: true };

      /*
      Parametros de Search
      */
      this.searchPanel = {
        visible: true,
        width: 200,
        placeholder: 'Buscar...',
        filterRow: true
      };

      /*
      Parametros de Scroll
      */
      this.scroll = { mode: 'standard' };

      // if (this.modulo.camposClase.find(x => x.nombre === 'crearCaja')) {


    } catch (error) {
      this.Excepciones(error, 1);
    }
    this.BotonesToolbar();
    this.DataColumnsGrid();
  };

  // BotonesToolbar() {
  //   this.toolbarGeneral = [];

  //   this.toolbarGeneral = [
  //     {
  //       location: 'after',
  //       widget: 'dxButton',
  //       locateInMenu: 'auto',
  //       options: {
  //         width: 120,
  //         text: 'Administrar',
  //         onClick: this.receiveMessage.bind(this, 'administrar')
  //       },
  //       visible: false,
  //       name: 'simple',
  //       name2: 'multiple'
  //     }
  //   ]
  //   const estado = this.lstEstado.find(x => x.idEstadoUnidad === this.getGeneralForm.value.idEstado);
  //   if (estado.llave === 'SIA') {
  //     this.toolbarGeneral.push(
  //       {
  //         location: 'after',
  //         widget: 'dxButton',
  //         locateInMenu: 'auto',
  //         options: {
  //           width: 120,
  //           text: 'Asignar',
  //           onClick: this.receiveMessage.bind(this, 'asignar1')
  //         },
  //         visible: false,
  //         name: 'simple'
  //       }
  //     )
  //   } else if ('AS1') {
  //     this.toolbarGeneral.push(
  //       {
  //         location: 'after',
  //         widget: 'dxButton',
  //         locateInMenu: 'auto',
  //         options: {
  //           width: 120,
  //           text: 'Asignar',
  //           onClick: this.receiveMessage.bind(this, 'asignar2')
  //         },
  //         visible: false,
  //         name: 'simple'
  //       }
  //     )
  //   }
  // }

  // DataColumnsGrid() {
  //   this.coalService.getService(`common/GetObjetoColumnsBase?idTipoReporte=${2}`).subscribe(
  //     (res: any) => {
  //       if (res.err) {
  //         this.Excepciones(res.err, 4);
  //       } else if (res.excepcion) {
  //         this.Excepciones(res.excepcion, 3);
  //       } else {
  //         const objetosColumns = res.recordsets[0];
  //         const columnsMulti = [];

  //         for (let index = 0; index < objetosColumns.length; index++) {

  //           if (!objetosColumns[index].allowupdate) {
  //             columnsMulti.push({
  //               caption: objetosColumns[index].titulo,
  //               dataField: objetosColumns[index].parametro,
  //               allowEditing: false,
  //               fixed: objetosColumns[index].fixed,
  //               dataType: objetosColumns[index].tipoCampo,
  //             });
  //           }
  //         }

  //         this.lstDataReport.push({
  //           idTipoReporte: 1,
  //           columnas: columnsMulti,
  //           dataReport: this.dataReport,
  //         });

  //         this.FillGrid();
  //       }


  //     }, (error: any) => {
  //       this.Excepciones(error, 2);
  //       this.spinner = false
  //     }
  //   );
  // }

  BotonesToolbar() {
    this.toolbarGeneral = [];
    this.toolbar = [];
    if (this.mostrarLectura === true) {
      this.toolbarGeneral = [
        {
          location: 'after',
          widget: 'dxButton',
          locateInMenu: 'auto',
          options: {
            text: 'Situación',
            onClick: this.receiveMessage.bind(this, 'actualizarSituacion')
          },
          visible: false,
          name: 'simple',
        },
        {
          location: 'after',
          widget: 'dxButton',
          locateInMenu: 'auto',
          options: {
            text: 'Precio',
            onClick: this.receiveMessage.bind(this, 'actualizarPrecio')
          },
          visible: false,
          name: 'simple',
        },

        {
          location: 'after',
          widget: 'dxButton',
          locateInMenu: 'auto',
          options: {
            text: 'Ubicación',
            onClick: this.receiveMessage.bind(this, 'actualizarUbicacion')
          },
          visible: false,
          name: 'simple',
        },
        {
          location: 'after',
          widget: 'dxButton',
          locateInMenu: 'auto',
          options: {
            text: 'Asignar',
            onClick: this.receiveMessage.bind(this, 'asignar1')
          },
          visible: false,
          name: 'simple'
        },
      ]
      this.toolbar = [
        {
          location: 'after',
          widget: 'dxButton',
          locateInMenu: 'auto',
          options: {
            text: 'Segunda asignación',
            onClick: this.receiveMessage.bind(this, 'asignacion2')
          },
          visible: false,
          name: 'simple'
        },
        {
          location: 'after',
          widget: 'dxButton',
          locateInMenu: 'auto',
          options: {
            text: 'Baja',
            onClick: this.receiveMessage.bind(this, 'updBaja')
          },
          visible: false,
          name: 'simple'
        },
      ]
    }

  }


  DataColumnsGrid() {
    this.columnsGeneral = [
      // {
      //   caption: 'Id unidad',
      //   dataField: 'unidadId',
      //   allowEditing: false,
      //   cssClass: 'general'
      // },
      {
        caption: 'VIN',
        dataField: 'numeroSerie',
        allowEditing: false,
        cssClass: 'general'
      },
      {
        caption: 'Contrato',
        dataField: 'contrato',
        allowEditing: false,
        cssClass: 'general'
      },
      {
        caption: 'Marca',
        dataField: 'marca',
        allowEditing: false,
        cssClass: 'general'
      },
      {
        caption: 'Submarca',
        dataField: 'submarca',
        allowEditing: false,
        cssClass: 'general'
      },
      {
        caption: 'Modelo',
        dataField: 'modelo',
        allowEditing: false,
        cssClass: 'general'
      },
      {
        caption: 'Paso de la unidad',
        dataField: 'estado',
        allowEditing: false,
        cssClass: 'general'
      },
      // {
      //   caption: 'Accion',
      //   dataField: 'accion',
      //   allowEditing: false,
      //   cssClass: 'general'
      // },
      // {
      //   caption: 'Condiciones',
      //   dataField: 'condiciones',
      //   allowEditing: false,
      //   cssClass: 'general'
      // },
      // {
      //   caption: 'Precio primer factura compra',
      //   dataField: 'precioCompraIva',
      //   dataType: TiposdeDato.number,
      //   format: TiposdeFormato.moneda,
      //   allowEditing: true,
      //   cssClass: 'general'
      // },
      {
        caption: 'Ubicación',
        dataField: 'ubicacionUnidad',
        allowEditing: false,
        cssClass: 'general',
      },
      {
        caption: 'Situación',
        dataField: 'situacion',
        allowEditing: false,
        cssClass: 'general',
      },
      {
        caption: 'Condiciones',
        dataField: 'condicion',
        allowEditing: false,
        cssClass: 'general',
      },
      {
        caption: 'Precio Venta',
        dataField: 'precioVentaIva',
        dataType: TiposdeDato.number,
        format: TiposdeFormato.moneda,
        allowEditing: false,
        cssClass: 'general'
      },
      {
        caption: 'Estatus proceso',
        dataField: 'estatusProceso',
        allowEditing: false,
        // cellTemplate: 'estatusProceso',
        cssClass: 'general'
      },
      {
        caption: 'Fecha inicio contrato',
        dataField: 'fechaInicio',
        dataType: TiposdeDato.datetime,
        format: TiposdeFormato.dmy,
        allowEditing: false,
        cssClass: 'general'
      },
      {
        caption: 'Fecha termino contrato',
        dataField: 'fechaFin',
        dataType: TiposdeDato.datetime,
        format: TiposdeFormato.dmy,
        allowEditing: false,
        cssClass: 'general'
      },
      {
        caption: 'Estatus unidad en sisco',
        dataField: 'estatus',
        allowEditing: false,
        cssClass: 'general'
      }
    ];
  }

  FillGrid() {
    this.columnsGeneral = this.lstDataReport.find(x => x.idTipoReporte === 1).columnas;
    this.reporte = this.lstDataReport.find(x => x.idTipoReporte === 1).dataReport;
    console.clear();
    this.verGrid = true;
    this.spinner = false;
  }

  receiveMessage($event) {
    try {
      if ($event === 'asignar1') {
        this.Asignacion();
      } else if ($event === 'asignacion2') {
        // this.PostSubeDocumentosFactura(1)
        // this.GenerarCotizacion()
        this.Asignacion2();
      } else if ($event === 'administrar') {
        this.PostCopiaDocumentosPdf(1)
        // this.PostSubeDocumentosPdf(1)
        // this.Administrar();
      } else if ($event === 'administrarI') {
        this.AdministrarIntellimotors();
      } else if ($event === 'enviarIntellimotors') {
        this.EnviarIntellimotors();
      }
      else if ($event === 'expediente') {
        // this.Expediente();
      }
      else if ($event === 'documentos') {
        this.sincronizarDocumentos();
      } else if ($event === 'oc2') {
        this.oc2();
      } else if ($event === 'subeFactura') {
        this.subeFactura();
      } else if ($event === 'versionModelo') {
        // this.versionModelo();
      } else if ($event === 'actualizarPrecio') {
        this.actualizarPrecio();
      } else if ($event === 'actualizarUbicacion') {
        this.actualizarUbicacion();
      } else if ($event === 'updBaja') {
        this.updBaja();
      } else if ($event === 'actualizarSituacion') {
        this.actualizarSituacion();
      }


    } catch (error) {
      this.Excepciones(error, 1);
    }
  }

  actualizarSituacion() {
    const verificaAsignacion = this.datosevent.filter(e => e.llaveEstado !== 'SIA' || e.estado === 'PENDIENTE');
    if (verificaAsignacion.length > 0) {
      return this.snackBar.open('No se puede completar la siguiente operación ya que algunas de las unidades ya cuentan con la primer Asignación', 'Ok', { duration: 20000 });
    }
    const verificaPrecio = this.datosevent.filter(x => x.precioVentaIva === null || x.precioVentaIva === undefined);
    if (verificaPrecio.length > 0) {
      return this.snackBar.open('Unidades con información incompleta', 'Ok', { duration: 1000 });
    }

    this.spinner = true;
    let idUnidad = [];
    const dialogRef = this.dialog.open(DialogSituacionUnidad, {
      disableClose: true,
      data: {
        title: 'Actualización de datos',
        select: this.sucAceptanSeminuevos,//this.companias,
        elementos: 'Cantidad de unidades a actualizar: ' + this.datosevent.length,
        unidades: this.datosevent
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (!result) {
        this.snackBar.open('Actualización cancelada', 'Ok', { duration: 10000 });
        this.spinner = false;
      } else {
        this.datosevent.forEach(x => {
          idUnidad.push({
            idUnidad: x.unidadId
          })
        });
        let body = {
          xmlVIN: idUnidad,
          situacion: result[0].valorSelect
        }
        this.coalService.postService(`reporte/PostUpdSituacion`, body).subscribe(
          (res: any) => {
            if (res.err) {
              this.Excepciones(res.err, 4);
            } else if (res.excepcion) {
              this.Excepciones(res.excepcion, 3);
            } else {
              this.GenerateReport();
              this.snackBar.open(res.recordsets[0][0].mensaje, 'Ok', { duration: 5000 });
            }
          }, (error: any) => {
            this.Excepciones(error, 2);
            this.spinner = false
          }
        );
      }
    })
  }

  updBaja() {
    const verificaAsignacion = this.datosevent.filter(e => e.folioCotizacion !== null);
    if (verificaAsignacion.length > 0) {
      return this.snackBar.open('No se puede completar la siguiente operacion ya que algunas de las unidades ya cuentan con la segunda Asignación', 'Ok', { duration: 20000 });
    }
    let idUnidad = [];
    const dialogRef = this.dialog.open(DialogBajaUnidad, {
      disableClose: true,
      data: {
        title: 'Actualización de datos',
        select: this.sucAceptanSeminuevos,//this.companias,
        elementos: 'Cantidad de unidades a actualizar: ' + this.datosevent.length,
        unidades: this.datosevent
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (!result) {
        this.snackBar.open('Actualización cancelada', 'Ok', { duration: 10000 });
        this.spinner = false;
      } else {
        this.datosevent.forEach(x => {
          idUnidad.push({
            idUnidad: x.unidadId
          })
        });
        let body = {
          xmlVIN: idUnidad,
          baja: result[0].valorSelect
        }
        this.coalService.postService(`reporte/PostUpdBaja`, body).subscribe(
          (res: any) => {
            if (res.err) {
              this.Excepciones(res.err, 4);
            } else if (res.excepcion) {
              this.Excepciones(res.excepcion, 3);
            } else {
              this.GenerateReport();
              this.snackBar.open(res.recordsets[0][0].mensaje, 'Ok', { duration: 5000 });
            }
          }, (error: any) => {
            this.Excepciones(error, 2);
            this.spinner = false
          }
        );
      }
    })
    // this.coalService.postService(`reporte/PostUpdBaja`, body).subscribe(
    //   (res: any) => {
    //     if (res.err) {
    //       this.Excepciones(res.err, 4);
    //     } else if (res.excepcion) {
    //       this.Excepciones(res.excepcion, 3);
    //     } else {
    //       this.GenerateReport();
    //       this.snackBar.open(res.recordsets[0][0].mensaje, 'Ok', { duration: 5000 });
    //     }
    //   }, (error: any) => {
    //     this.Excepciones(error, 2);
    //     this.spinner = false
    //   }
    // );
  }

  actualizarUbicacion() {
    const verificaAsignacion = this.datosevent.filter(e => e.llaveEstado !== 'SIA' || e.estado === 'PENDIENTE');
    if (verificaAsignacion.length > 0) {
      return this.snackBar.open('No se puede completar la siguiente operación ya que algunas de las unidades ya cuentan con la primer Asignación', 'Ok', { duration: 20000 });
    }
    const verificaPrecio = this.datosevent.filter(x => x.precioVentaIva === null || x.precioVentaIva === undefined);
    if (verificaPrecio.length > 0) {
      return this.snackBar.open('Unidades con información incompleta', 'Ok', { duration: 1000 });
    }

    this.spinner = true;
    let idUnidad = [];
    const dialogRef = this.dialog.open(DialogUpdUbicacion, {
      disableClose: true,
      data: {
        title: 'Actualización de datos',
        select: this.sucAceptanSeminuevos,//this.companias,
        elementos: 'Cantidad de unidades a actualizar: ' + this.datosevent.length,
        unidades: this.datosevent
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (!result) {
        this.snackBar.open('Actualización cancelada', 'Ok', { duration: 10000 });
        this.spinner = false;
      } else {
        this.datosevent.forEach(x => {
          idUnidad.push({
            idUnidad: x.unidadId
          })
        });
        let body = {
          xmlVIN: idUnidad,
          ubicacion: result[0].valorUbicacion
        }
        this.coalService.postService(`reporte/PostUpdUbicacion`, body).subscribe(
          (res: any) => {
            if (res.err) {
              this.Excepciones(res.err, 4);
            } else if (res.excepcion) {
              this.Excepciones(res.excepcion, 3);
            } else {
              this.GenerateReport();
              this.snackBar.open(res.recordsets[0][0].mensaje, 'Ok', { duration: 5000 });
            }
          }, (error: any) => {
            this.Excepciones(error, 2);
            this.spinner = false
          }
        );
      }
    })
  }

  actualizarPrecio() {

    const verificaAsignacion = this.datosevent.filter(e => e.llaveEstado !== 'SIA' || e.estado === 'PENDIENTE');
    if (verificaAsignacion.length > 0) {
      return this.snackBar.open('No se puede completar la siguiente operacion ya que algunas de las unidades ya cuentan con la primer Asignación', 'Ok', { duration: 20000 });
    }
    const verificaPrecio = this.datosevent.filter(x => x.precioVentaIva === null || x.precioVentaIva === undefined);
    if (verificaPrecio.length > 0) {
      return this.snackBar.open('Unidades con información incompleta', 'Ok', { duration: 1000 });
    }

    this.spinner = true;
    let idUnidad = [];
    const dialogRef = this.dialog.open(DialogUpdPrecio, {
      disableClose: true,
      data: {
        title: 'Actualización de datos',
        select: this.sucAceptanSeminuevos,//this.companias,
        elementos: 'Cantidad de unidades a actualizar: ' + this.datosevent.length,
        unidades: this.datosevent
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (!result) {
        this.snackBar.open('Actualización cancelada', 'Ok', { duration: 10000 });
        this.spinner = false;
      } else {
        this.datosevent.forEach(x => {
          idUnidad.push({
            idUnidad: x.unidadId
          })
        });
        let body = {
          xmlVIN: idUnidad,
          precioVentaIva: result[0].valorSelect
        }
        this.coalService.postService(`reporte/PostUpdPrecioVentaIva`, body).subscribe(
          (res: any) => {
            if (res.err) {
              this.Excepciones(res.err, 4);
            } else if (res.excepcion) {
              this.Excepciones(res.excepcion, 3);
            } else {
              this.GenerateReport();
              this.snackBar.open(res.recordsets[0][0].mensaje, 'Ok', { duration: 5000 });
            }
          }, (error: any) => {
            this.Excepciones(error, 2);
            this.spinner = false
          }
        );
      }
    })
  }
  // versionModelo() {
  //   console.log(this.datosevent)
  //   const verificaAsignacion = this.datosevent.filter(x => x.idCompania2 !== null && x.idSucursal2 !== null);
  //   if (verificaAsignacion.length > 0) {
  //     this.snackBar.open('Unidades en segunda asignación', 'Ok', { duration: 5000 });
  //   } else {
  //     const marca = this.datosevent[0].marca;
  //     const diferenciaMarca = this.datosevent.filter(x => x.marca !== marca);
  //     if (diferenciaMarca.length > 0) {
  //       this.snackBar.open('Favor de seleccionar unidades de la misma marca', 'Ok', { duration: 5000 });
  //     } else {
  //       this.catalogoModelo.length = 0;
  //       this.coalService.getService(`reporte/getModeloIntelimotors?marca=${marca}`).subscribe(
  //         (res: any) => {
  //           if (res.err) {
  //             this.Excepciones(res.err, 4);
  //           } else if (res.excepcion) {
  //             this.Excepciones(res.excepcion, 3);
  //           } else {
  //             this.catalogoModelo = res.recordsets[0];
  //             console.log(this.catalogoModelo)
  //             const dialogRef = this.dialog.open(DialogModeloVersion, {
  //               disableClose: true,
  //               data: {
  //                 select: this.catalogoModelo,
  //                 marca: marca
  //               }
  //             });
  //             dialogRef.afterClosed().subscribe(result => {
  //               if (!result) {
  //                 this.snackBar.open('cancelado', 'Ok', { duration: 10000 });
  //               } else {
  //                 console.log(result)
  //                 // if (result[0].valorSelect !== '') {
  //                 let contador = 0;
  //                 for (let j = 0; j < this.datosevent.length; j++) {
  //                   for (let i = 0; i < this.data.length; i++) {
  //                     if (this.datosevent[j].idUnidad === this.data[i].idUnidad && this.datosevent[j].numeroSerie === this.data[i].numeroSerie) {
  //                       this.data[i].modeloIntelimotors = result[0].valorSelect;
  //                       this.datosevent[j].modeloIntelimotors = result[0].valorSelect;
  //                       this.data[i].versionIntelimotors = result[0].valorVersion;
  //                       this.datosevent[j].versionIntelimotors = result[0].valorVersion;
  //                       contador++;
  //                     }
  //                     if (this.datosevent.length === contador) {
  //                       break;
  //                     }
  //                   }
  //                   if (this.datosevent.length === contador) {
  //                     break;
  //                   }
  //                 }
  //               }
  //             });
  //           }
  //         }, (error: any) => {
  //           this.Excepciones(error, 2);
  //         }
  //       );
  //     }
  //   }
  // }

  datosMessage($event) {
    try {
      this.datosevent = $event.data;
      // console.log(this.datosevent)
    } catch (error) {
      this.Excepciones(error, 1);
    }
  }

  clickEvent($event) {
    // if ($event.columnIndex === 11) {
    //   console.log($event)
    //   $event.key.idMarca
    //   if (this.idMarcaFinal != $event.key.idMarca) {
    //     console.log('entre');
    //     this.catalogoModelo.length = 0;
    //     this.coalService.getService(`reporte/getModeloIntelimotors?marca=${$event.key.marca}`).subscribe(
    //       (res: any) => {
    //         if (res.err) {
    //           this.Excepciones(res.err, 4);
    //         } else if (res.excepcion) {
    //           this.Excepciones(res.excepcion, 3);
    //         } else {
    //           this.catalogoModelo = res.recordsets[0];
    //         }
    //       }, (error: any) => {
    //         this.Excepciones(error, 2);
    //       }
    //     );
    //   }else{
    //     console.log('son iguales');
    //   }
    //   this.idMarcaFinal = $event.key.idMarca;
    // }
    // if ($event.columnIndex === 12) {
    //   if (this.idMarcaFinal12 != $event.key.idMarca) {
    //     console.log('entre');
    //     this.catalogoModelo.length = 0;
    //     this.coalService.getService(`reporte/getVersionIntelimotors?marca=${$event.key.marca}`).subscribe(
    //       (res: any) => {
    //         if (res.err) {
    //           this.Excepciones(res.err, 4);
    //         } else if (res.excepcion) {
    //           this.Excepciones(res.excepcion, 3);
    //         } else {
    //           this.catalogoVersion = res.recordsets[0];
    //         }
    //       }, (error: any) => {
    //         this.Excepciones(error, 2);
    //       }
    //     );
    //   }else{
    //     console.log('son iguales');
    //   }
    //   this.idMarcaFinal12 = $event.key.idMarca;
    // }

  }

  subeFactura() {
    // this.spinner = true;
    this.lstMapeoDocumentos = [];
    let unidadesSeleccionadas = {
      unidadesSeleccionadas: this.datosevent
    }
    console.log(unidadesSeleccionadas);
    this.coalService.postService(`reporte/InsDocumentosExpedienteFactura`, unidadesSeleccionadas).subscribe(
      (res: any) => {
        if (res.err) {
          this.Excepciones(res.err, 4);
        } else if (res.excepcion) {
          this.Excepciones(res.excepcion, 3);
        } else {
          // this.lstMapeoDocumentos = res.recordsets[0];
          // console.log(this.lstMapeoDocumentos);
          // let body = {
          //   ArregloDocumentos: this.lstMapeoDocumentos
          // }
          //   this.coalService.postService(`reporte/PostSubirFactura`, body).subscribe(
          //     (res: any) => {
          //       if (res.err) {
          //         this.Excepciones(res.err, 4);
          //       } else if (res.excepcion) {
          //         this.Excepciones(res.excepcion, 3);
          //       } else {
          //         this.snackBar.open('Sincronizando Documentación', 'Ok', { duration: 5000 });
          //         this.spinner = false
          //       }
          //       this.spinner = false
          //     }, (error: any) => {
          //       this.Excepciones(error, 2);
          //       this.spinner = false
          //     }
          //   )
          this.spinner = false;
          this.snackBar.open('Sincronizando Documentación', 'Ok', { duration: 5000 });
        }
        this.spinner = false
      }, (error: any) => {
        this.Excepciones(error, 2);
        this.spinner = false
      }
    )
  }


  Administrar() {
    const dialogRef = this.dialog.open(ModalGeneralComponent, {
      disableClose: true,
      width: '100%',
      data: {
        vin: this.datosevent[0].numeroSerie
      }
    });
    dialogRef.afterClosed().subscribe(result => {
    })
  }

  Asignacion() {
    let validacion = true;
    let validacion2 = true;
    console.log("dat", this.datosevent)
    for (const e of this.datosevent) {
      if (e.estatus !== 'Desflote') {
        validacion = false
        break;
      }
    }
    if (validacion) {
      for (const e of this.datosevent) {
        if (e.llaveEstado !== 'SIA' || e.estado === 'PENDIENTE') {
          return this.snackBar.open('No se puede completar la siguiente operacion ya que algunas de las unidades ya cuentan con la primer Asignación', 'Ok', { duration: 20000 });
        }
        if (e.precioVentaIva === null || e.precioVentaIva === undefined) {
          return this.snackBar.open('Unidades con información incompleta', 'Ok', { duration: 20000 });
        }

        if (e.situacion !== null && e.situacion !== '') {
          return this.snackBar.open('Algunas unidades cuentan con alguna situación, estas no se pueden asignar, favor de revisar.', 'Ok', { duration: 20000 });
        }
      }
      const dialogRef = this.dialog.open(DialogAsignar, {
        disableClose: true,
        data: {
          title: 'Asignación de Unidades',
          select: this.sucAceptanSeminuevos,//this.companias,
          elementos: 'Cantidad de unidades a asignar: ' + this.datosevent.length
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (!result) {
          this.snackBar.open('Asignación cancelada', 'Ok', { duration: 10000 });
        } else {
          if (result[0].valorSelect !== '') {
            const dialogRef = this.dialog.open(AlertDialogComponent,
              {
                width: '350px',
                data: '¿Desea llevar a cabo la asignación de estas unidades?'
              }
            );
            dialogRef.afterClosed().subscribe(resultado => {
              if (resultado) {
                // this.GuardaUnidadesDesflote(result[0]);
                this.ActualizaFactura(result[0], 'PRIMERA')
              } else {
                this.snackBar.open('Asignación cancelada', 'Ok', { duration: 10000 });
              }
            });
          } else {
            this.snackBar.open('Favor de seleccionar una compañia para asignar unidades', 'Ok', { duration: 10000 });
          }
        }
      });
    } else {
      this.snackBar.open('No se puede completar la siguiente operacion ya que algunas de las unidades que se quieren asignar no estan en estatus de Desflote', 'Ok', { duration: 20000 });
    }

  }

  GuardaUnidadesDesflote(datosEmpresa,) {
    let xmlUnidades = `<unidades>`
    for (const e of this.datosevent) {
      xmlUnidades += `<unidad><unidadId>${e.unidadId}</unidadId><numeroSerie>${e.numeroSerie}</numeroSerie></unidad>`
    }
    xmlUnidades += `</unidades>`
    const datos = {
      xmlUnidades
    }
  }

  ActualizaFactura(datosEmpresa, tipo) {
    let xmlUnidades = `<unidades>`
    for (const e of this.datosevent) {
      xmlUnidades += `<unidad><unidadId>${e.unidadId}</unidadId></unidad>`
    }
    xmlUnidades += `</unidades>`
    const datos = {
      xmlUnidades,
      idCompania: datosEmpresa.valorSelect.idCompania,
      idSucursal: datosEmpresa.valorSelect.idSucursal,
      tipo,
      idUsuarioBpro: this.lstbPro[0].idUsuarioBpro
    }
    this.spinner = true
    this.coalService.postService(`reporte/PostUpdFactura`, datos).subscribe(
      (res: any) => {
        this.spinner = false
        if (res.err) {
          this.spinner = false
          this.Excepciones(res.err, 4);
        } else if (res.excepcion) {
          this.spinner = false
          this.Excepciones(res.excepcion, 3);
        } else {
          this.spinner = false
          if (res.recordsets[0][0].success === 0) {
            this.snackBar.open(res.recordsets[0][0].mensaje, 'Ok', { duration: 10000 });
          } else {
            this.snackBar.open('Se enviaron las unidades a desflotar, en cuanto el proceso este completado se vera reflejado en el GRID', 'Ok', { duration: 10000 });
          }
          this.GenerateReport();
        }
      }, (error: any) => {
        this.spinner = false
        this.Excepciones(error, 2)
      })
  }

  AdministrarIntellimotors() {
    const dialogRef = this.dialog.open(ModalIntellimotorsComponent, {
      disableClose: false,
      width: '100%',
      data: {
        vin: this.datosevent[0].vin,
        marca: this.datosevent[0].marca,
        submarca: this.datosevent[0].submarca,
        modelo: this.datosevent[0].modelo,
      }
    });
    dialogRef.afterClosed().subscribe(result => {
    })
  }

  EnviarIntellimotors() {
    const i = this.reporte.findIndex(x => x.vin === this.datosevent[0].vin)
    if (this.reporte.length > 1) {
      this.snackBar.open('Se enviaron las unidades a intellimotors', 'Ok', { duration: 10000 });
    } else {
      this.snackBar.open('Se envio la unidad a intellimotors', 'Ok', { duration: 10000 });
    }
    if (this.reporte[i].precioCompra === 0) {
      this.spinner = true;
      this.verGrid = false;
      setTimeout(() => {
        this.reporte[i].precioCompra = 350000
        this.reporte[i].precioVenta = 440000
        this.spinner = false;
        this.verGrid = true;
        this.snackBar.open('Las unidades se han registrado en intellimotors', 'Ok', { duration: 10000 });
      }, 3000);
    } else {
      this.snackBar.open('Esta unidad ya esta registrada en intellimotors', 'Ok', { duration: 10000 });
    }
  }

  Expediente(vin) {
    // window.open(`http://192.168.20.89:3671/?id=${vin}&employee=71&proceso=1`);
    // const dialogRef = this.dialog.open(ModalExpedienteComponent, {
    //   disableClose: true,
    //   width: '100%',
    //   // height: '90%',
    //   data: {
    //     idModulo: this.modulo.id,
    //     idUsuario: this.idUsuario,
    //     vin,
    //   }
    // });
    // dialogRef.afterClosed().subscribe(result => {
    // })
    let idCompania;
    let idSucursal;
    let numeroSerie = vin.key.numeroSerie;
    if (vin.columnIndex === 6) {
      idCompania = vin.key.idCompania1;
      idSucursal = vin.key.idSucursal1;
    }
    else if (vin.columnIndex === 17) {
      idCompania = vin.key.idCompania2;
      idSucursal = vin.key.idSucursal2;
    }

    var url = 'http://192.168.20.123:4080';
    var titulo = 'Login by User Id';
    var form = document.createElement("form");
    form.setAttribute("method", "post");
    form.setAttribute("action", url);
    form.setAttribute("target", titulo);
    var hiddenField = document.createElement("input");
    hiddenField.setAttribute("type", "hidden");
    hiddenField.setAttribute("name", "idUsuario");
    hiddenField.setAttribute("value", '71');
    form.appendChild(hiddenField);

    var hiddenField1 = document.createElement("input");
    hiddenField1.setAttribute("type", "hidden");
    hiddenField1.setAttribute("name", "idProceso");
    hiddenField1.setAttribute("value", '1');
    form.appendChild(hiddenField1);

    var hiddenField2 = document.createElement("input");
    hiddenField2.setAttribute("type", "hidden");
    hiddenField2.setAttribute("name", "idEmpresa");
    hiddenField2.setAttribute("value", idCompania);
    form.appendChild(hiddenField2);

    var hiddenField3 = document.createElement("input");
    hiddenField3.setAttribute("type", "hidden");
    hiddenField3.setAttribute("name", "idSucursal");
    hiddenField3.setAttribute("value", idSucursal);
    form.appendChild(hiddenField3);

    var hiddenField4 = document.createElement("input");
    hiddenField4.setAttribute("type", "hidden");
    hiddenField4.setAttribute("name", "vin");
    hiddenField4.setAttribute("value", numeroSerie);
    form.appendChild(hiddenField4);


    document.body.appendChild(form);
    window.open('', titulo);
    form.submit();
  }

  Asignacion2() {
    const completaPrimerAsignacion = this.datosevent.filter(x => x.ordenCompra1 === null);
    if (completaPrimerAsignacion.length > 0) {
      return this.snackBar.open('No se puede completar la operación ya que en algunas unidades no ha concluido la primer asignación', 'Ok', { duration: 10000 });
    }
    for (const e of this.datosevent) {
      if (e.folioCotizacion) {
        return this.snackBar.open('No se puede completar la operación ya que algunas unidades cuentan con la segunda asignación', 'Ok', { duration: 10000 });
      }
    }
    const incompletoIntelimotors = this.datosevent.filter(x => x.datosIntelimotors === 'Faltan datos')
    if (incompletoIntelimotors.length > 0) {
      return this.snackBar.open('Favor de completar datos faltantes de intelimotors', 'Ok', { duration: 10000 });
    }
    const dialogRef = this.dialog.open(DialogAsignar, {
      disableClose: true,
      data: {
        title: 'Asignación de Unidades',
        select: this.sucAceptanSeminuevos,
        elementos: 'Cantidad de unidades a asignar: ' + this.datosevent.length
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (!result) {
        this.snackBar.open('Asignación cancelada', 'Ok', { duration: 10000 });
      } else {
        if (result[0].valorSelect !== '') {
          const dialogRef = this.dialog.open(AlertDialogComponent,
            {
              width: '350px',
              data: '¿Desea llevar a cabo la asignación de estas unidades?'
            }
          );
          dialogRef.afterClosed().subscribe(resultado => {
            if (resultado) {
              // for (const e of this.datosevent) {
              //   if (e.idCompania1 === result[0].valorSelect.idCompania && e.idSucursal1 === result[0].valorSelect.idSucursal) {
              //     return this.snackBar.open('No se puede completar la operación ya que algunas unidades estan asiganadas a esa compañia', 'Ok', { duration: 10000 });
              //   }
              // }
              // idCompania: result.valorSelect.idCompania,
              // idSucursal: result.valorSelect.idSucursal,
              // rfcCompania: result.valorSelect.rfcCompania,

              const mismaCompania = this.datosevent.filter(x => x.idCompania1 === result[0].valorSelect.idCompania && x.idSucursal1 !== result[0].valorSelect.idSucursal)

              const mismaAgencia = this.datosevent.filter(x => x.idCompania1 === result[0].valorSelect.idCompania && x.idSucursal1 === result[0].valorSelect.idSucursal)

              const diferenteAgencia = this.datosevent.filter(x => x.idCompania1 !== result[0].valorSelect.idCompania && x.idSucursal1 !== result[0].valorSelect.idSucursal)

              if (mismaCompania.length > 0) {
                this.snackBar.open('No se puede asignar unidades a una sucursal de la misma empresa, favor de verificar', 'Ok', { duration: 10000 });
              } else {
                if (mismaAgencia.length > 0) {
                  this.AsignacionMismaEmpresa(mismaAgencia);
                }

                if (diferenteAgencia.length > 0) {
                  // const validaExpediente = diferenteAgencia.filter(x => x.expedienteCompleto !== true)
                  // if (validaExpediente.length > 0) {
                  //   return this.snackBar.open('No se puede completar la operación ya que algunas unidades no tienen su expediente completo', 'Ok', { duration: 10000 });
                  // }
                  this.GenerarCotizacion(diferenteAgencia, result[0]);
                }
              }


              // this.spinner = true;
              // this.asignacion(result[0], 'SEGUNDA');
            } else {
              this.snackBar.open('Asignación cancelada', 'Ok', { duration: 10000 });
            }
          });
        } else {
          this.snackBar.open('Favor de seleccionar una compañia para asignar unidades', 'Ok', { duration: 10000 });
        }
      }
    });

  }

  oc2() {
    const dialogRef = this.dialog.open(DialogAsignar, {
      disableClose: true,
      data: {
        title: 'Asignación de Unidades',
        select: this.companias,
        elementos: 'Cantidad de unidades a asignar: ' + this.datosevent.length
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (!result) {
        this.snackBar.open('Asignación cancelada', 'Ok', { duration: 10000 });
      } else {
        if (result[0].valorSelect !== '') {
          const dialogRef = this.dialog.open(AlertDialogComponent,
            {
              width: '350px',
              data: '¿Desea llevar a cabo la asignación de estas unidades?'
            }
          );
          dialogRef.afterClosed().subscribe(resultado => {
            if (resultado) {
              for (const e of this.datosevent) {
                if (e.idCompania1 === result[0].valorSelect.idCompania && e.idSucursal1 === result[0].valorSelect.idSucursal) {
                  return this.snackBar.open('No se puede completar la operación ya que algunas unidades estan asiganadas a esa compañia', 'Ok', { duration: 10000 });
                }
              }
              // this.spinner = true;
              this.asignacion(result[0], 'SEGUNDA');
            } else {
              this.snackBar.open('Asignación cancelada', 'Ok', { duration: 10000 });
            }
          });
        } else {
          this.snackBar.open('Favor de seleccionar una compañia para asignar unidades', 'Ok', { duration: 10000 });
        }
      }
    });

  }

  SegundaAsignacion(valor) {
    const i = this.data.findIndex(x => x.vin === this.datosevent[0].vin)
    const nombreCompania = this.companias.find(x => x.idCompania === valor.idCompania).descripcion;
    this.data[i].agenciaAsignada = nombreCompania;
    this.data[i].PrecioFinFacturar2 = "$234,212.00";
    this.data[i].factura2 = "SDF4232FD2S";
    this.data[i].utilidad = "$22,233.00";
    this.data[i].vendido = 'Santiago Juárez Salazar';
    this.data[i].precioFinal = "$237,342.00";
    this.data[i].ordenCompra2 = 'AU-AA-AAZ-ACS-PE-1135';
    this.data[i].aprobada2 = 'Si';
    this.data[i].vendida2 = 'Si';
    this.data[i].traslados = 'Con traslado'

    this.spinner = false;
  }

  datosUpd(e) {
    const datos = {
      idUnidad: e.editdata.key.idUnidad,
      numeroSerie: e.editdata.key.numeroSerie,
      key: Object.keys(e.editdata.newData)[0],
      precio: e.editdata.newData[`${Object.keys(e.editdata.newData)}`]
    }
    this.coalService.postService(`reporte/UpdPrecio`, datos).subscribe(
      (res: any) => {
        if (res.err) {
          this.Excepciones(res.err, 4);
        } else if (res.excepcion) {
          this.Excepciones(res.excepcion, 3);
        } else {
          this.snackBar.open(res.recordsets[0][0].mensaje, 'Ok', { duration: 10000 });
          this.spinner = false;
        }
        this.spinner = false
      }, (error: any) => {
        this.Excepciones(error, 2);
        this.spinner = false
      }
    )
  }


  /**
   * En caso de que algun metodo, consulta a la base de datos o conexión con el servidor falle, se abrira el dialog de excepciones
   * @param pila stack
   * @param tipoExcepcion numero de la escecpción lanzada
   */
  Excepciones(pila, tipoExcepcion: number) {
    try {
      const dialogRef = this.dialog.open(ExcepcionesComponent, {
        width: '60%',
        data: {
          idTipoExcepcion: tipoExcepcion,
          idUsuario: 1,
          idOperacion: 1,
          idAplicacion: 14,
          moduloExcepcion: 'sel-general.component',
          mensajeExcepcion: '',
          stack: pila
        }
      });
      dialogRef.afterClosed().subscribe((result: any) => { });
    } catch (error) {
      console.error(error);
    }
  }

}
