import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { CoalService } from '../../services/coal.service';
import { environment } from '../../../environments/environment';
import {MatTableDataSource} from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
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

export interface ListaNotificacion {
  idNotificacion: number;
  nombreTipo: string;
  mensaje: string;
  fecha: string;
  esActivo: number;
  
}

const NOTIFICACION_DATA: ListaNotificacion[] = [];

@Component({
  selector: 'app-sel-notificaciones',
  templateUrl: './sel-notificaciones.component.html',
  styleUrls: ['./sel-notificaciones.component.scss'],
  providers: [CoalService]
})
export class SelNotificacionesComponent implements OnInit {
  displayedColumns: string[] = ['icono', 'mensaje', 'nombreTipo', 'fecha'];
  dataSource = new MatTableDataSource(NOTIFICACION_DATA);

  state: any;

  @ViewChild(MatSort) sort: MatSort;

  ngAfterViewInit() {
      this.dataSource.sort = this.sort;
  }
  claveModulo = 'app-sel-notificaciones';
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

  distribuidores = [];
  fecha: string;
  historialCaja = [];
  vacio = false;
  datosNotificaciones = [{
    idNotificacion: 2,
    esActivo: 1,
    mensaje:"La unidad 3G1TA5CF4JL111882 ya se encuentra en Texcoco",
    nombreTipo:"mensaje",
    fecha:"hoy"
  },
  {
    idNotificacion: 2,
    esActivo: 0,
    mensaje:"Es necesaria la programación de pago para la unidad 3N6AD31A7LK823102",
    nombreTipo:"mensaje",
    fecha:"21/03/2020"
  },
  {
    idNotificacion: 1,
    esActivo: 1,
    mensaje:"solicitar factura para la unidad 3N6AD31A8LK823108",
    nombreTipo:"Facturación",
    fecha:"21/03/2020"
  },]
  

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
    this.LoadData();
  }
  abrirNotificacion( element ){
    console.log(element);
    this.router.navigate(['sel-general']);
  }

 

  receiveMessage($event) {
    try {
      this.evento = $event.event;
      if ($event === 'ver') {
        
      }
    } catch (error) {
      this.Excepciones(error, 1);
    }
  }

  /**
  * @description Obtenemos la data del componente 'grid-component'
  * @param $event Data del 'grid-component'
  * @returns Data en formato Json
  * @author Antonio GUerra
  */
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

  
  
  LoadData() {
    // this.spinner = true;
    // this.coalService.getService(`pendiente/GetListaNotificaciones`).subscribe(
    //     (res: any) => {
    //         if (res.err) {
    //             this.Excepciones(res.err, 4);
    //         } else if (res.excepcion) {
    //             this.Excepciones(res.excepcion, 3);
    //         } else {
    //             this.vacio = ( res.recordsets[0].length == 0 ) ? true : false;
                this.dataSource.data = this.datosNotificaciones;
                // this.arregloActivo = res.recordsets[0];
                // for(let i = 0; i < this.arregloActivo.length; i++){
                //     if(this.arregloActivo[i].esActivo == true){
                //         // console.log('algo', this.arregloActivo[i].esActivo);
                //         this.showUno = true;
                //     } else {
                //         this.showCero = false;
                //     }
                // }
                // let arreglo = [];
                // arreglo = this.dataSource.data;
                // console.log('arrelgo esActivo: ', this.arregloActivo);
    //         }
    //         this.spinner = false
    //     }, (error: any) => {
    //         this.Excepciones(error, 2);
    //         this.spinner = false
    //     }
    // )
}


  change(e){

  }

  validaFecha(e){

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
          moduloExcepcion: 'sel-notificaciones.component',
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
