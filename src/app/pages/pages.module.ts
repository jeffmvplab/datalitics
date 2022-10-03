import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { pageRouting } from './pages-routing.module';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AppMaterialModule } from '../app-material.module';
import { ConsultaService } from './service/consulta.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ExportarExcelService } from './service/exportarExcel.service';
import { DialogoActualizarPlanComponent } from '../components/dialogo-actualizar-plan/dialogo-actualizar-plan.component';
import { DialogoDescargarExcelComponent } from './../components/dialogo-descargar-excel/dialogo-descargar-excel.component';


@NgModule({
  providers: [
    ConsultaService,
    ExportarExcelService
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    pageRouting,
    AppMaterialModule
  ],
  declarations: [
    HomeComponent,
    DialogoActualizarPlanComponent,
    DialogoDescargarExcelComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PagesModule {}
