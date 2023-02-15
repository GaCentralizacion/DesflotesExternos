import { Component, OnInit, Inject } from '@angular/core';
import { CoalService } from '../../services/coal.service';
import { environment } from '../../../environments/environment';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { IGridOptions, IColumns, IExportExcel, ISearchPanel, IScroll, Toolbar, IColumnHiding, ICheckbox, IEditing, IColumnchooser, TiposdeDato, TiposdeFormato } from '../../interfaces';
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
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CdkTreeModule } from '@angular/cdk/tree';
import { DialogClient } from './modal-client/modal-client.component';
import { DialogLiberar } from './modal-liberar/modal-liberar.component';
import { DialogPrecio } from './modal-precio/modal-precio.component';

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
		{
			caption: 'VIN',
			dataField: 'numeroSerie',
			fixed: true,
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
			caption: 'Precio Final',
			dataField: 'precioFinal',
			dataType: TiposdeDato.number,
			format: TiposdeFormato.moneda,
			allowEditing: false,
			cssClass: 'cliente'
		},
		{
			caption: 'Vendido a',
			dataField: 'vendido',
			allowEditing: false,
			cssClass: 'cliente'
		},
		{
			caption: 'Factura Cliente',
			dataField: 'facturaVenta',
			allowEditing: false,
			cssClass: 'cliente',
			cellTemplate: 'pdfFactura'
		},
		{
			caption: 'Estatus de la unidad',
			dataField: 'textStatus',
			allowEditing: false,
			cssClass: 'cliente',
			cellTemplate: 'errorFactura'
		}
	];

	toolbar = []
	idCompania: any;
	idDesflote: any;
	catalogoMarcas: any;
	pdf: any;
	mostrarLectura: any = false;
	tipoBusqueda: number = 0;

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


	// contarUnidadesProcesadas() {
	// 	this.coalService.getService(`reporte/getUnidadesProcesadas`).subscribe((res: any) => {
	// 		if (res.err) {
	// 			this.Excepciones(res.err, 4);
	// 		} else if (res.excepcion) {
	// 			this.Excepciones(res.excepcion, 3);
	// 		} else {
	// 			this.primera = res.recordsets[0][0].contadorPrimera;
	// 			this.segunda = res.recordsets[1][0].contadorSegunda;
	// 		}
	// 	}, (error: any) => {
	// 		this.Excepciones(error, 2);
	// 	});
	// };


	usuarioCentralizacion(usuarioBpro) {
		this.lstbPro = [];
		this.coalService.getService(`common/getusuarioCentralizacion?idUsuarioBpro=${usuarioBpro}`).subscribe((res: any) => {
			if (res.err) {
				this.Excepciones(res.err, 4);
			} else if (res.excepcion) {
				this.Excepciones(res.excepcion, 3);
			} else {
				this.lstbPro = res.recordsets[0];
			}
		}, (error: any) => {
			this.Excepciones(error, 2);
		});
	};

	ChangeTab($event) {
		this.tipoBusqueda = $event.index;
		this.toolbarGeneral = [];
		this.toolbar = [];
		this.BotonesToolbar();
		if (this.getGeneralForm.controls.idDuenoUnidad.value !== '') {
			if (this.getGeneralForm.controls.idDesflote.value !== '') {
				this.GenerateReport();
			};
		};
		this.verGrid = false;
	};

	GenerateReport() {
		this.verGrid = false;
		this.spinner = true;
		this.lstDataReport = [];
		this.dataReport = [];
		this.idCompania = this.getGeneralForm.controls.idDuenoUnidad.value;
		this.idDesflote = this.getGeneralForm.controls.idDesflote.value;
		this.reporte = [];
		this.data = [];
		//this.porcentajeAvances()
		this.coalService.getService(`reporte/GetDataReport?tipoBusqueda=${this.tipoBusqueda}&idCompania=${this.idCompania}&idDesflote=${this.idDesflote}`).subscribe((res: any) => {
			if (res.err) {
				this.Excepciones(res.err, 4);
			} else if (res.excepcion) {
				this.Excepciones(res.excepcion, 3);
			} else {
				if (this.tipoBusqueda === 0)
					this.reporte = res.recordsets[0];
				else
					this.data = res.recordsets[0];

				this.verGrid = true;
			}
			this.spinner = false;
		}, (error: any) => {
			this.Excepciones(error, 2);
			this.spinner = false
		});
	};

	getCompaniaUnidad() {
		this.coalService.getService(`common/getCompaniaUnidad`).subscribe((res: any) => {
			if (res.err) {
				this.Excepciones(res.err, 4);
			} else if (res.excepcion) {
				this.Excepciones(res.excepcion, 3);
			} else {
				this.lstUnidadCompania = res.recordsets[0];
			};
		}, (error: any) => {
			this.Excepciones(error, 2);
		});
	};

	getEstado() {
		this.coalService.getService(`common/getEstado`).subscribe((res: any) => {
			if (res.err) {
				this.Excepciones(res.err, 4);
			} else if (res.excepcion) {
				this.Excepciones(res.excepcion, 3);
			} else {
				this.lstEstado = res.recordsets[0];
			};
		}, (error: any) => {
			this.Excepciones(error, 2);
		});
	};

	getCompania() {
		this.coalService.getService(`common/getCompaniaSucursal`).subscribe((res: any) => {
			if (res.err) {
				this.Excepciones(res.err, 4);
			} else if (res.excepcion) {
				this.Excepciones(res.excepcion, 3);
			} else {
				this.companias = res.recordsets[0];
				this.catalogoMarcas = res.recordsets[2];
				this.sucAceptanSeminuevos = res.recordsets[3];
			};
		}, (error: any) => {
			this.Excepciones(error, 2);
		});
	}

	getDesflote() {
		this.coalService.getService(`common/getDesflote`).subscribe((res: any) => {
			if (res.err) {
				this.Excepciones(res.err, 4);
			} else if (res.excepcion) {
				this.Excepciones(res.excepcion, 3);
			} else {
				this.lstDesflote = res.recordsets[0];
			};
		}, (error: any) => {
			this.Excepciones(error, 2);
		});
	};

	Alerta() {
		this.AlertDialog('Por favor de verificar');
	};

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
		};
	};

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

	BotonesToolbar() {
		this.toolbarGeneral = [];
		this.toolbar = [];
		this.mostrarLectura = true;
		if (this.mostrarLectura) {
			this.toolbarGeneral = [
				{
					location: 'after',
					widget: 'dxButton',
					locateInMenu: 'auto',
					options: {
						text: 'Precio',
						onClick: this.receiveMessage.bind(this, 'openModalPrecio')
					},
					visible: false,
					name: 'simple',
				},
				{
					location: 'after',
					widget: 'dxButton',
					locateInMenu: 'auto',
					options: {
						text: 'Venta',
						onClick: this.receiveMessage.bind(this, 'openModalVenta')
					},
					visible: false,
					name: 'simple',
				}
			];
			this.toolbar = [
				{
					location: 'after',
					widget: 'dxButton',
					locateInMenu: 'auto',
					options: {
						text: 'Liberar Unidad',
						onClick: this.receiveMessage.bind(this, 'openModalLiberaUnidad')
					},
					visible: false,
					name: 'simple'
				}
			];
		};
	};

	DataColumnsGrid() {
		this.columnsGeneral = [
			{
				caption: 'VIN',
				dataField: 'numeroSerie',
				allowEditing: false,
				cssClass: 'general',
				cellTemplate: 'showVin'
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
				caption: 'Concepto contable',
				dataField: 'DescBpro',
				allowEditing: false,
				cssClass: 'general'
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
				caption: 'Ver Descripcion',
				allowEditing: false,
				cssClass: 'general',
				cellTemplate: 'verDescripcion'
			}
		];
	}

	public saveDescriptionGrid = e => {
		if (e === 1) {
			this.GenerateReport();
		};
	};

	receiveMessage($event) {
		try {
			if ($event === 'openModalPrecio') {
				this.precioUnidad();
			} else if ($event === 'openModalVenta') {
				this.getClientBuy();
			} else if ($event === 'openModalLiberaUnidad') {
				this.liberarUnidad();
			};
		} catch (error) {
			this.Excepciones(error, 1);
		};
	};

	public precioUnidad = () => {
		this.spinner = true;
		let xml = `<unidades>$data</unidades>`;
		let dataXml = '';
		const dialogRef = this.dialog.open(DialogPrecio, {
			width: '50%',
			disableClose: true,
			data: {
				title: 'Actualización de precio',
				elementos: 'Cantidad de unidades a actualizar: ' + this.datosevent.length,
				unidades: this.datosevent
			}
		});
		dialogRef.afterClosed().subscribe(result => {
			if (!result) {
				this.snackBar.open('Actualización cancelada', 'Ok', { duration: 10000 });
				this.spinner = false;
			} else {
				this.spinner = true;
				this.datosevent.forEach(value => {
					console.log('value', value);
					dataXml += `<unidad><idUnidad>${value.idUnidad}</idUnidad><newPrice>${result.valorSelect}</newPrice><existeBpro>${value.existeBPRO}</existeBpro></unidad>`;
				});
				const data = {
					xmlUnits: xml.replace('$data', dataXml),
					idUsuarioActualiza: this.lstbPro[0].usu_idusuario
				};

				this.coalService.putService(`reporte/updatePrice`, data).subscribe((res: any) => {
					if (res.err) {
						this.Excepciones(res.err, 4);
					} else if (res.excepcion) {
						this.Excepciones(res.excepcion, 3);
					} else {
						if (res.recordsets[0][0].success === 1) {
							this.snackBar.open(res.recordsets[0][0].msg, 'Ok', { duration: 10000 });
						} else {
							this.snackBar.open(res.recordsets[0][0].msg, 'Ok', { duration: 10000 });
						};
						this.toolbarGeneral = [];
						this.toolbar = [];
						this.BotonesToolbar();
						this.GenerateReport();
					};
					this.spinner = false
				}, (error: any) => {
					this.Excepciones(error, 2);
					this.spinner = false
				});
			};
		});
	};

	public getClientBuy = () => {
		const verificaclaveProducto = this.datosevent.filter(x => x.cveContratoBpro === null);
		if (verificaclaveProducto.length > 0) {
			let vin = verificaclaveProducto[0]?.numeroSerie;
			return this.snackBar.open('La unidad con vin ' + vin + ' no tiene el concepto contable, favor de validar.', 'Ok', { duration: 15000 });
		};

		this.spinner = true;
		let xml = `<ventas>$data</ventas>`;
		let dataXml = '';
		const dialogRef = this.dialog.open(DialogClient, {
			width: '80%',
			disableClose: true,
			data: {
				title: 'Venta de unidades',
				elementos: 'Cantidad de unidades a vender: ' + this.datosevent.length,
				unidades: this.datosevent
			}
		});
		dialogRef.afterClosed().subscribe(result => {
			if (!result) {
				this.snackBar.open('Venta cancelada', 'Ok', { duration: 10000 });
				this.spinner = false;
			} else {
				this.spinner = true;
				if (isNaN(result.valorSelect[1]?.PER_IDPERSONA)) {
					this.spinner = false;
					return this.snackBar.open('Elija un cliente de los que estan en el combo', 'Ok', { duration: 10000 });
				};
				
				if (result.valorSelect[0]?.datosExtras && this.isEmptyObject(result.valorSelect[0]?.cfdi)) {
					this.spinner = false;
					return this.snackBar.open('Debe seleccionar el tipo de CFDI', 'Ok', { duration: 10000 });
				};

				// if (result.valorSelect[2] === '') {
				// 	this.spinner = false;
				// 	return this.snackBar.open('Debe seleccionar el concepto contable', 'Ok', { duration: 10000 });
				// };
				// if (result.valorSelect[2] === '0' || result.valorSelect[2] === 0) {
				// 	this.spinner = false;
				// 	return this.snackBar.open('Debe seleccionar el concepto contable', 'Ok', { duration: 10000 });
				// };

				this.datosevent.forEach(value => {
					if (isNaN(value.idUnidad)) {
						this.spinner = false;
						return this.snackBar.open('Error al procesar las ventas, favor de contactar al administrador [idUnidad]', 'Ok', { duration: 10000 });
					};
					if (this.lstbPro[0].usu_idusuario === '' || this.lstbPro[0].usu_idusuario === null || this.lstbPro[0].usu_idusuario === undefined) {
						this.spinner = false;
						return this.snackBar.open('Error al procesar las ventas, favor de contactar al administrador [idUsuario]', 'Ok', { duration: 10000 });
					};

					dataXml += `<venta><idUnidad>${value.idUnidad}</idUnidad><client>${result.valorSelect[1].PER_IDPERSONA}</client><userId>${this.lstbPro[0].usu_idusuario}</userId><sellPrice>${value.precioVentaIva}</sellPrice><buyPrice>${value.precioCompraIva}</buyPrice><existeBpro>${value.existeBPRO}</existeBpro></venta>`;
				});

				const data = {
					xmlVenta: xml.replace('$data', dataXml),
					datosExtras: result.valorSelect[0].datosExtras ? 1 : 0,
					cfdi: result.valorSelect[0].cfdi.idCfdi
				};

				if (data.cfdi === null || data.cfdi === undefined || data.cfdi === 'null') {
					this.spinner = false;
					return this.snackBar.open('Debe seleccionar el tipo de CFDI', 'Ok', { duration: 10000 });
				};

				this.coalService.postService(`reporte/sellUnit`, data).subscribe((res: any) => {
					if (res.err) {
						this.Excepciones(res.err, 4);
					} else if (res.excepcion) {
						this.Excepciones(res.excepcion, 3);
					} else {
						if (res.recordsets[0][0].success === 1) {
							this.snackBar.open(res.recordsets[0][0].msg, 'Ok', { duration: 10000 });
						} else {
							this.snackBar.open(res.recordsets[0][0].msg, 'Ok', { duration: 10000 });
						};
						this.toolbarGeneral = [];
						this.toolbar = [];
						this.BotonesToolbar();
						this.GenerateReport();
					};
					this.spinner = false;
				}, (error: any) => {
					this.Excepciones(error, 2);
					this.spinner = false
				});
			};
		});
	};

	public isEmptyObject = obj => {
		return Object.entries(obj).length === 0;
	}

	public liberarUnidad = () => {
		this.spinner = true;
		let xml = `<liberaciones>$data</liberaciones>`;
		let dataXml = '';
		const dialogRef = this.dialog.open(DialogLiberar, {
			width: '50%',
			disableClose: true,
			data: {
				title: 'Liberar Unidades',
				subTitle: '¿Estas seguro de liberar las unidades?',
				elementos: 'Cantidad de unidades a liberar: ' + this.datosevent.length,
				unidades: this.datosevent
			}
		});
		dialogRef.afterClosed().subscribe(result => {
			if (!result) {
				this.snackBar.open('Liberacion de unidades cancelada', 'Ok', { duration: 10000 });
				this.spinner = false;
			} else {
				this.spinner = true;
				this.datosevent.forEach(value => {
					dataXml += `<liberacion><idUnidad>${value.idUnidad}</idUnidad></liberacion>`;
				});

				const data = {
					xmlLiberacion: xml.replace('$data', dataXml),
					idUsuarioReversa: this.lstbPro[0].usu_idusuario
				};

				this.coalService.postService(`reporte/deleteVenta`, data).subscribe((res: any) => {
					if (res.err) {
						this.Excepciones(res.err, 4);
					} else if (res.excepcion) {
						this.Excepciones(res.excepcion, 3);
					} else {
						if (res.recordsets[0][0].success === 1) {
							this.snackBar.open(res.recordsets[0][0].msg, 'Ok', { duration: 10000 });
						} else {
							this.snackBar.open(res.recordsets[0][0].msg, 'Ok', { duration: 10000 });
						};
						this.toolbarGeneral = [];
						this.toolbar = [];
						this.BotonesToolbar();
						this.GenerateReport();
					};
				}, (error: any) => {
					this.Excepciones(error, 2);
					this.spinner = false
				});
			};
		});
	};

	datosMessage($event) {
		try {
			this.datosevent = $event.data;
		} catch (error) {
			this.Excepciones(error, 1);
		};
	};

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
		};
	};

}
