import { Component, OnInit } from '@angular/core';
import { CoalService } from '../../services/coal.service';
import { environment } from '../../../environments/environment';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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
import { Datos } from '../../models/datos.model'
import { MatDialog } from '@angular/material/dialog';
import { DeleteAlertComponent } from '../../../app/utilerias/delete-alert/delete-alert.component';
import { ExcepcionesComponent } from '../../../app/utilerias/excepciones/excepciones.component';
import { AsignaBreadcrumb } from 'app/store/actions/permisos.actions';
import { Store } from '@ngrx/store';
import { AppState } from 'app/store/app.states';
import { AlertDialogComponent } from 'app/utilerias/alert-dialog/alert-dialog.component';
import { MatExpansionModule } from '@angular/material/expansion';
@Component({
  selector: 'app-sel-inventario',
  templateUrl: './sel-inventario.component.html',
  styleUrls: ['./sel-inventario.component.scss'],
  providers: [CoalService]
})
export class SelInventarioComponent implements OnInit {
  claveModulo = 'app-sel-inventario';
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
  objetosSelected;

  evento: string;
  datosevent: any;
  modulo: any;
  breadcrumb: any;
  spinner = false;


  distribuidores = [];
  fecha: string;
  historialCaja = [];
  lstDataReport = [];
  dataReport = [];
  lstUnidadCompania = [];
  verGrid: boolean = false;
  lstEstado = [];
  lstDesflote = [];
  getInventarioForm = new FormGroup({
    idDuenoUnidad: new FormControl('', [Validators.required]),
    idDesflote: new FormControl('', [Validators.required]),
    idEstado: new FormControl('', [Validators.required]),
  });
  inventario: any;

  constructor(
    public dialog: MatDialog,
    private coalService: CoalService,
    private baseService: BaseService,
    private router: Router,
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
    this.getEstado();
    this.getDesflote();
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


  GenerateReport(valor) {
    this.verGrid = false;
    this.spinner = true;
    this.lstDataReport = [];
    this.dataReport = [];
    this.coalService.getService(`reporte/GetDataInventario?idCompania=${this.getInventarioForm.value.idDuenoUnidad}&idDesflote=${this.getInventarioForm.value.idDesflote}&idEstado=${this.getInventarioForm.value.idEstado}`).subscribe(
      (res: any) => {
        if (res.err) {
          this.Excepciones(res.err, 4);
        } else if (res.excepcion) {
          this.Excepciones(res.excepcion, 3);
        } else {
          this.dataReport = res.recordsets[0];
          this.ObjectGrid();
        }
      }, (error: any) => {
        this.Excepciones(error, 2);
        this.spinner = false
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


  datosMessage($event) {
    try {
      this.datosevent = $event.data;
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

  ObjectGrid() {
    this.toolbar = [];
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


    } catch (error) {
      this.Excepciones(error, 1);
    }
    // this.BotonesToolbar();
    this.DataColumnsGrid();
  };

  DataColumnsGrid() {
    this.coalService.getService(`common/GetObjetoColumnsBase?idTipoReporte=${1}`).subscribe(
      (res: any) => {
        if (res.err) {
          this.Excepciones(res.err, 4);
        } else if (res.excepcion) {
          this.Excepciones(res.excepcion, 3);
        } else {
          const objetosColumns = res.recordsets[0];
          const columnsMulti = [];

          for (let index = 0; index < objetosColumns.length; index++) {

            if (!objetosColumns[index].allowupdate) {
              columnsMulti.push({
                caption: objetosColumns[index].titulo,
                dataField: objetosColumns[index].parametro,
                allowEditing: false,
                fixed: objetosColumns[index].fixed,
                dataType: objetosColumns[index].tipoCampo,
              });
            }
          }

          this.lstDataReport.push({
            idTipoReporte: 1,
            columnas: columnsMulti,
            dataReport: this.dataReport,
          });

          this.FillGrid();
        }


      }, (error: any) => {
        this.Excepciones(error, 2);
        this.spinner = false
      }
    );
  }

  FillGrid() {
    this.columns = this.lstDataReport.find(x => x.idTipoReporte === 1).columnas;
    this.inventario = this.lstDataReport.find(x => x.idTipoReporte === 1).dataReport;
    console.clear();
    this.verGrid = true;
    this.spinner = false;
  }


  verCaja() {
    this.router.navigateByUrl('/ins-caja');
  }

  change(e) {

  }

  validaFecha(e) {

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
          moduloExcepcion: 'sel-inventario.component',
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
