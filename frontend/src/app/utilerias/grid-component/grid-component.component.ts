import {
	Component, OnInit, Input, Output, EventEmitter, ElementRef, Renderer2, ViewChild, AfterViewInit,
	TemplateRef, HostListener
} from '@angular/core';
import {
	IGridOptions, IColumns, IExportExcel, ISearchPanel, IScroll, Toolbar, IColumnHiding,
	ICheckbox, IEditing, IColumnchooser, IDetail, Color
} from '../../interfaces';
import { DxDataGridComponent } from 'devextreme-angular';
import { MatDialog } from '@angular/material/dialog';
import { BaseService } from 'app/services/base.service';
import 'devextreme/integration/jquery';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DialogMapa } from './alert-mapa/alert-mapa.component'
import { CoalService } from '../../services/coal.service';
import { ExcepcionesComponent } from '../../../app/utilerias/excepciones/excepciones.component';
import { MatSnackBar } from '@angular/material/snack-bar';
// import { google } from '@agm/core/services/google-maps-types';
@Component({
	selector: 'app-grid-component',
	templateUrl: './grid-component.component.html',
	styleUrls: ['./grid-component.component.scss'],
	providers: [CoalService]
})
export class GridComponentComponent implements OnInit, AfterViewInit {

	@ViewChild('Gridlightbox') Gridlightbox: TemplateRef<any>;
	@ViewChild('Gridlightbox2') Gridlightbox2: TemplateRef<any>;
	@ViewChild('grid') dataGrid: DxDataGridComponent;
	@ViewChild('griddetail') dataGriddetail: DxDataGridComponent;
	@ViewChild('grid', { read: ElementRef }) grid: ElementRef;
	@ViewChild('griddetail', { read: ElementRef }) griddetail: ElementRef;
	// ******************SE RECIBEN PARAMETROS Y SE ENVIA RESPUESTA**************** */
	@Input() datos: any[];
	@Input() datosdetail: [];
	@Input() Detail: IDetail;
	@Input() gridOptions: IGridOptions;
	@Input() columnHiding: IColumnHiding;
	@Input() Checkbox: ICheckbox;
	@Input() Editing: IEditing;
	@Input() CheckboxDetail: ICheckbox;
	@Input() Columnchooser: IColumnchooser;
	@Input() columns: IColumns[];
	@Input() columnsdetail: IColumns[];
	@Input() exportExcel: IExportExcel;
	@Input() searchPanel: ISearchPanel;
	@Input() scroll: IScroll;
	@Input() toolbar: Toolbar[];
	@Input() toolbardetail: Toolbar[];
	@Input() Color: Color;
	@Input() keyfather: string;
	@Input() keyfilter: string;
	@Input() keyDetalle: string;
	@Input() reglas: boolean;
	@Input() selectedRowKeys: any[];
	@Input() selectedRowKeysDetail: any[];
	@Input() KeyExprDetail: string;
	@Input() id: string;
	@Input() catalogoModelo: [];
	@Input() catalogoVersion: [];
	@Input() tipoReporte: any;
	@Input() cuentaPrimera: any;
	@Input() cuentaSegunda: any;

	@Output() messageEvent = new EventEmitter<{ event: string, data: [] }>();
	remoteOperations: boolean;
	@Output() datosevent = new EventEmitter<{ data: [], event: any }>();
	@Output() datosdetailevent = new EventEmitter<{ data: [], event: any, datosPadre: any }>();
	@Output() documentosModal = new EventEmitter<{ vin }>();
	@Output() editevent = new EventEmitter<any>();
	@Output() onInitialized = new EventEmitter<any>();
	@Output() onRowUpdated = new EventEmitter<any>();
	@Output() onRowInserted = new EventEmitter<any>();
	@Output() onRowRemoved = new EventEmitter<any>();
	@Output() onInitNewRow = new EventEmitter<any>();
	@Output() onCellClickEvent = new EventEmitter<any>();
	public contador = 0;
	public contadordetail = 0;
	public toole;
	public tooledetail;
	public totales = 0;
	public primera = 0;
	public segunda = 0;
	public elementosFiltrados = 0;
	documentos: [];
	DataSourceStorage: any;
	public newInnerWidth: number;
	justDeselected: any;
	usuarioBpro: any;
	pdf: ArrayBufferLike;
	arregloDocumento = [];
	pathComprobantePago: String;
	spinner = false;
	banderaActualizar = 1;

