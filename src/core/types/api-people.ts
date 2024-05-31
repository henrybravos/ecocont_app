export type PeopleApi = {
  numero: string
  razon_social: string
  direccion: string
  departamento: string
  provincia: string
  distrito: string
  ubigeo: string
  estado: string
  condicion: string
  documento_id: string
  observacion: string
  email: string
  telefono: string
  tipo: string // "2" customer, "1" provider
  is_default: boolean // default false
  suministro: string
  localidad: string
  tarifa: string
  potencia: string
  tencion: string
  energia: string
}
export type PeopleRucApiRest = {
  RUC: string
  Estado: string // "ACTIVO"
  Condicion: string
  Ubigeo: string
  numero: string
  ActividadExterior: string
  AfectoRUS: string
  Departamento: string
  Direccion: string
  Distrito: string
  FechaEmisoraElectronica: string
  FechaInicio: string

  FechaInscripcion: string
  NombreComercial: string
  Provincia: string
  RazonSocial: string
  Tipo: string
}

export type PeopleDniApiRest = {
  DNI: string
  Nombre: string
  Paterno: string
  Materno: string
  DigitoVerificacion: string
  NombreCompleto: string
  DireccionCompleta: string
  FechaNacimiento: string
  Sexo: string
  Direccion: string
  Departamento: string
  Provincia: string
  Distrito: string
  EsPersonaViva: string
  EstadoCivil: string
  Ubigeo: string
}
