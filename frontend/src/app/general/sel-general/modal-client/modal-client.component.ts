import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CoalService } from 'app/services/coal.service';
import { ExcepcionesComponent } from '../../../utilerias/excepciones/excepciones.component';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ThemePalette } from '@angular/material/core';

export interface SendData {
	unidades: any;
	//select: string;
	title: string;
	elementos: string;
};

export interface Cliente {
	PER_IDPERSONA: number
	PER_NOMRAZON: string;
};

@Component({
	selector: 'modal-client',
	templateUrl: 'modal-client.component.html',
	styleUrls: ['./modal-client.component.scss'],
	providers: [CoalService]
})
export class DialogClient implements OnInit {
	spinner = false;
	//select: string;
	titulo: string;
	elementos: string;

	cliente = new FormControl('', [Validators.required])
	formSearchClient = new FormGroup({ cliente: this.cliente });
	retornarValores = { valorSelect: [] };
	dataSelect: any = [];

	formSelectClient = new FormControl([], [Validators.required]);
	// formConceptoContable = new FormControl([], [Validators.required]);
	FformSelectClient = new FormGroup({ selectClient: this.formSelectClient })
	options: Cliente[] = [];
	filteredOptions: Observable<Cliente[]>;
	// allConceptos: any

	color: ThemePalette = 'accent';
	public checked: boolean = true;
	public maxLengthTextArea: number = 5000;
	public tipoBusqueda: number = 0;
	public textBusqueda: string = '';
	public disabledUsoCfdi: boolean = true;

	// descriptionAditional = new FormControl('');
	cfdi = new FormControl({});
	datosExtras = new FormControl(this.checked);
	dataCfdi: any = [];

	formInoviceAdiotional = new FormGroup({ datosExtras: this.datosExtras, cfdi: this.cfdi })

	constructor(
		private fb: FormBuilder,
		public dialogRef: MatDialogRef<DialogClient>,
		@Inject(MAT_DIALOG_DATA) public data: SendData,
		private coalService: CoalService,
		public dialog: MatDialog,
		private snackBar: MatSnackBar) {

		//this.select = data.select;
		this.titulo = data.title;
		this.elementos = data.elementos;
	};

	ngOnInit() {
		// this.getselConceptosContables();
		this.filteredOptions = this.formSelectClient.valueChanges.pipe(
			startWith(''),
			map(value => (typeof value === 'string' ? value : value.PER_NOMRAZON)),
			map(PER_NOMRAZON => (PER_NOMRAZON ? this._filter(PER_NOMRAZON) : this.options.slice())),
		);

		this.formSelectClient.valueChanges.subscribe(dataChange => {
			this.eraseCfdi();
			this.dataCfdi = [];
			this.disabledUsoCfdi = true;
			if( (dataChange?.PER_IDPERSONA !== undefined || dataChange?.PER_IDPERSONA !== null) && (dataChange?.PER_IDPERSONA > 0) ){
				this.getselUsoCfdi(dataChange?.PER_IDPERSONA);
			};
		});
	};

	getselUsoCfdi = idCliente => {
		this.spinner = true;
		this.coalService.getService(`reporte/selUsoCfdi?idCliente=${idCliente}`).subscribe((res: any) => {
			if (res.err) {
				this.spinner = false;
				this.Excepciones(res.err, 4);
			} else if (res.excepcion) {
				this.spinner = false;
				this.Excepciones(res.excepcion, 3);
			} else {
				this.disabledUsoCfdi = false;
				this.spinner = false;
				this.dataCfdi = res.recordsets[0];
			};
		}, (error: any) => {
			this.Excepciones(error, 2);
		});
	};

	// getselConceptosContables = () => {
	// 	this.coalService.getService('reporte/selConceptosContables').subscribe((res: any) => {
	// 		if (res.err) {
	// 			this.spinner = false;
	// 			this.Excepciones(res.err, 4);
	// 		} else if (res.excepcion) {
	// 			this.spinner = false;
	// 			this.Excepciones(res.excepcion, 3);
	// 		} else {
	// 			this.spinner = false;
	// 			this.allConceptos = res.recordsets[0];
	// 		};
	// 	}, (error: any) => {
	// 		this.Excepciones(error, 2);
	// 	});
	// };

	saveData() {
		this.retornarValores.valorSelect.push(this.formInoviceAdiotional.value);
		this.retornarValores.valorSelect.push(this.formSelectClient.value);
		// this.retornarValores.valorSelect.push(this.formConceptoContable.value)
	};

	slideChange = e => {
		this.datosExtras.setValue(e.checked);
		this.cfdi.setValue({});
	};

	radioChange = e => {
		this.textBusqueda = parseInt(e.value) === 1 ? 'Escribe el ID del cliente que desea buscar' : 'Escribe el nombre con el que se desea buscar';
		this.tipoBusqueda = parseInt(e.value);
		this.cliente.setValue('');
		this.options = [];
		this.eraseCfdi();
		this.checked = false;
		this.FformSelectClient.reset();
	};

	public getClientes = () => {
		this.spinner = true;
		let datosBusqueda = this.formSearchClient.value.cliente;
		this.formSelectClient.setValue([]);
		this.options = [];


		if (this.tipoBusqueda !== 1) {
			if (this.tipoBusqueda !== 2) {
				this.spinner = false;
				return this.snackBar.open('Selecciona el tipo de busqueda del cliente', 'Ok', { duration: 5000 });
			};
		};

		if (this.tipoBusqueda === 1 && isNaN(Number(datosBusqueda))) {
			this.spinner = false;
			return this.snackBar.open('Si busca por ID cliente la busqueda es solo numerica', 'Ok', { duration: 5000 });
		};

		const url = `common/getClientes?tipoBusqueda=${this.tipoBusqueda}&datosBusqueda=${datosBusqueda}`;

		this.coalService.getService(url).subscribe((res: any) => {
			if (res.err) {
				this.Excepciones(res.err, 4);
			} else if (res.excepcion) {
				this.Excepciones(res.excepcion, 3);
			} else {
				this.spinner = false;
				if (res.recordsets[0].length > 0) {
					this.options = res.recordsets[0];
				} else {
					this.snackBar.open('Sin conincidencias por mostrar', 'Ok', { duration: 10000 });
				};
			};
		}, (error: any) => {
			this.Excepciones(error, 2);
		});
	};

	public eraseCfdi = () => {
		this.cfdi.setValue({});
	};

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
	};

	/*****
	 * FUNCIONES BUSQUEDA
	 */
	displayFn(Cliente: Cliente): string {
		return Cliente && Cliente.PER_NOMRAZON ? Cliente.PER_NOMRAZON : '';
	};

	private _filter(PER_NOMRAZON: string): Cliente[] {
		const filterValue = PER_NOMRAZON.toLowerCase();

		return this.options.filter(option => option.PER_NOMRAZON.toLowerCase().includes(filterValue));
	};

}