	catalogoUbicacionFisica = [
		{
			Nombre: 'Id unidad',
		},
		{
			Nombre: 'VIN',
		},]

	constructor(private element: ElementRef,
		private renderer: Renderer2,
		public dialog: MatDialog,
		private coalService: CoalService,
		private snackBar: MatSnackBar,
		private baseService: BaseService,
		private httpClient: HttpClient,) {
		this.DataSourceStorage = [];
	}

	ngAfterViewInit() {
		const div = this.grid.nativeElement.querySelector('.dx-datagrid-filter-panel');
		const parent = this.grid.nativeElement.querySelector('.dx-datagrid');
		const refChild = this.element.nativeElement.querySelector('.dx-datagrid-headers');
		this.renderer.insertBefore(parent, div, refChild);
	}

	// ******************PARAMETROS QUE SE AJUSTARAN SEGUN SE REAJUSTE LA RESOLUCION DEL DISPOSITIVO**************** */
	@HostListener('window:resize', ['$event'])
	onResize(event) {
		this.newInnerWidth = event.target.innerWidth;
		if (this.newInnerWidth <= 768) {
			this.columnHiding = { hide: true };
			this.gridOptions = { paginacion: 10, pageSize: [10, 30, 50, 100] };
		} else if (this.newInnerWidth > 768) {
			this.columnHiding = { hide: false };
			if (this.gridOptions === undefined) {
				this.gridOptions = { paginacion: 50, pageSize: [50, 100, 300, 500] };
			}
		}
	}

	ngOnInit() {
		// this.primera = this.cuentaPrimera;
		// this.segunda = this.cuentaSegunda;
		// this.contarUnidadesProcesadas();
		const getStateUser = this.baseService.getUserData();
		this.usuarioBpro = getStateUser.usuarioBpro
		this.datos.forEach((data: any, index) => {
			for (const key in data) {
				if (data.hasOwnProperty(key)) {
					const element = data[key];
					if (key === this.keyDetalle) {
						this.datos[index].detalle = element;
						delete data[key];
					}
				}
			}
		});
		// setInterval(() => {
		//   this.contarUnidadesProcesadas();
		// }, 60000);
		this.newInnerWidth = window.innerWidth;
		if (this.newInnerWidth <= 768) {
			this.columnHiding = { hide: true };
			this.gridOptions = { paginacion: 10, pageSize: [10, 30, 50, 100] };
		} else if (this.newInnerWidth > 768) {
			this.columnHiding = { hide: false };
			if (this.gridOptions === undefined) {
				this.gridOptions = { paginacion: 100, pageSize: [10, 30, 50, 100] };
			}
		}
		const idDocumentos = [];
		this.documentos = [];

		// ******************PARAMETROS DE EXPORTACION**************** */
		this.exportExcel = { enabled: true, fileName: 'Datos' };

		// ******************PARAMETROS DE PARA SELECCION DE COLUMNAS**************** */
		this.Columnchooser = { columnchooser: true };

		// ******************PARAMETROS DE SEARCH**************** */
		this.searchPanel = { visible: true, width: 250, placeholder: 'Buscar...', filterRow: true };

		// ******************PARAMETROS DE SCROLL**************** */
		this.scroll = { mode: 'standard' };

		// ******************PARAMETROS DE MAESTRO DETALLE**************** */
		if (this.Detail === undefined) {
			this.Detail = { detail: false };
		}

		// ******************PARAMETROS DE CONTROL DE COLORES**************** */
		if (this.Color === undefined) {
			this.Color = { filas: true, columnas: true, alternar: false };
		} else if (this.Color.color === 'gris') {
			this.Color = { filas: false, columnas: false, alternar: true, color: 'gris' };
		} else {
			this.Color = { filas: true, columnas: true, alternar: false };
		}
	}

