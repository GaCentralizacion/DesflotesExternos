import { Component, OnInit, Inject } from '@angular/core';
import { ExcepcionesComponent } from '../../../utilerias/excepciones/excepciones.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { environment } from 'environments/environment';
import { AlertDialogComponent } from 'app/utilerias/alert-dialog/alert-dialog.component';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CoalService } from 'app/services/coal.service';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { AppDateAdapter, APP_DATE_FORMATS } from '../../../models/formato-fecha-datepicker';
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

} from '../../../interfaces';

/**
 * Obtenemos el Mensaje a mostrar
 */
export interface SendData {
  unidades: any
}

@Component({
  selector: 'app-modal-intellimotors',
  templateUrl: './modal-intellimotors.component.html',
  styleUrls: ['./modal-intellimotors.component.sass'],
  providers: [CoalService, { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS }]
})
export class ModalIntellimotorsComponent implements OnInit {

  gridOptions: IGridOptions;
  columnsGeneral: IColumns[];
  exportExcel: IExportExcel;
  searchPanel: ISearchPanel;
  scroll: IScroll;
  toolbarGeneral: Toolbar[];
  columnHiding: IColumnHiding;
  Checkbox: ICheckbox;
  Editing: IEditing;
  Columnchooser: IColumnchooser;

  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<AlertDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SendData,
    private coalService: CoalService,
  ) {
  }

  ngOnInit() {
    
    this.Grid();
  }

  Grid() {
    this.toolbarGeneral = [];
    /*
   Columnas de la tabla
   */
    try {

      this.columnsGeneral = [
        {
          caption: 'VIN',
          dataField: 'numeroSerie',
        },
        {
          caption: 'Mensaje',
          dataField: 'mensaje',
        },
      ]
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
  };



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
