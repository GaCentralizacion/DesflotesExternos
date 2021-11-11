import { Component, OnInit, Inject } from '@angular/core';
import { ExcepcionesComponent } from '../../../utilerias/excepciones/excepciones.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { environment } from 'environments/environment';
import { AlertDialogComponent } from 'app/utilerias/alert-dialog/alert-dialog.component';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CoalService } from 'app/services/coal.service';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { AppDateAdapter, APP_DATE_FORMATS } from '../../../models/formato-fecha-datepicker';
import { IViewertipo, IViewersize, IFileUpload, ICheckbox, IColumnchooser, IColumnHiding, IColumns, IEditing, IExportExcel, IGridOptions, IScroll, ISearchPanel, TiposdeDato, Toolbar } from '../../../interfaces';
import { MatSnackBar } from '@angular/material/snack-bar';

/**
 * Obtenemos el Mensaje a mostrar
 */
export interface SendData {
  idModulo: number,
  idUsuario: number,
  vin: string,
}

@Component({
  selector: 'app-modal-expediente',
  templateUrl: './modal-expediente.component.html',
  styleUrls: ['./modal-expediente.component.sass'],
  providers: [CoalService, { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS }]
})
export class ModalExpedienteComponent implements OnInit {

  
  documentos;
  IUploadFile;
  documentoTemporal: any;
  documentosTemporales = [];

