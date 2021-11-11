import { Component, OnInit } from '@angular/core';
import { CoalService } from '../../services/coal.service';
import { environment } from '../../../environments/environment';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as XLSX from 'xlsx';
import * as ExcelJS from 'exceljs/dist/exceljs.min.js';
import { exportDataGrid } from 'devextreme/excel_exporter';
import saveAs from 'file-saver';
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
import { MatSnackBar } from '@angular/material/snack-bar';
import { BaseService } from '../../../app/services/base.service';
import { Datos } from '../../models/datos.model'
import { MatDialog } from '@angular/material/dialog';
import { DeleteAlertComponent } from '../../../app/utilerias/delete-alert/delete-alert.component';
import { ExcepcionesComponent } from '../../../app/utilerias/excepciones/excepciones.component';
import { AsignaBreadcrumb } from 'app/store/actions/permisos.actions';
import { Store } from '@ngrx/store';
import { AppState } from 'app/store/app.states';
import { AlertDialogComponent } from 'app/utilerias/alert-dialog/alert-dialog.component';

@Component({
  selector: 'app-ins-captura',
  templateUrl: './ins-captura.component.html',
  styleUrls: ['./ins-captura.component.scss'],
  providers: [CoalService]
})
export class InsCapturaComponent implements OnInit {
  claveModulo = 'app-ins-captura';
  caja = [];
  // Grid variables
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

  evento: string;
  datosevent: any;
  modulo: any;
  breadcrumb: any;
  spinner = false;
  activaTab = true;
  lstUnidadCompania = [];
  lstUnidadesExternas = [];
  tituloFile = "Seleccione un archivo";
  distribuidores = [];
  fecha: string;
  historialCaja = [];
  getCapturaForm = new FormGroup({
    idDuenoUnidad: new FormControl('', [Validators.required]),
    importFile: new FormControl('', [Validators.required]),
  });
  arrayBuffer: any;

  constructor(
    public dialog: MatDialog,
    private coalService: CoalService,
    private baseService: BaseService,
    private router: Router,
    private snackBar: MatSnackBar,
    private store: Store<AppState>
  ) {
    this.store.dispatch(new AsignaBreadcrumb({
      breadcrumb: null
    }));
  }

  ngOnInit() {
    const getStateUser = this.baseService.getUserData();
    this.modulo = Datos.GetModulo(this.claveModulo, getStateUser.permissions.modules);
    if (this.modulo.breadcrumb) {
      this.breadcrumb = Datos.GetConfiguracionBreadCrumb(this.modulo.breadcrumb);
      this.store.dispatch(new AsignaBreadcrumb({
        breadcrumb: this.breadcrumb
      }));
    }
    this.getCompaniaUnidad();
  }

  DescargarPlantilla() {
    const workbook = new ExcelJS.Workbook();
    const general = workbook.addWorksheet('Plantilla');
    let columnas = ['numeroSerie', 'desflote', 'marca', 'submarca', 'modelo', 'accion']
    let headerRow = general.addRow(columnas);
    headerRow.eachCell((cell, number) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'D3D3D3' },
        bgColor: { argb: 'FF0000FF' }
      };
      cell.font = {
        size: 11,
        bold: true
      };
    });
    workbook.xlsx.writeBuffer().then((buffer) => {
      saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'Plantilla' + '-' + new Date().valueOf() + '.xlsx');
    });

  }

  GenerateReport(valor) {
    this.spinner = true;
    let idCompania = this.getCapturaForm.controls.idDuenoUnidad.value;
    const body = {
      idCompania: idCompania,
      UnidadesExternas: this.lstUnidadesExternas
    };
    this.coalService.postService("reporte/PostRegistroExternos", body).subscribe(
      (res: any) => {
        if (res.err) {
          this.Excepciones(res.err, 4);
        } else if (res.excepcion) {
          this.Excepciones(res.excepcion, 3);
        } else {
          this.tituloFile = "Seleccione un archivo";
          this.getCapturaForm.reset();
          this.snackBar.open(res.recordsets[0][0].mensaje, 'Ok', { duration: 10000 });
          this.spinner = false;
          this.router.navigateByUrl(`sel-inventario`);
        }
        this.spinner = false;
      }, (error: any) => {
        this.spinner = false;
        this.Excepciones(error, 2);
      }
    );
  }

  importExcel($event) {
    this.spinner = true;
    this.lstUnidadesExternas = [];
    let file = ($event.target as HTMLInputElement).files[0];
    if (file === undefined) {
      this.tituloFile = "Seleccione un archivo";
      this.snackBar.open("Favor de seleccionar un archivo válido", 'Ok', { duration: 10000 });
      this.spinner = false;
    } else {
      this.tituloFile = file.name;
      if (file.name.toLowerCase().indexOf(".xlsx") > 0 || file.name.toLowerCase().indexOf(".xls") > 0) {
        this.xlsxToJSON(file);
      }
      else {
        this.snackBar.open("Favor de seleccionar un archivo válido", 'Ok', { duration: 10000 });
        this.spinner = false;
      }
    }
  }

  xlsxToJSON(event) {
    let fileReader = new FileReader();
    fileReader.readAsArrayBuffer(event);
    fileReader.onload = async (e) => {
      this.arrayBuffer = fileReader.result;
      let data = new Uint8Array(this.arrayBuffer);
      let arr = new Array();
      for (let i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
      let bstr = arr.join("");
      let workbook = XLSX.read(bstr, { type: "binary" });
      let first_sheet_name = workbook.SheetNames[0];
      let worksheet = workbook.Sheets[first_sheet_name];
      let arraylist = XLSX.utils.sheet_to_json(worksheet, { raw: true });
      this.lstUnidadesExternas = arraylist;
      this.snackBar.open("Carga de datos completa", 'Ok', { duration: 10000 });
      this.spinner = false;
    }
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
          let indice = this.lstUnidadCompania.findIndex(x => x.idCompaniaUnidad === 0);
          this.lstUnidadCompania.splice(indice, 1);
        }
      }, (error: any) => {
        this.Excepciones(error, 2);
      }
    );
  }

  receiveMessage($event) {
    try {
      this.evento = $event.event;
      if ($event === 'ver') {
        this.verCaja();
      }
    } catch (error) {
      this.Excepciones(error, 1);
    }
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

  verCaja() {
    this.router.navigateByUrl('/ins-caja');
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
          idAplicacion: 13,
          moduloExcepcion: 'ins-captura.component',
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
