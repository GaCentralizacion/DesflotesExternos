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
			cssClass: 'cliente'
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

	// porcentajeAvances() {
	// 	this.coalService.getService(`reporte/porcentajeAvances?idCompaniaUnidad=${this.idCompania}&idDesflote=${this.idDesflote}`).subscribe((res: any) => {
	// 		if (res.err) {
	// 			this.Excepciones(res.err, 4);
	// 		} else if (res.excepcion) {
	// 			this.Excepciones(res.excepcion, 3);
	// 		} else {
	// 			this.porcentajePrimera = res.recordsets[0][0].porcentajePrimera;
	// 			this.porcentajeSegunda = res.recordsets[1][0].porcentajeSegunda;
	// 			this.facturasPendientesPrimera = res.recordsets[2][0].facturasPendientesPrimera;
	// 			this.ordenesPendientesPrimera = res.recordsets[3][0].ordenesPendientesPrimera;
	// 			this.facturasPendientesSegunda = res.recordsets[4][0].facturasPendientesSegunda;
	// 			this.ordenesPendientesSegunda = res.recordsets[5][0].ordenesPendientesSegunda;
	// 		}
	// 	}, (error: any) => {
	// 		this.Excepciones(error, 2);
	// 	});
	// };

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

	// FechaDiaCorrecto(fecha) {
	// 	return new Date(new Date(fecha).getTime() + new Date(fecha).getTimezoneOffset() * 60000)
	// };

	// sincronizarDocumentos() {
	// 	const dialogRef = this.dialog.open(AlertDialogComponent,
	// 		{
	// 			width: '350px',
	// 			data: '¿Desea Sincronizar documentos?'
	// 		}
	// 	);
	// 	dialogRef.afterClosed().subscribe(resultado => {
	// 		if (resultado) {
	// 			this.spinner = true;
	// 			this.lstMapeoDocumentos = [];
	// 			let unidadesSeleccionadas = {
	// 				unidadesSeleccionadas: this.datosevent
	// 			};
	// 			this.coalService.postService(`reporte/InsDocumentosExpediente`, unidadesSeleccionadas).subscribe((res: any) => {
	// 				if (res.err) {
	// 					this.Excepciones(res.err, 4);
	// 				} else if (res.excepcion) {
	// 					this.Excepciones(res.excepcion, 3);
	// 				} else {
	// 					console.log(res.recordsets[0]);
	// 					this.spinner = false;
	// 				};
	// 				this.spinner = false
	// 			}, (error: any) => {
	// 				this.Excepciones(error, 2);
	// 				this.spinner = false
	// 			});
	// 		} else {
	// 			this.snackBar.open('Sincronización cancelada', 'Ok', { duration: 5000 });
	// 		};
	// 	});
	// };

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
			// {
			// 	caption: 'Situación',
			// 	dataField: 'situacion',
			// 	allowEditing: false,
			// 	cssClass: 'general',
			// }
		];
	}

	// FillGrid() {
	// 	this.columnsGeneral = this.lstDataReport.find(x => x.idTipoReporte === 1).columnas;
	// 	this.reporte = this.lstDataReport.find(x => x.idTipoReporte === 1).dataReport;
	// 	console.clear();
	// 	this.verGrid = true;
	// 	this.spinner = false;
	// };

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
					dataXml += `<unidad><idUnidad>${value.idUnidad}</idUnidad><newPrice>${result.valorSelect}</newPrice></unidad>`;
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
		this.spinner = true;
		let xml = `<ventas>$data</ventas>`;
		let dataXml = '';
		const dialogRef = this.dialog.open(DialogClient, {
			width: '80%',
			disableClose: true,
			data: {
				title: 'Venta de unidades',
				//select: this.sucAceptanSeminuevos,//this.companias,
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

				if (isNaN(result.valorSelect[1].PER_IDPERSONA)) {
					this.spinner = false;
					return this.snackBar.open('Elija un cliente de los que estan en el combo', 'Ok', { duration: 10000 });
				};

				if (result.valorSelect[0].datosExtras && (result.valorSelect[0].descriptionAditional.length === 0 || result.valorSelect[0].cfdi.length === 0)) {
					this.spinner = false;
					return this.snackBar.open('Si selecciona datos extras debe escribir la descrpcion o el tipo de CFDI', 'Ok', { duration: 10000 });
				};

				this.datosevent.forEach(value => {
					dataXml += `<venta><idUnidad>${value.idUnidad}</idUnidad><client>${result.valorSelect[1].PER_IDPERSONA}</client><userId>${this.lstbPro[0].usu_idusuario}</userId><sellPrice>${value.precioVentaIva}</sellPrice><buyPrice>${value.precioCompraIva}</buyPrice></venta>`;
				});

				const data = {
					xmlVenta: xml.replace('$data', dataXml),
					datosExtras: result.valorSelect[0].datosExtras ? 1 : 0,
					cfdi: isNaN(result.valorSelect[0].cfdi.idCfdi) ? 0 : result.valorSelect[0].cfdi.idCfdi,
					descriptionAditional: result.valorSelect[0].descriptionAditional
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
			console.log('DATOS EVENTE=============', this.datosevent)
		} catch (error) {
			this.Excepciones(error, 1);
		};
	};

	// subeFactura() {
	// 	// this.spinner = true;
	// 	this.lstMapeoDocumentos = [];
	// 	let unidadesSeleccionadas = {
	// 		unidadesSeleccionadas: this.datosevent
	// 	};
	// 	console.log(unidadesSeleccionadas);
	// 	this.coalService.postService(`reporte/InsDocumentosExpedienteFactura`, unidadesSeleccionadas).subscribe((res: any) => {
	// 		if (res.err) {
	// 			this.Excepciones(res.err, 4);
	// 		} else if (res.excepcion) {
	// 			this.Excepciones(res.excepcion, 3);
	// 		} else {
	// 			this.spinner = false;
	// 			this.snackBar.open('Sincronizando Documentación', 'Ok', { duration: 5000 });
	// 		};
	// 		this.spinner = false
	// 	}, (error: any) => {
	// 		this.Excepciones(error, 2);
	// 		this.spinner = false
	// 	});
	// };

	// GuardaUnidadesDesflote(datosEmpresa,) {
	// 	let xmlUnidades = `<unidades>`
	// 	for (const e of this.datosevent) {
	// 		xmlUnidades += `<unidad><unidadId>${e.unidadId}</unidadId><numeroSerie>${e.numeroSerie}</numeroSerie></unidad>`
	// 	}
	// 	xmlUnidades += `</unidades>`
	// 	const datos = {
	// 		xmlUnidades
	// 	}
	// };

	// EnviarIntellimotors() {
	// 	const i = this.reporte.findIndex(x => x.vin === this.datosevent[0].vin)
	// 	if (this.reporte.length > 1) {
	// 		this.snackBar.open('Se enviaron las unidades a intellimotors', 'Ok', { duration: 10000 });
	// 	} else {
	// 		this.snackBar.open('Se envio la unidad a intellimotors', 'Ok', { duration: 10000 });
	// 	}
	// 	if (this.reporte[i].precioCompra === 0) {
	// 		this.spinner = true;
	// 		this.verGrid = false;
	// 		setTimeout(() => {
	// 			this.reporte[i].precioCompra = 350000
	// 			this.reporte[i].precioVenta = 440000
	// 			this.spinner = false;
	// 			this.verGrid = true;
	// 			this.snackBar.open('Las unidades se han registrado en intellimotors', 'Ok', { duration: 10000 });
	// 		}, 3000);
	// 	} else {
	// 		this.snackBar.open('Esta unidad ya esta registrada en intellimotors', 'Ok', { duration: 10000 });
	// 	}
	// }

	// Expediente(vin) {
	// 	let idCompania;
	// 	let idSucursal;
	// 	let numeroSerie = vin.key.numeroSerie;
	// 	if (vin.columnIndex === 6) {
	// 		idCompania = vin.key.idCompania1;
	// 		idSucursal = vin.key.idSucursal1;
	// 	}
	// 	else if (vin.columnIndex === 17) {
	// 		idCompania = vin.key.idCompania2;
	// 		idSucursal = vin.key.idSucursal2;
	// 	}

	// 	var url = 'http://192.168.20.123:4080';
	// 	var titulo = 'Login by User Id';
	// 	var form = document.createElement("form");
	// 	form.setAttribute("method", "post");
	// 	form.setAttribute("action", url);
	// 	form.setAttribute("target", titulo);
	// 	var hiddenField = document.createElement("input");
	// 	hiddenField.setAttribute("type", "hidden");
	// 	hiddenField.setAttribute("name", "idUsuario");
	// 	hiddenField.setAttribute("value", '71');
	// 	form.appendChild(hiddenField);

	// 	var hiddenField1 = document.createElement("input");
	// 	hiddenField1.setAttribute("type", "hidden");
	// 	hiddenField1.setAttribute("name", "idProceso");
	// 	hiddenField1.setAttribute("value", '1');
	// 	form.appendChild(hiddenField1);

	// 	var hiddenField2 = document.createElement("input");
	// 	hiddenField2.setAttribute("type", "hidden");
	// 	hiddenField2.setAttribute("name", "idEmpresa");
	// 	hiddenField2.setAttribute("value", idCompania);
	// 	form.appendChild(hiddenField2);

	// 	var hiddenField3 = document.createElement("input");
	// 	hiddenField3.setAttribute("type", "hidden");
	// 	hiddenField3.setAttribute("name", "idSucursal");
	// 	hiddenField3.setAttribute("value", idSucursal);
	// 	form.appendChild(hiddenField3);

	// 	var hiddenField4 = document.createElement("input");
	// 	hiddenField4.setAttribute("type", "hidden");
	// 	hiddenField4.setAttribute("name", "vin");
	// 	hiddenField4.setAttribute("value", numeroSerie);
	// 	form.appendChild(hiddenField4);

	// 	document.body.appendChild(form);
	// 	window.open('', titulo);
	// 	form.submit();
	// };

	// SegundaAsignacion(valor) {
	// 	const i = this.data.findIndex(x => x.vin === this.datosevent[0].vin)
	// 	const nombreCompania = this.companias.find(x => x.idCompania === valor.idCompania).descripcion;
	// 	this.data[i].agenciaAsignada = nombreCompania;
	// 	this.data[i].PrecioFinFacturar2 = "$234,212.00";
	// 	this.data[i].factura2 = "SDF4232FD2S";
	// 	this.data[i].utilidad = "$22,233.00";
	// 	this.data[i].vendido = 'Santiago Juárez Salazar';
	// 	this.data[i].precioFinal = "$237,342.00";
	// 	this.data[i].ordenCompra2 = 'AU-AA-AAZ-ACS-PE-1135';
	// 	this.data[i].aprobada2 = 'Si';
	// 	this.data[i].vendida2 = 'Si';
	// 	this.data[i].traslados = 'Con traslado'

	// 	this.spinner = false;
	// };

	// datosUpd(e) {
	// 	const datos = {
	// 		idUnidad: e.editdata.key.idUnidad,
	// 		numeroSerie: e.editdata.key.numeroSerie,
	// 		key: Object.keys(e.editdata.newData)[0],
	// 		precio: e.editdata.newData[`${Object.keys(e.editdata.newData)}`]
	// 	};
	// 	this.coalService.postService(`reporte/UpdPrecio`, datos).subscribe((res: any) => {
	// 		if (res.err) {
	// 			this.Excepciones(res.err, 4);
	// 		} else if (res.excepcion) {
	// 			this.Excepciones(res.excepcion, 3);
	// 		} else {
	// 			this.snackBar.open(res.recordsets[0][0].mensaje, 'Ok', { duration: 10000 });
	// 			this.spinner = false;
	// 		}
	// 		this.spinner = false
	// 	}, (error: any) => {
	// 		this.Excepciones(error, 2);
	// 		this.spinner = false
	// 	});
	// };


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
