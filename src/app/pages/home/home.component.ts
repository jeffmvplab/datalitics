import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ConsultaService } from '../service/consulta.service';
import { ParametrosConsulta } from '../models/parametros-consulta.model';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { VariablesEmpresarialesConfia, ResultadosConsulta } from '../models/resultados-consulta.model';
import { ServiciosComunesService } from '../service/serviciosComunes.service';
import { BaseDeDatosService } from '../service/baseDeDatos.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CodigosPalabra } from '../models/codigos-palabra.model';
import { FiltrosModel } from '../models/filtros.model';
import { ExportarExcelService } from '../service/exportarExcel.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogoActualizarPlanComponent } from '../../components/dialogo-actualizar-plan/dialogo-actualizar-plan.component';
import { DialogoDescargarExcelComponent } from '../../components/dialogo-descargar-excel/dialogo-descargar-excel.component';
import { DepartamentoModel } from '../models/departamento.model';
import { CiudadModel } from '../models/ciudad.model';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit {

  parametrosMenu: FiltrosModel[];
  palabrasClaves: CodigosPalabra[];
  departamento: string = "";
  ciudad: string = "";
  palabraclave: string;
  form: FormGroup;
  mostrarProgresBar: boolean = false;
  resultadosEmpresa: VariablesEmpresarialesConfia[] = [];
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  displayedColumns: string[] =
    ['razonSocial', 'ciudadMpio', 'sector', 'tipo', 'ventas'];
  dataSource: MatTableDataSource<VariablesEmpresarialesConfia>;
  filtroEmpresa = [];
  listaDepartamentos: DepartamentoModel[];
  listaCiudad: CiudadModel[];

  labelDepartamento: string;
  labelCiudad: string;
  blnMostrarMensaje: boolean = false;
  numRegistrosEncontrados: number = 0;

  @ViewChild(MatPaginator) paginator: MatPaginator;


  constructor(
    private _consultaService: ConsultaService,
    private _snackBar: MatSnackBar,
    private _serviciosComunesService: ServiciosComunesService,
    private _baseDatosService: BaseDeDatosService,
    private _fb: FormBuilder,
    private _exportarExcelService: ExportarExcelService,
    private _dialog: MatDialog
    ) {
  }

  ngOnInit() {

    this.consultarInformacionUsuario();

    this.consultarDepartamento();

    let that = this;
    that.consultarPalabrasClave();

    this.form = this._fb.group({
      palabraclave: new FormControl('', Validators.compose([Validators.required, Validators.maxLength(50)])),
      departamento: new FormControl(''),
      ciudad: new FormControl(''),
    });

    this._serviciosComunesService.pasarParametros.subscribe(param => {
      this.parametrosMenu = param;
      this.filtrarConParametros();
    });

    this.blnMostrarMensaje = false;


    this.paginator._intl.nextPageLabel = 'Página siguiente';
    this.paginator._intl.previousPageLabel = 'Página anterior';
  }

  consultarInformacionUsuario() {
    this._consultaService.consultarInformacionUsuario();
  }

  consultarDepartamento() {
    this._consultaService.consultarDepartamento()
    .subscribe(data => {
      this.listaDepartamentos = data;
    });
  }

  seleccionarDepartamento(event: MatSelectChange) {
    if (event.value != "") {
      this.labelCiudad = "";
      this.labelDepartamento = `, departamento: ${event.source.triggerValue}`;

      this._consultaService.consultarCiudad(event.value)
      .subscribe(data => {
        this.listaCiudad = data;
      });
    } else {
      this.listaCiudad = [];
      this.labelDepartamento = "";
      this.labelCiudad = "";
    }
  }

  seleccionarCiudad(event: MatSelectChange) {
    if (event.value != "") {
      this.labelCiudad = `, ciudad: ${event.source.triggerValue}`;
    } else {
      this.labelCiudad = "";
    }
  }

  filtrarConParametros(){
    this.mostrarProgresBar = true;

    let gruposEncontrados = [];
    this.filtroEmpresa = [];


    if (this.parametrosMenu.length > 0) {
      const grouped = this.parametrosMenu.reduce(function(rv, x) {
        (rv[x.grupo] = rv[x.grupo] || []).push(x);
        return rv;
      }, {});

      Object.keys(grouped).forEach(key => {
        gruposEncontrados.push({
          grupo: key
        });
      });

      if(gruposEncontrados.length == 5) {
        this.filtroEmpresa = this.resultadosEmpresa.filter(e =>
          this.parametrosMenu.filter(x => x.grupo == gruposEncontrados[0].grupo).find(p => gruposEncontrados[0].grupo == 'personal' || gruposEncontrados[0].grupo == 'ventas_Netas' ? Number(e[gruposEncontrados[0].grupo]) >= Number(p.name.split("-")[0]) && Number(e[gruposEncontrados[0].grupo]) <= Number(p.name.split("-")[1]) : e[gruposEncontrados[0].grupo] == p.name) &&
          this.parametrosMenu.filter(x => x.grupo == gruposEncontrados[1].grupo).find(p => gruposEncontrados[1].grupo == 'personal' || gruposEncontrados[1].grupo == 'ventas_Netas' ? Number(e[gruposEncontrados[1].grupo]) >= Number(p.name.split("-")[0]) && Number(e[gruposEncontrados[1].grupo]) <= Number(p.name.split("-")[1]) : e[gruposEncontrados[1].grupo] == p.name) &&
          this.parametrosMenu.filter(x => x.grupo == gruposEncontrados[2].grupo).find(p => gruposEncontrados[2].grupo == 'personal' || gruposEncontrados[2].grupo == 'ventas_Netas' ? Number(e[gruposEncontrados[2].grupo]) >= Number(p.name.split("-")[0]) && Number(e[gruposEncontrados[2].grupo]) <= Number(p.name.split("-")[1]) : e[gruposEncontrados[2].grupo] == p.name) &&
          this.parametrosMenu.filter(x => x.grupo == gruposEncontrados[3].grupo).find(p => gruposEncontrados[3].grupo == 'personal' || gruposEncontrados[3].grupo == 'ventas_Netas' ? Number(e[gruposEncontrados[3].grupo]) >= Number(p.name.split("-")[0]) && Number(e[gruposEncontrados[3].grupo]) <= Number(p.name.split("-")[1]) : e[gruposEncontrados[3].grupo] == p.name) &&
          this.parametrosMenu.filter(x => x.grupo == gruposEncontrados[4].grupo).find(p => gruposEncontrados[4].grupo == 'personal' || gruposEncontrados[4].grupo == 'ventas_Netas' ? Number(e[gruposEncontrados[4].grupo]) >= Number(p.name.split("-")[0]) && Number(e[gruposEncontrados[4].grupo]) <= Number(p.name.split("-")[1]) : e[gruposEncontrados[4].grupo] == p.name)
        );
      }

      if(gruposEncontrados.length == 4) {
        this.filtroEmpresa = this.resultadosEmpresa.filter(e =>
          this.parametrosMenu.filter(x => x.grupo == gruposEncontrados[0].grupo).find(p => gruposEncontrados[0].grupo == 'personal' || gruposEncontrados[0].grupo == 'ventas_Netas' ? Number(e[gruposEncontrados[0].grupo]) >= Number(p.name.split("-")[0]) && Number(e[gruposEncontrados[0].grupo]) <= Number(p.name.split("-")[1]) : e[gruposEncontrados[0].grupo] == p.name) &&
          this.parametrosMenu.filter(x => x.grupo == gruposEncontrados[1].grupo).find(p => gruposEncontrados[1].grupo == 'personal' || gruposEncontrados[1].grupo == 'ventas_Netas' ? Number(e[gruposEncontrados[1].grupo]) >= Number(p.name.split("-")[0]) && Number(e[gruposEncontrados[1].grupo]) <= Number(p.name.split("-")[1]) : e[gruposEncontrados[1].grupo] == p.name) &&
          this.parametrosMenu.filter(x => x.grupo == gruposEncontrados[2].grupo).find(p => gruposEncontrados[2].grupo == 'personal' || gruposEncontrados[2].grupo == 'ventas_Netas' ? Number(e[gruposEncontrados[2].grupo]) >= Number(p.name.split("-")[0]) && Number(e[gruposEncontrados[2].grupo]) <= Number(p.name.split("-")[1]) : e[gruposEncontrados[2].grupo] == p.name) &&
          this.parametrosMenu.filter(x => x.grupo == gruposEncontrados[3].grupo).find(p => gruposEncontrados[3].grupo == 'personal' || gruposEncontrados[3].grupo == 'ventas_Netas' ? Number(e[gruposEncontrados[3].grupo]) >= Number(p.name.split("-")[0]) && Number(e[gruposEncontrados[3].grupo]) <= Number(p.name.split("-")[1]) : e[gruposEncontrados[3].grupo] == p.name)
        );
      }

      if(gruposEncontrados.length == 3) {
        this.filtroEmpresa = this.resultadosEmpresa.filter(e =>
          this.parametrosMenu.filter(x => x.grupo == gruposEncontrados[0].grupo).find(p => gruposEncontrados[0].grupo == 'personal' || gruposEncontrados[0].grupo == 'ventas_Netas' ? Number(e[gruposEncontrados[0].grupo]) >= Number(p.name.split("-")[0]) && Number(e[gruposEncontrados[0].grupo]) <= Number(p.name.split("-")[1]) : e[gruposEncontrados[0].grupo] == p.name) &&
          this.parametrosMenu.filter(x => x.grupo == gruposEncontrados[1].grupo).find(p => gruposEncontrados[1].grupo == 'personal' || gruposEncontrados[1].grupo == 'ventas_Netas' ? Number(e[gruposEncontrados[1].grupo]) >= Number(p.name.split("-")[0]) && Number(e[gruposEncontrados[1].grupo]) <= Number(p.name.split("-")[1]) : e[gruposEncontrados[1].grupo] == p.name) &&
          this.parametrosMenu.filter(x => x.grupo == gruposEncontrados[2].grupo).find(p => gruposEncontrados[2].grupo == 'personal' || gruposEncontrados[2].grupo == 'ventas_Netas' ? Number(e[gruposEncontrados[2].grupo]) >= Number(p.name.split("-")[0]) && Number(e[gruposEncontrados[2].grupo]) <= Number(p.name.split("-")[1]) : e[gruposEncontrados[2].grupo] == p.name)
        );
      }

      if(gruposEncontrados.length == 2) {
        this.filtroEmpresa = this.resultadosEmpresa.filter(e =>
          this.parametrosMenu.filter(x => x.grupo == gruposEncontrados[0].grupo).find(p => gruposEncontrados[0].grupo == 'personal' || gruposEncontrados[0].grupo == 'ventas_Netas' ? Number(e[gruposEncontrados[0].grupo]) >= Number(p.name.split("-")[0]) && Number(e[gruposEncontrados[0].grupo]) <= Number(p.name.split("-")[1]) :  e[gruposEncontrados[0].grupo] == p.name) &&
          this.parametrosMenu.filter(x => x.grupo == gruposEncontrados[1].grupo).find(p => gruposEncontrados[1].grupo == 'personal' || gruposEncontrados[1].grupo == 'ventas_Netas' ? Number(e[gruposEncontrados[1].grupo]) >= Number(p.name.split("-")[0]) && Number(e[gruposEncontrados[1].grupo]) <= Number(p.name.split("-")[1]) :  e[gruposEncontrados[1].grupo] == p.name)
        );
      }

      if(gruposEncontrados.length == 1) {
        this.filtroEmpresa = this.resultadosEmpresa.filter(e =>
          this.parametrosMenu.filter(x => x.grupo == gruposEncontrados[0].grupo).find(p => gruposEncontrados[0].grupo == 'personal' || gruposEncontrados[0].grupo == 'ventas_Netas' ? Number(e[gruposEncontrados[0].grupo]) >= Number(p.name.split("-")[0]) && Number(e[gruposEncontrados[0].grupo]) <= Number(p.name.split("-")[1]) : e[gruposEncontrados[0].grupo] == p.name)
        );
      }

      this.dataSource = new MatTableDataSource<VariablesEmpresarialesConfia>(this.filtroEmpresa);
    } else {
      this.filtroEmpresa = this.resultadosEmpresa;
      this.dataSource = new MatTableDataSource<VariablesEmpresarialesConfia>(this.resultadosEmpresa);
    }


    this.dataSource.paginator = this.paginator;
    this.mostrarProgresBar = false;
  }

  consultarPalabrasClave() {
    this._baseDatosService.consultarPalabra().subscribe(
      datos => {
        this.palabrasClaves = datos;
      }
    );
  }

  ngAfterViewInit() {

  }

  consultarDatos(filtro: ParametrosConsulta) {

    this._consultaService.consultarDatos(filtro).subscribe(
      datos => {
        if (datos.variablesEmpresarialesConfia.length > 1)
        {
          this.cargarGrilla(datos);
        } else {
          if(datos.variablesEmpresarialesConfia[0].nur == "" && datos.variablesEmpresarialesConfia[0].camara_C == "" && datos.variablesEmpresarialesConfia[0].matricula == "") {
            this._snackBar.open(`No hay resultados encontrados para tu búsqueda`, 'Aceptar', {
              horizontalPosition: this.horizontalPosition,
              verticalPosition: this.verticalPosition,
            });
          } else {
            this.cargarGrilla(datos);
          }
        }

        this.mostrarProgresBar = false;
      }, err => {
        this.mostrarProgresBar = false;
        this.blnMostrarMensaje = false;
        this._snackBar.open(`Error: ${err.error.error == undefined ? ' no hay conexión con el servidor': err.error.error}`, 'Aceptar', {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
      }
    );
  }

  cargarGrilla(data: ResultadosConsulta) {
      //this.resultadosEmpresa = datos.variablesEmpresarialesConfia.slice(0, 50);
      //this.resultadosEmpresa = datos.slice(0, 50);
      this.resultadosEmpresa = data.variablesEmpresarialesConfia;
      this.filtroEmpresa = this.resultadosEmpresa;
      this.numRegistrosEncontrados = this.resultadosEmpresa.length;
      this.blnMostrarMensaje = true;
      this._serviciosComunesService.pasarDatos.emit(this.resultadosEmpresa);
      this.dataSource = new MatTableDataSource<VariablesEmpresarialesConfia>(this.resultadosEmpresa);
      this.dataSource.paginator = this.paginator;
  }

  buscarEmpresas() {

    let palabra = this.palabrasClaves.find(x => x.palabra == this.palabraclave);

    this._serviciosComunesService.pasarDatos.emit([]);
    this.mostrarProgresBar = true;
    this.blnMostrarMensaje = false;
    let parametros: ParametrosConsulta = {
      identificacion: "",
      nombre: "",
      palabraClave: palabra == undefined ? this.palabraclave : "",
      departamento: this.departamento,
      municipio: this.ciudad,
      sectorEconomico: palabra != undefined ? palabra.codigo.join(",") : "",
      pagina: "1",
      registros: "200",
      palabraConsulta: this.palabraclave
    };
    this.resultadosEmpresa = [];
    this.filtroEmpresa = this.resultadosEmpresa;
    this.numRegistrosEncontrados = this.resultadosEmpresa.length;
    this.blnMostrarMensaje = false;
    this._serviciosComunesService.pasarDatos.emit(this.resultadosEmpresa);
    this.dataSource = new MatTableDataSource<VariablesEmpresarialesConfia>([]);
    this.dataSource.paginator = this.paginator;
    this.consultarDatos(parametros);
  }

  exportarExcel() {
    if (this.filtroEmpresa.length > 0) {
      const dialogRef = this._dialog.open(DialogoDescargarExcelComponent, {
        width: '550px',
        data: {totalRegistros: this.filtroEmpresa.length},
      });

      dialogRef.afterClosed().subscribe(result => {
        if(result == "si") {
          this._consultaService.permiteDescargar(this.filtroEmpresa.length).subscribe(
            resultado => {
              if (resultado.permitir) {

                this._consultaService.registrarUsuarioLocalStorage(resultado).subscribe();

                this.mostrarProgresBar = true;
                this.filtroEmpresa.forEach(x => {
                  let i = 1;
                  x.representanteLegal.forEach(y => {
                    x[`desc_Id_Representante_Larga_${i}`] = y.desc_Id_Representante_Larga;
                    x[`tipo_Persona_Representante_${i}`] = y.tipo_Persona_Representante;
                    x[`iD_Represe_Legal_${i}`] = y.iD_Represe_Legal;
                    x[`representante_legal_${i}`] = y.representante_legal;
                    i++;
                  });
                });
                this._exportarExcelService.exportAsExcelFile(this.filtroEmpresa, "empresas");
                this.mostrarProgresBar = false;

              } else {
                this._snackBar.open(`${resultado.mensaje}`, 'Aceptar', {
                  horizontalPosition: this.horizontalPosition,
                  verticalPosition: this.verticalPosition,
                });
                this._dialog.open(DialogoActualizarPlanComponent);
              }
            }
          );
        }
        else if (result == "maximo") {
          this._dialog.open(DialogoActualizarPlanComponent);
        }
      });

    } else {
      this._snackBar.open(`Info: No existen registros para descargar`, 'Aceptar', {
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });
    }

  }

  buscarEmpresa(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
