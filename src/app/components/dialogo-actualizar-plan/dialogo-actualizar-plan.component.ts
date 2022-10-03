import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dialogo-actualizar-plan',
  templateUrl: './dialogo-actualizar-plan.component.html',
  styleUrls: ['./dialogo-actualizar-plan.component.css']
})
export class DialogoActualizarPlanComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  redireccionar() {
    window.open(
      "https://home.datalitics.com.co/planes/",
      '_blank'
    );
  }

}
