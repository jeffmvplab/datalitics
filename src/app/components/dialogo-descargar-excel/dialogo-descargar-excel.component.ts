import { Component, Inject, OnInit } from '@angular/core';
import {  MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from '../../pages/models/dialog-data.model';
import { ConsultaService } from '../../pages/service/consulta.service';
import { InformacionUsuarioModel } from '../../pages/models/informacion-usuario.model';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { RegistrarUsuarioModel } from '../../pages/models/registrar-usuario.model';

@Component({
  selector: 'app-dialogo-descargar-excel',
  templateUrl: './dialogo-descargar-excel.component.html',
  styleUrls: ['./dialogo-descargar-excel.component.css']
})
export class DialogoDescargarExcelComponent implements OnInit {

  infoUsuario: InformacionUsuarioModel;
  form: FormGroup;
  nombre: string;
  correoElectronico: string;
  celular: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private _consultaService: ConsultaService,
    private _fb: FormBuilder,
  ) { }

  ngOnInit() {
    this.consultarUsuarioLocalStorage();

    this.form = this._fb.group({
      nombre: new FormControl('', Validators.compose([Validators.required, Validators.maxLength(80)])),
      correoElectronico: new FormControl('', Validators.compose([Validators.required, Validators.maxLength(40)])),
      celular: new FormControl('', Validators.compose([Validators.required, Validators.maxLength(13)])),
    });
  }

  consultarUsuarioLocalStorage() {
    this._consultaService.consultarUsuarioLocalStorage().subscribe(
      data => {
        this.infoUsuario = data;
      }
    );
  }

  registrarUsuario() {
    let usuario: RegistrarUsuarioModel = {
      correoElectronico: this.correoElectronico,
      nombre: this.nombre,
      celular: this.celular
    };

    this._consultaService.resitrarUsuario(usuario).subscribe(
      data => {
        this._consultaService.registrarUsuarioLocalStorage(data).subscribe(
          usuario => {
            this.infoUsuario = usuario;
          }
        );
      }
    );
  }
}