	contarUnidadesProcesadas() {
		if (this.banderaActualizar === 1) {
			this.coalService.getService(`reporte/getUnidadesProcesadas`).subscribe(
				(res: any) => {
					if (res.err) {
						this.Excepciones(res.err, 4);
						this.banderaActualizar = 0;
					} else if (res.excepcion) {
						this.Excepciones(res.excepcion, 3);
						this.banderaActualizar = 0;
					} else {
						this.banderaActualizar = 1;
						this.primera = res.recordsets[0][0].contadorPrimera;
						this.segunda = res.recordsets[1][0].contadorSegunda;
					}
				}, (error: any) => {
					this.banderaActualizar = 0;
					this.Excepciones(error, 2);
				}
			);
		}

	}

	MostrarDocumentos(value) {
		this.documentosModal.emit({ vin: value });
	}
	// ******************SE DEVUELVE EVENTO CLICK**************** */
	onclick(event, data) {
		this.messageEvent.emit({ event, data });
	}

	// ******************CONTADOR DE ITEMS SELECCINADOS Y DEVUELVE DATOS AL EMITER**************** */


	onSelectionChanged(e) {
		if (this.reglas) {
			e.component.collapseAll(-1);
			e.component.expandRow(e.currentSelectedRowKeys[0]);
		}
		const disabledKeys = e.currentSelectedRowKeys.filter(i => (i.disable));
		if (disabledKeys.length > 0) {
			if (this.justDeselected) {
				this.justDeselected = false;
				e.component.deselectAll();
			} else {
				this.justDeselected = true;
				e.component.deselectRows(disabledKeys);
			}
		}
		const data = e.selectedRowsData;
		this.totales = 0;
		data.forEach(x => {
			this.totales += Number(x.precioVentaIva);
		});
		this.datosevent.emit({ data, event: e });
		const cont = [];
		cont.push(e.selectedRowKeys);
		this.contador = cont[0].length;
		for (let i = 0; i < this.toole.toolbarOptions.items.length - 1; i++) {
			if (this.toole.toolbarOptions.items[i].name) {
				if (cont[0].length >= 1 && this.toole.toolbarOptions.items[i].name === 'simple') {
					this.toole.toolbarOptions.items[i].visible = true;

					if (cont[0].length >= 2 && this.toole.toolbarOptions.items[i].name2 === 'multiple') {
						this.toole.toolbarOptions.items[i].visible = false;

					}
				} else if (cont[0].length <= 0 && this.toole.toolbarOptions.items[i].name === 'simple') {
					this.toole.toolbarOptions.items[i].visible = false;
				}
			}
		}
		this.dataGrid.instance.refresh();
	}

	// ******************CONTADOR DE ITEMS SELECCINADOS Y DEVUELVE DATOS AL EMITER DE MAESTRO DETALLE**************** */
	onSelectionChangedDetail(e, datosPadre) {
		const disabledKeys = e.currentSelectedRowKeys.filter(i => (i.disable));
		if (disabledKeys.length > 0) {
			if (this.justDeselected) {
				this.justDeselected = false;
				e.component.deselectAll();
			} else {
				this.justDeselected = true;
				e.component.deselectRows(disabledKeys);
			}
		}
		const data = e.selectedRowsData;
		this.datosdetailevent.emit({ data, event: e, datosPadre });
		const dataGrid = e.component;
		const element = e.component._$element;
		const contadorHTML: Element = element[0];
		contadorHTML.getElementsByClassName('countcount')[0].innerHTML = dataGrid.getSelectedRowKeys().length;

		for (let i = 0; i < this.tooledetail.toolbarOptions.items.length - 1; i++) {
			if (this.tooledetail.toolbarOptions.items[i].name) {
				if (dataGrid.getSelectedRowKeys().length >= 1 && this.tooledetail.toolbarOptions.items[i].name === 'simple') {
					this.tooledetail.toolbarOptions.items[i].visible = true;

					if (dataGrid.getSelectedRowKeys().length >= 2 && this.tooledetail.toolbarOptions.items[i].name2 === 'multiple') {
						this.tooledetail.toolbarOptions.items[i].visible = false;

					}
				} else if (dataGrid.getSelectedRowKeys().length <= 0 && this.tooledetail.toolbarOptions.items[i].name === 'simple') {
					this.tooledetail.toolbarOptions.items[i].visible = false;
				}
			}
		}
		this.dataGriddetail.instance.refresh();
	}

