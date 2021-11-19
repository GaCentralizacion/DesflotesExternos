import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CoalService } from 'app/services/coal.service';
import { ExcepcionesComponent } from '../../../utilerias/excepciones/excepciones.component';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

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
	vines: string = '';

	formSearchClient = new FormGroup({ cliente: new FormControl('', [Validators.required]) });
	retornarValores = { valorSelect: [] };
	dataSelect: any = [];

	formSelectClient = new FormControl([], [Validators.required]);
	FformSelectClient = new FormGroup({ selectClient: this.formSelectClient })
	options: Cliente[] = [];
	filteredOptions: Observable<Cliente[]>;

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

		data.unidades.forEach((value, index) => {
			if (data.unidades.length === index + 1) {
				this.vines += `${value.numeroSerie}`;
			} else {
				this.vines += `${value.numeroSerie}, `;
			};
		});
	};

	ngOnInit() {
		this.filteredOptions = this.formSelectClient.valueChanges.pipe(
			startWith(''),
			map(value => (typeof value === 'string' ? value : value.PER_NOMRAZON)),
			map(PER_NOMRAZON => (PER_NOMRAZON ? this._filter(PER_NOMRAZON) : this.options.slice())),
		);
	};

	saveData() {
		this.retornarValores.valorSelect = this.formSelectClient.value;
	};

	public getClientes = () => {
		this.spinner = true;
		let tipoBusqueda;
		let datosBusqueda = this.formSearchClient.value.cliente;
		this.formSelectClient.setValue([]);
		this.options = [];

		if (isNaN(Number(datosBusqueda))) {
			tipoBusqueda = 2;
		} else {
			tipoBusqueda = 1;
		};

		const url = `common/getClientes?tipoBusqueda=${tipoBusqueda}&datosBusqueda=${datosBusqueda}`;
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