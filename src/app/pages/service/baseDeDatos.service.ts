import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ParametrosConsulta } from '../models/parametros-consulta.model';
import { VariablesEmpresarialesConfia } from '../models/resultados-consulta.model';
import { CodigosPalabra } from '../models/codigos-palabra.model';

@Injectable({
  providedIn: 'root'
})


export class BaseDeDatosService {

  public variables = environment;

  constructor(private http: HttpClient) {
  }

  consultarDatos(params: ParametrosConsulta): Observable<VariablesEmpresarialesConfia[]> {
    return this.http.get<VariablesEmpresarialesConfia[]>(this.variables.rutaJson);
  }

  consultarPalabra(): Observable<CodigosPalabra[]> {
    return this.http.get<any[]>(this.variables.rutaPalabrasJson);
  }
}