	// ******************DEVUELVE LOS DATOS EDITADOS DEL GRID **************** */
	onRowUpdating(e) {
		const key = e.oldData;
		const newdata = e.newData;
		const editdata = {
			key,
			newData: newdata
		};
		this.editevent.emit({ editdata });
		this.dataGrid.instance.repaint();
	}

	// ******************DEVUELVE LOS DATOS EDITADOS DEL GRID MAESTRO DETALLE**************** */
	onRowUpdatingDetail(e) {
		const key = e.oldData;
		const newdata = e.newData;
		const editdata = {
			key,
			newData: newdata
		};
		this.editevent.emit({ editdata });
		this.dataGriddetail.instance.repaint();
	}

	// ******************CREACION DE TOOLBAR**************** */

	onToolbarPreparing(e) {
		this.toole = e;

		e.toolbarOptions.items.unshift({
			location: 'before',
			template: 'Totalderegistros'
		},
			{
				location: 'before',
				template: 'ContarFiltrados',
			},
			{
				location: 'before',
				template: 'Contarseleccionados',
				visible: false,
				name: 'simple'
			},

			{
				location: 'before',
				template: 'ContarPrecio',
				visible: false,
				name: 'simple'
			},

			...this.toolbar
		);

		// if (this.tipoReporte === 1) {
		//   e.toolbarOptions.items.unshift({
		//     location: 'before',
		//     template: 'Totalderegistros'
		//   },
		//     {
		//       location: 'before',
		//       template: 'primerAsignacion',
		//     },
		//     {
		//       location: 'before',
		//       template: 'Contarseleccionados',
		//       visible: false,
		//       name: 'simple'
		//     },
		//     {
		//       location: 'before',
		//       template: 'ContarPrecio',
		//       visible: false,
		//       name: 'simple'
		//     },

		//     ...this.toolbar
		//   );
		// }

		// if (this.tipoReporte === 2) {
		//   e.toolbarOptions.items.unshift({
		//     location: 'before',
		//     template: 'Totalderegistros'
		//   },
		//     {
		//       location: 'before',
		//       template: 'segundaAsignacion',
		//     },
		//     {
		//       location: 'before',
		//       template: 'Contarseleccionados',
		//       visible: false,
		//       name: 'simple'
		//     },
		//     {
		//       location: 'before',
		//       template: 'ContarPrecio',
		//       visible: false,
		//       name: 'simple'
		//     },

		//     ...this.toolbar
		//   );
		// }

	}

	// ******************CREACION DE TOOLBAR MAESTRO DETALLE**************** */

	onToolbarPreparingDetail(e) {
		this.tooledetail = e;

		e.toolbarOptions.items.unshift({
			location: 'before',
			template: 'Totalderegistrosdetail'
		},
			{
				location: 'before',
				template: 'Contarseleccionadosdetail'
			},
			...this.toolbardetail
		);
	}

	// ***************COLUMN CHOOSER EVENT****************** */
	onContentReady(e) {
		this.elementosFiltrados = e.component.getDataSource().totalCount();
		if (this.reglas) {
			if (!e.component.getSelectedRowKeys().length) {
				e.component.selectRowsByIndexes(0);
			}
		}
		this.datos.forEach((data: any, index) => {
			for (const key in data) {
				if (data.hasOwnProperty(key)) {
					const element = data[key];
					if (key === this.keyDetalle) {
						this.datos[index].detalle = element;
						delete data[key];
					}
				}
			}
		});
		if (this.Color.color === 'gris') {
			const cont = this.grid.nativeElement.querySelector('.dx-header-row');
			this.renderer.setStyle(cont, 'background', 'transparent');
			this.renderer.setStyle(cont, 'font-weight', 'bold');
		}
	}

