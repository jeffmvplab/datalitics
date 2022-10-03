import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ServiciosComunesService } from '../../pages/service/serviciosComunes.service';
import { VariablesEmpresarialesConfia } from '../../pages/models/resultados-consulta.model';
import { FiltrosModel, FiltrosSeleccionados } from '../../pages/models/filtros.model';
import { ChangeContext, LabelType, Options, PointerType } from '@angular-slider/ngx-slider';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  resultadosEmpresa: VariablesEmpresarialesConfia[] = [];
  filtros: FiltrosModel[] = [];
  filtrosSeleccionados: FiltrosSeleccionados[] = [];
  existenCamaraComercio: boolean = false;
  existenTipoPersona: boolean = false;
  existenCategoria: boolean = false;
  existenPersonal: boolean = false;
  existenVentasNetas: boolean = false;

  personalMaximo: number = 0;
  minValuePersonal: number = 0;
  maxValuePersonal: number = 0;
  optionsPersonal: Options;

  ventasNetasMaximo: number = 0;
  minValueVentasNetas: number = 0;
  maxValueVentasNetas: number = 0;
  optionsVentasNetas: Options;

  @Output() abirMenu = new EventEmitter<boolean>();

  constructor(private _serviciosComunesService: ServiciosComunesService) { }

  ngOnInit() {

    this.existenCamaraComercio = false;
    this.existenTipoPersona = false;
    this.existenCategoria = false;
    this.existenPersonal = false;
    this.existenVentasNetas = false;

    this._serviciosComunesService.pasarDatos.subscribe(data => {
      this.filtrosSeleccionados = [];
      this.filtros = [];


      this.existenCamaraComercio = false;
      this.existenTipoPersona = false;
      this.existenCategoria = false;
      this.existenPersonal = false;
      this.existenVentasNetas = false;

      this.personalMaximo = 0;
      this.minValuePersonal = 0;
      this.maxValuePersonal = 0;

      this.ventasNetasMaximo = 0;
      this.minValueVentasNetas = 0;
      this.maxValueVentasNetas = 0;

      this.resultadosEmpresa = data;
      this.agruparPorCamaraComercio();
      this.agruparPorTipoPersona();
      this.agruparPorCategoria();
      this.agruparPorPersona();
      this.agruparVentasNetas();

      if(this.resultadosEmpresa.length > 0) {
        this.abirMenu.emit(true);
      } else {
        this.abirMenu.emit(false);
      }
    });

  }


  agruparPorCamaraComercio() {
    let groups = ['camara_C'];
    let grouped = {};
    this.resultadosEmpresa.forEach(function (a) {
        groups.reduce(function (o, g, i) {                            // take existing object,
            o[a[g]] = o[a[g]] || (i + 1 === groups.length ? [] : {}); // or generate new obj, or
            return o[a[g]];                                           // at last, then an array
        }, grouped).push(a);
    });

    let that = this;
    Object.keys(grouped).forEach(key => {
      that.filtros.push({
        chequeado: false,
        key: `camara_C_${key}`,
        grupo: 'camara_C',
        name: key
      });

      that.existenCamaraComercio = true;
    });
  }

  agruparPorTipoPersona() {
    let groups = ['tipo_Persona'];
    let grouped = {};

    this.resultadosEmpresa.forEach(function (a) {
        groups.reduce(function (o, g, i) {                            // take existing object,
            o[a[g]] = o[a[g]] || (i + 1 === groups.length ? [] : {}); // or generate new obj, or
            return o[a[g]];                                           // at last, then an array
        }, grouped).push(a);
    });

    let that = this;
    Object.keys(grouped).forEach(key => {
      that.filtros.push({
        chequeado: false,
        key: `tipo_Persona_${key}`,
        grupo: 'tipo_Persona',
        name: key
      });

      that.existenTipoPersona = true;
    });
  }

  agruparPorCategoria() {
    let groups = ['categoria'];
    let grouped = {};

    this.resultadosEmpresa.forEach(function (a) {
        groups.reduce(function (o, g, i) {                            // take existing object,
            o[a[g]] = o[a[g]] || (i + 1 === groups.length ? [] : {}); // or generate new obj, or
            return o[a[g]];                                           // at last, then an array
        }, grouped).push(a);
    });

    let that = this;
    Object.keys(grouped).forEach(key => {
      that.filtros.push({
        chequeado: false,
        key: `categoria_${key}`,
        grupo: 'categoria',
        name: key
      });

      that.existenCategoria = true;
    });
  }

  agruparPorPersona() {
    if (this.resultadosEmpresa.length > 0) {
      let personal = this.resultadosEmpresa.map(x => Number(x.personal));
      this.personalMaximo =  Math.max(...personal);
      this.maxValuePersonal = this.personalMaximo;
      this.optionsPersonal = {
        floor: 0,
        ceil: this.personalMaximo,
        translate: (value: number, label: LabelType): string => {
          switch (label) {
            case LabelType.Low:
              return value.toString();
            case LabelType.High:
              return value.toString();
            default:
              return value.toString();
          }
        }
      }
      this.existenPersonal = true;
    }
  }

  agruparVentasNetas() {
    if (this.resultadosEmpresa.length > 0) {
      let ventasNetas = this.resultadosEmpresa.map(x => Number(x.ventas_Netas));
      this.ventasNetasMaximo =  Math.max(...ventasNetas);
      this.maxValueVentasNetas = this.ventasNetasMaximo;
      this.optionsVentasNetas = {
        floor: 0,
        ceil: this.ventasNetasMaximo,
        step: 100000,
        translate: (value: number, label: LabelType): string => {
          switch (label) {
            case LabelType.Low:
              return '$ ' + Intl.NumberFormat('es-CO', { maximumSignificantDigits: 2 }).format(value).toString();
            case LabelType.High:
              return '$ ' + Intl.NumberFormat('es-CO', { maximumSignificantDigits: 2 }).format(value).toString();
            default:
              return '$ ' + Intl.NumberFormat('es-CO', { maximumSignificantDigits: 2 }).format(value).toString();
          }
        }
      }
      this.existenVentasNetas = true;
    }

  }

  seleccionoFiltro(check: boolean, item: FiltrosModel) {
    if(check) {
      this.filtrosSeleccionados.push({
        grupo: item.grupo,
        name: item.name
      });

      this.filtros.find(x => x.key ==  item.key).chequeado = true;
    } else {
      let indice = this.filtrosSeleccionados.findIndex(x => x.name == item.name && x.grupo == item.grupo);
      this.filtrosSeleccionados.splice(indice, 1);
    }

    this._serviciosComunesService.pasarParametros.emit(this.filtrosSeleccionados);
  }

  limpiarFiltro() {
    this.filtrosSeleccionados = [];

    this.maxValuePersonal = this.personalMaximo;
    this.minValuePersonal = 0;

    this.maxValueVentasNetas = this.ventasNetasMaximo;
    this.minValueVentasNetas = 0;

    this.filtros.forEach(t => (t.chequeado = false));

    this._serviciosComunesService.pasarParametros.emit(this.filtrosSeleccionados);
  }

  eliminarFiltro(item: FiltrosSeleccionados) {

    if(item.grupo == 'personal') {
      this.maxValuePersonal = this.personalMaximo;
      this.minValuePersonal = 0;
    } else if (item.grupo == 'ventas_Netas') {
      this.maxValueVentasNetas = this.ventasNetasMaximo;
      this.minValueVentasNetas = 0;
    }

    let indice = this.filtrosSeleccionados.findIndex(x => x.name == item.name && x.grupo == item.grupo);
    this.filtrosSeleccionados.splice(indice, 1);

    if(item.grupo != 'personal') {
      this.filtros.find(x => x.key ==  `${item.grupo}_${item.name}`).chequeado = false;
    }

    this._serviciosComunesService.pasarParametros.emit(this.filtrosSeleccionados);
  }

  onUserChangePersonal(changeContext: ChangeContext): void {
    this.getChangeContextPersonal(changeContext);
  }

  getChangeContextPersonal(changeContext: ChangeContext) {
    let indice = this.filtrosSeleccionados.findIndex(x => x.grupo == 'personal');

    if (indice > -1) {
      this.filtrosSeleccionados[indice] = {
        grupo: "personal",
        name: `${changeContext.value}-${changeContext.highValue}`
      };
    } else {
      this.filtrosSeleccionados.push({
        grupo: "personal",
        name: `${changeContext.value}-${changeContext.highValue}`
      });
    }


    this._serviciosComunesService.pasarParametros.emit(this.filtrosSeleccionados);
  }

  onUserChangeVentasNetas(changeContext: ChangeContext): void {
    this.getChangeContextVentasNetas(changeContext);
  }

  getChangeContextVentasNetas(changeContext: ChangeContext) {
    let indice = this.filtrosSeleccionados.findIndex(x => x.grupo == 'ventas_Netas');

    if (indice > -1) {
      this.filtrosSeleccionados[indice] = {
        grupo: "ventas_Netas",
        name: `${changeContext.value}-${changeContext.highValue}`
      };
    } else {
      this.filtrosSeleccionados.push ({
        grupo: "ventas_Netas",
        name: `${changeContext.value}-${changeContext.highValue}`
      });
    }

    this._serviciosComunesService.pasarParametros.emit(this.filtrosSeleccionados);
  }
}
