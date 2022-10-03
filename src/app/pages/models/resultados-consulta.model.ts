export interface ResultadosConsulta {
  variablesEmpresarialesConfia: VariablesEmpresarialesConfia[]
}


export interface  VariablesEmpresarialesConfia {
  nur:                              string;
  camara_C:                         string;
  matricula:                        string;
  tipo_Persona:                     string;
  descripcion_Identificacion_Larga: string;
  identificacion:                   string;
  razon_Social:                     string;
  organizacion_Juridica:            string;
  categoria:                        string;
  estado_Mat:                       string;
  fecha_Constitucion:               string;
  fecha_Matricula:                  string;
  fec_Ultima_Renov:                 string;
  ultimo_AnoRenovado:               string;
  direccion:                        string;
  ciudad_Mpio:                      string;
  zona_Postal:                      string;
  barrio:                           string;
  localidad:                        string;
  imp_Exp:                          string;
  telefono1:                        string;
  telefono2:                        string;
  telefono3:                        string;
  fax:                              string;
  e_mail:                           string;
  pagina_Web:                       string;
  ciiU_1:                           string;
  descripcionCIIU_1:                string;
  ciiU_2:                           string;
  descripcionCIIU_2:                string;
  ciiU_3:                           string;
  descripcionCIIU_3:                string;
  ciiU_4:                           string;
  descripcionCIIU_4:                string;
  sector_Economico:                 string;
  personal:                         string;
  clasificacion:                    string;
  activo_Total:                     string;
  activo_Sin_Ajuste:                string;
  activo_Corriente:                 string;
  activo_Fijo:                      string;
  valoracion_Activo:                string;
  otro_Activo:                      string;
  pasivo_Corriente:                 string;
  obliga_LargoPlz:                  string;
  pasivo_Total:                     string;
  patrimonio:                       string;
  pasivo_Patrimonio:                string;
  ventas_Netas:                     string;
  costo_Ventas:                     string;
  util_Perdida_Oper:                string;
  util_Perdida_Neta:                string;
  gastos_Admon:                     string;
  ingresos_AO:                      string;
  ganancia_Bruta:                   string;
  otros_Ingreso:                    string;
  gastos_Ventas:                    string;
  gastos_Admin:                     string;
  otros_Gastos:                     string;
  otras_Ganancias:                  string;
  ganancia_x_AO:                    string;
  diferencia_EILDILA:               string;
  ganancias_SBCA:                   string;
  ingresos_Finan:                   string;
  costos_Finan:                     string;
  participacion_GAN:                string;
  otros_Ing_SEC:                    string;
  ganancias_SDIV:                   string;
  ganancia_CGPPRC:                  string;
  ganancias_ADI:                    string;
  ingreso_x_Imp:                    string;
  ganancia_POC:                     string;
  ganancia_POD:                     string;
  ganancia_Perdida:                 string;
  cantidad_Establecimientos:        string;
  representanteLegal:               RepresentanteLegal[];
}

export interface RepresentanteLegal {
  desc_Id_Representante_Larga: string;
  tipo_Persona_Representante:  string;
  iD_Represe_Legal:            string;
  representante_legal:         string;
}