	// ***************COLUMN CHOOSER EVENT MAESTRO DETALLE****************** */
	onContentReadyDetail(e) {
		if (this.Color.color === 'gris') {
			const cont = this.griddetail.nativeElement.querySelector('.dx-header-row');
			this.renderer.setStyle(cont, 'background', 'transparent');
			this.renderer.setStyle(cont, 'font-weight', 'bold');
		}
	}

	onInitializedMaster($event) {
		this.onInitialized.emit(this.dataGrid);
	}

	onCellPrepared(e) {
		if (e.rowType === 'data' && e.column.command === 'select' && e.data.disable === true) {
			e.cellElement.find('.dx-select-checkbox').dxCheckBox('instance').option('disabled', true);
			e.cellElement.off();
		}
	}

	onCellClick(e) {
		this.onCellClickEvent.emit(e);
	}

	onCellPreparedDetail(e) {
		if (e.rowType === 'data' && e.column.command === 'select' && e.data.disable === true) {
			e.cellElement.find('.dx-select-checkbox').dxCheckBox('instance').option('disabled', true);
			e.cellElement.off();
		}
	}

	onRowPrepared(e) {
		if (e.rowType === 'data') {
			if (e.data.backgroundcolor) {
				e.rowElement.find('td').css('background', e.data.backgroundcolor);
			}
			if (e.data.opacity) {
				e.rowElement.find('td').css('opacity', e.data.opacity);
			}
			if (e.data.font) {
				e.rowElement.find('td').css('font-weight', e.data.font);
			}
		}
	}

	onRowPreparedDetail(e) {
		if (e.rowType === 'data') {
			if (e.data.backgroundcolor) {
				e.rowElement.find('td').css('background', e.data.backgroundcolor);
			}
		}
	}

	OnRowUpdated($event) {
		this.onRowUpdated.emit($event);
	}

	OnRowInserted($event) {
		this.onRowInserted.emit($event);
	}
	OnRowRemoved($event) {
		this.onRowRemoved.emit($event);
	}
	OnInitNewRow($event) {
		this.onInitNewRow.emit($event);
	}

	GetFacturaPdf(factura) {
		console.log(factura.data.rfcEmpresa)
		this.spinner = true;

		let body = {
			rfcEmisor: factura.data.rfcEmpresa,
			rfcReceptor: factura.data.rfcCliente,
			serie: factura.data.serie,
			folio: factura.data.folio
		};

		this.coalService.postService(`reporte/ObtenerFactura`, body).subscribe((res: any) => {
			if (res.err) {
				this.Excepciones(res.err, 4);
			} else if (res.excepcion) {
				this.Excepciones(res.excepcion, 3);
			} else {
				if (res.success === 1) {
					if (res.data.MuestraFacturaResult.pdf !== '') {
						this.pdf = this.TransformaBase64(res.data.MuestraFacturaResult.pdf);
						this.spinner = false;
						this.dialog.open(this.Gridlightbox, {
							width: '80%',
							disableClose: false
						});
					} else {
						this.snackBar.open('Error al regresar la factura.', 'Ok', { duration: 10000 });
						this.spinner = false;
					};
				} else {
					this.spinner = false;
					this.snackBar.open('Error al regresar la factura.', 'Ok', { duration: 10000 });
				};
			};
		}, (error: any) => {
			this.Excepciones(error, 2);
		});
	};

	GetFacturaPdfSegundaAsignacion(data) {
		if (data.key.idCompania1 === data.key.idCompania2 && data.key.idSucursal1 === data.key.idSucursal2) {
			this.GetFacturaPdf(data.key.factura1);
		} else {
			let ruta = data.key.rutaPDF;
			let factura = data.key.factura2;
			// this.arregloDocumento.length = 0;    
			const body = {
				url: `${ruta}${factura}.pdf`
			}
			this.coalService.postService(`reporte/PostBuscaSegundaFactura`, body).subscribe(
				(res: any) => {
					if (res.err) {
						this.Excepciones(res.err, 4);
					} else if (res.excepcion) {
						this.Excepciones(res.excepcion, 3);
					} else {
						// this.arregloDocumento = res.documento;
						this.pdf = this.TransformaBase64(res.documento)
						this.dialog.open(this.Gridlightbox)
						// console.log(this.arregloDocumento);
					}
				}, (error: any) => {
					this.Excepciones(error, 2);
				}
			);
		}

	}

