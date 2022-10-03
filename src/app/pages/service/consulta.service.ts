import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ParametrosConsulta } from '../models/parametros-consulta.model';
import { ResultadosConsulta } from '../models/resultados-consulta.model';
import { PermiteDescargarModel } from '../models/resultados-permite-descargar.model';
import { DepartamentoModel } from '../models/departamento.model';
import { CiudadModel } from '../models/ciudad.model';
import { InformacionUsuarioModel } from '../models/informacion-usuario.model';
import { RegistrarUsuarioModel } from '../models/registrar-usuario.model';

@Injectable({
  providedIn: 'root'
})

export class ConsultaService {
  public variables = environment;

  constructor(private http: HttpClient) { }

  consultarDatos(params: ParametrosConsulta): Observable<ResultadosConsulta> {
    return this.http.post<ResultadosConsulta>(this.variables.urlApiCC + "Consultar", params);
  }

  permiteDescargar(numRegistros: number): Observable<InformacionUsuarioModel> {
    return this.http.get<InformacionUsuarioModel>(this.variables.urlApi + `permiteDescargar/${numRegistros}`);
  }

  consultarDepartamento(): Observable<DepartamentoModel[]> {
    return this.http.get<DepartamentoModel[]>(this.variables.urlApi + "departamentos");
  }

  consultarCiudad(departamentoId: string): Observable<CiudadModel[]> {
    return this.http.get<CiudadModel[]>(this.variables.urlApi + `ciudades/${departamentoId}`);
  }

  consultarInformacionUsuario() {
    this.http.get<InformacionUsuarioModel>(this.variables.urlApi + "informacionUsuario").subscribe(data => {
      if(data != null) {
        localStorage.setItem('infoUser', JSON.stringify(data));
      } else {
        localStorage.removeItem('infoUser');
      }
    });
  }

  consultarUsuarioLocalStorage(): Observable<InformacionUsuarioModel> {
    return new Observable(observer => {
      let usuario = JSON.parse(localStorage.getItem('infoUser')) as InformacionUsuarioModel;
      if (usuario != null) {
        observer.next(usuario);
      } else {
        observer.error("No existe el usuario");
      }
    });
  }

  registrarUsuarioLocalStorage(usuario: InformacionUsuarioModel): Observable<InformacionUsuarioModel> {
    return new Observable(observer => {
      if (usuario != null) {
        localStorage.setItem('infoUser', JSON.stringify(usuario));
        observer.next(usuario);
      } else {
        observer.error("No existe el usuario");
      }
    });
  }

  resitrarUsuario(usuario: RegistrarUsuarioModel): Observable<InformacionUsuarioModel>  {
    return this.http.post<InformacionUsuarioModel>(this.variables.urlApiCC + "registrarUsuario", usuario);
  }

}
