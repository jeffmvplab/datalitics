import { EventEmitter, Injectable, Output } from '@angular/core';


@Injectable({
  providedIn: 'root'
})

export class ServiciosComunesService {

  @Output() pasarDatos: EventEmitter<any> = new EventEmitter();
  @Output() pasarParametros: EventEmitter<any> = new EventEmitter();

  constructor() { }

}