	GetFacturaCliente(data) {
		let ruta = data.key.rutaPDFCliente;
		let factura = data.key.facturaCliente;
		// this.arregloDocumento.length = 0;    
		const body = {
			url: `${ruta}${factura}.pdf`
		}
		this.coalService.postService(`reporte/PostBuscaSegundaFactura`, body).subscribe(
			(res: any) => {
				if (res.err) {
					this.Excepciones(res.err, 4);
				} else if (res.excepcion) {
					this.Excepciones(res.excepcion, 3);
				} else {
					// this.arregloDocumento = res.documento;
					this.pdf = this.TransformaBase64(res.documento)
					this.dialog.open(this.Gridlightbox)
					// console.log(this.arregloDocumento);
				}
			}, (error: any) => {
				this.Excepciones(error, 2);
			}
		);


	}


	TransformaBase64(base64) {
		// tslint:disable-next-line:variable-name
		let binary_string = base64.replace(/\\n/g, '');
		binary_string = window.atob(base64);
		const len = binary_string.length;
		const bytes = new Uint8Array(len);
		for (let i = 0; i < len; i++) {
			bytes[i] = binary_string.charCodeAt(i);
		}
		return bytes.buffer;
	}

	TransformaBase641(base64) {
		// tslint:disable-next-line:variable-name
		let binary_string
		binary_string = window.atob(base64);
		const len = binary_string.length;
		const bytes = new Uint8Array(len);
		for (let i = 0; i < len; i++) {
			bytes[i] = binary_string.charCodeAt(i);
		}
		return bytes.buffer;
	}

	mostrarMapa(data) {
		this.spinner = true;
		let uniqueid = data.key.numeroSerie;
		let latitud = 0;
		let longitud = 0;
		this.coalService.getService(`reporte/GetPosicionVehiculo?uniqueid=${uniqueid}`).subscribe(
			(res: any) => {
				if (res.err) {
					this.Excepciones(res.err, 4);
				} else if (res.excepcion) {
					this.Excepciones(res.excepcion, 3);
				} else {
					if (res.recordsets[0].length > 0) {
						latitud = res.recordsets[0][0].pos_latitude == undefined ? 0 : res.recordsets[0][0].pos_latitude;
						longitud = res.recordsets[0][0].pos_longitude == undefined ? 0 : res.recordsets[0][0].pos_longitude;
					}
					else {
						this.spinner = false;
						return this.snackBar.open("Esta unidad no cuenta con un GPS registrado", 'Ok', { duration: 10000 });
					}
					const dialogRef = this.dialog.open(DialogMapa, {
						disableClose: true,
						width: '100%',
						data: {
							latitud,
							longitud
						}
					});
					this.spinner = false;
					dialogRef.afterClosed().subscribe(result => {
						console.log(result);
					});
				}
			}, (error: any) => {
				this.Excepciones(error, 2);
				this.spinner = false;
			}
		);
	}

	buscarDocumento(data) {
		this.arregloDocumento.length = 0;
		let ordenCompra: number;
		if (data.columnIndex === 10) {
			ordenCompra = Number(data.key.ordenCompra1);
		}
		else if (data.columnIndex === 19) {
			ordenCompra = Number(data.key.ordenCompra2);
		}
		const body = {
			//  folioOrden: "AU-ZM-NZA-US-PE-999"
			folioOrden: ordenCompra
		}
		this.coalService.postService(`reporte/PostComprobantePago`, body).subscribe(
			(res: any) => {
				if (res.err) {
					this.Excepciones(res.err, 4);
				} else if (res.excepcion) {
					this.Excepciones(res.excepcion, 3);
				} else {
					this.arregloDocumento = res.recordsets[0];
					console.log(this.arregloDocumento)
					this.pdf = this.TransformaBase641(this.arregloDocumento[0].documento)
					this.dialog.open(this.Gridlightbox)
					console.log(this.arregloDocumento);
				}
			}, (error: any) => {
				this.Excepciones(error, 2);
			}
		);

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