  gridOptions: IGridOptions;
  columns: IColumns[];
  exportExcel: IExportExcel;
  searchPanel: ISearchPanel;
  scroll: IScroll;
  toolbar: Toolbar[];
  columnHiding: IColumnHiding;
  Checkbox: ICheckbox;
  Editing: IEditing;
  Columnchooser: IColumnchooser;
  contador = 5;
  bandera = true

  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<AlertDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SendData,
    private coalService: CoalService,
    private snackBar: MatSnackBar,
  ) {
  }

  ngOnInit() {
    const ext = [];
    ext.push('.pdf', '.PDF');
    console.log(this.data);
    this.IUploadFile = {
      path: 'EXPEDIENTE',
      idUsuario: this.data.idUsuario,
      idAplicacionSeguridad: environment.aplicacionesId,
      idModuloSeguridad: this.data.idModulo,
      multiple: false,
      soloProcesar: false,
      extension: ext,
      titulo: '',
      descripcion: '',
      previsualizacion: true,
      tipodecarga: 'instantly'
    };
    this.documentos = [{
      idDocumento: 18,
      nombre: 'Acta Constitutiva inscrita en RPP',
      extencion: 'pdf',
      docActivo: 1,
      docOpcional: 0,
      docProceso: 1,
      docFisica: 0,
      docMoral: 1,
      docVarios: 0,
      docUsuarios: 1,
      nombreCorto: 'ActaConstituva',
      docFisicaAe: 0,
      docCertificacion: 0,
      carpetaVarios: null
    },
    {
      idDocumento: 22,
      nombre: 'Auto facturación o en su caso el acuse de recepción  emitida por el SAT',
      extencion: 'pdf',
      docActivo: 1,
      docOpcional: 1,
      docProceso: 1,
      docFisica: 1,
      docMoral: 0,
      docVarios: 0,
      docUsuarios: 1,
      nombreCorto: 'AutoFacturacion',
      docFisicaAe: 0,
      docCertificacion: 0,
      carpetaVarios: null
    },
    {
      idDocumento: 1,
      nombre: 'Avalúo Autorizado por Intelimotors',
      extencion: 'pdf',
      docActivo: 1,
      docOpcional: 0,
      docProceso: 1,
      docFisica: 1,
      docMoral: 1,
      docVarios: 0,
      docUsuarios: 0,
      nombreCorto: 'AvaluoAutorizado',
      docFisicaAe: 1,
      docCertificacion: 0,
      carpetaVarios: null
    },
    {
      idDocumento: 16,
      nombre: 'C.U.R.P',
      extencion: 'pdf',
      docActivo: 1,
      docOpcional: 0,
      docProceso: 1,
      docFisica: 1,
      docMoral: 1,
      docVarios: 0,
      docUsuarios: 1,
      nombreCorto: 'CURP',
      docFisicaAe: 1,
      docCertificacion: 0,
      carpetaVarios: null
    },
    {
      idDocumento: 21,
      nombre: 'Carta autorización para Auto facturación',
      extencion: 'pdf',
      docActivo: 1,
      docOpcional: 1,
      docProceso: 1,
      docFisica: 1,
      docMoral: 0,
      docVarios: 0,
      docUsuarios: 1,
      nombreCorto: 'CartaAutrizacion',
      docFisicaAe: 0,
      docCertificacion: 1,
      carpetaVarios: null
    },
    {
      idDocumento: 11,
      nombre: 'Comprobante de Baja de Placas y/o Placas de Circulación',
      extencion: 'pdf',
      docActivo: 1,
      docOpcional: 0,
      docProceso: 1,
      docFisica: 1,
      docMoral: 1,
      docVarios: 0,
      docUsuarios: 1,
      nombreCorto: 'ComprobanteBajaPlacas',
      docFisicaAe: 1,
      docCertificacion: 0,
      carpetaVarios: null
    },]

    this.documentosTemporales = [
      {
        idDocumento: 13,
        idFileServer: 9390,
        aprobado: true,
        path: 'http://192.168.20.89:3657//CONTRATO_CONSIGNACION/5-9-5\\CXP/CopiaIdentificacion.pdf',
        pathFisico: '/CONTRATO_CONSIGNACION/5-9-5\\CXP/CopiaIdentificacion.pdf',
        nombre: 'Copia de Identificación Oficial cotejada por el Gerente de Seminuevos con firma (INE, Pasaporte, Cedula Profesional)',
        extencion: 'pdf',
        docActivo: 1,
        docOpcional: 0,
        docProceso: 1,
        docFisica: 1,
        docMoral: 1,
        docVarios: 0,
        docUsuarios: 1,
        nombreCorto: 'CopiaIdentificacion',
        docFisicaAe: 1,
        docCertificacion: 0,
        id: 1
      },
      {
        idDocumento: 14,
        idFileServer: 9387,
        aprobado: true,
        path: 'http://192.168.20.89:3657//CONTRATO_CONSIGNACION/5-9-5\\CXP/RFC.pdf',
        pathFisico: '/CONTRATO_CONSIGNACION/5-9-5\\CXP/RFC.pdf',
        nombre: 'Registro Federal de Causantes',
        extencion: 'pdf',
        docActivo: 1,
        docOpcional: 0,
        docProceso: 1,
        docFisica: 1,
        docMoral: 1,
        docVarios: 0,
        docUsuarios: 1,
        nombreCorto: 'RFC',
        docFisicaAe: 1,
        docCertificacion: 0,
        id: 2
      },
      {
        idDocumento: 15,
        idFileServer: 9389,
        aprobado: true,
        path: 'http://192.168.20.89:3657//CONTRATO_CONSIGNACION/5-9-5\\CXP/ComprobanteDomicilio.pdf',
        pathFisico: '/CONTRATO_CONSIGNACION/5-9-5\\CXP/ComprobanteDomicilio.pdf',
        nombre: 'Comprobante de Domicilio no mayor a 3 meses',
        extencion: 'pdf',
        docActivo: 1,
        docOpcional: 0,
        docProceso: 1,
        docFisica: 1,
        docMoral: 1,
        docVarios: 0,
        docUsuarios: 1,
        nombreCorto: 'ComprobanteDomicilio',
        docFisicaAe: 1,
        docCertificacion: 0,
        id: 3
      },
      {
        idDocumento: 18,
        idFileServer: 9383,
        aprobado: true,
        path: 'http://192.168.20.89:3657//CONTRATO_CONSIGNACION/5-9-5\\CXP/ActaConstituva.pdf',
        pathFisico: '/CONTRATO_CONSIGNACION/5-9-5\\CXP/ActaConstituva.pdf',
        nombre: 'Acta Constitutiva inscrita en RPP',
        extencion: 'pdf',
        docActivo: 1,
        docOpcional: 0,
        docProceso: 1,
        docFisica: 0,
        docMoral: 1,
        docVarios: 0,
        docUsuarios: 1,
        nombreCorto: 'ActaConstituva',
        docFisicaAe: 0,
        docCertificacion: 0,
        id: 4
      },
      {
        idDocumento: 19,
        idFileServer: 9388,
        aprobado: true,
        path: 'http://192.168.20.89:3657//CONTRATO_CONSIGNACION/5-9-5\\CXP/PoderRepresentante.pdf',
        pathFisico: '/CONTRATO_CONSIGNACION/5-9-5\\CXP/PoderRepresentante.pdf',
        nombre: 'Poder Representante con acta de dominio',
        extencion: 'pdf',
        docActivo: 1,
        docOpcional: 0,
        docProceso: 1,
        docFisica: 0,
        docMoral: 1,
        docVarios: 0,
        docUsuarios: 1,
        nombreCorto: 'PoderRepresentante',
        docFisicaAe: 0,
        docCertificacion: 0,
        id: 5
      },
      {
        idDocumento: 20,
        idFileServer: 9386,
        aprobado: true,
        path: 'http://192.168.20.89:3657//CONTRATO_CONSIGNACION/5-9-5\\CXP/IdentificacionRepresentante.pdf',
        pathFisico: '/CONTRATO_CONSIGNACION/5-9-5\\CXP/IdentificacionRepresentante.pdf',
        nombre: 'Identificación oficial del Representante Legal (INE, PASAPORTE, Cédula Profesional)',
        extencion: 'pdf',
        docActivo: 1,
        docOpcional: 0,
        docProceso: 1,
        docFisica: 0,
        docMoral: 1,
        docVarios: 0,
        docUsuarios: 1,
        nombreCorto: 'IdentificacionRepresentante',
        docFisicaAe: 0,
        docCertificacion: 0,
        id: 6
      }
    ]
    this.Grid();
  }

  Grid() {
    this.toolbar = [];
    /*
   Columnas de la tabla
   */
    try {
      this.columns = [
        // {
        //   caption: 'Id',
        //   dataField: 'id'
        // },
        {
          caption: 'Documento',
          dataField: 'path',
          cellTemplate: 'pdf',
        },
        {
          caption: 'Nombre',
          dataField: 'nombre',
        },
        {
          caption: 'Aprobado',
          dataField: 'aprobado',
          dataType: TiposdeDato.boolean
        }
      ];

      /*
      Parametros de Paginacion de Grit
      */
      const pageSizes = ['10', '25', '50', '100'];

      /*
      Parametros de Exploracion
      */
      this.exportExcel = { enabled: true, fileName: 'Listado de caja' };
      // ******************PARAMETROS DE COLUMNAS RESPONSIVAS EN CASO DE NO USAR HIDDING PRIORITY**************** */
      this.columnHiding = { hide: true };
      // ******************PARAMETROS DE PARA CHECKBOX**************** */
      this.Checkbox = { checkboxmode: 'multiple' };  // *desactivar con none*/
      // ******************PARAMETROS DE PARA EDITAR GRID**************** */
      this.Editing = { allowupdate: false }; // *cambiar a batch para editar varias celdas a la vez*/
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
      this.toolbar.push(
        {
          location: 'after',
          widget: 'dxButton',
          locateInMenu: 'auto',
          options: {
            text: 'Eliminar',
            onClick: ''
          },
          visible: false,
          name: 'simple'
        }
      );

      this.toolbar.push(
        {
          location: 'after',
          widget: 'dxButton',
          locateInMenu: 'auto',
          options: {
            text: 'Aprobar',
            onClick: ''
          },
          visible: false,
          name: 'simple'
        }
      );

    } catch (error) {
      this.Excepciones(error, 1);
    }
  }

  AsignaDocumento(e) {
    this.documentoTemporal = Object.assign({}, this.documentos.find(x => x.idDocumento === e));
    this.IUploadFile.titulo = this.documentoTemporal.nombreCorto;
    this.IUploadFile.descripcion = this.documentoTemporal.nombre;
    this.IUploadFile.nombreDocumento = this.documentoTemporal.nombreCorto
    this.documentoTemporal.idFileServer = 0;
    this.documentoTemporal.path = ''
    this.documentoTemporal.aprobado = 0;
  }

  ResultUploadFile($event) {
    if ($event.recordsets.length > 0) {
      this.documentoTemporal.idFileServer = $event.recordsets[0].idDocumento
      this.documentoTemporal.pathFisico = $event.recordsets[0].pathFisico
      this.documentoTemporal.path = $event.recordsets[0].path
      this.snackBar.open('Se ha subido correctamente el archivo.', 'Ok', {
        duration: 10000
      });
    } else {
      this.snackBar.open('Error, intente subir de nuevo.', 'Ok', {
        duration: 10000
      });
    }
  }

  AsignaDocumentosTabla() {
    this.bandera = false
    setTimeout(() => {
      this.bandera = true
    }, 1000);
    this.documentosTemporales.push(this.documentoTemporal)
    this.contador --;
    this.documentoTemporal = false
  }



  Cancelar(): void {
    try {
      this.dialogRef.close();
    } catch (error) {
      this.Excepciones(error, 1);
    }
  }

  Excepciones(stack, tipoExcepcion: number) {
    try {
      const dialogRef = this.dialog.open(ExcepcionesComponent, {
        width: '60%',
        data: {
          idTipoExcepcion: tipoExcepcion,
          idOperacion: 1,
          idAplicacion: environment.aplicacionesId,
          moduloExcepcion: 'app-alert-dialog',
          mensajeExcepcion: '',
          stack
        }
      });

      dialogRef.afterClosed().subscribe((result: any) => {
      });
    } catch (error) {
      console.error(error);
    }
  }

}
