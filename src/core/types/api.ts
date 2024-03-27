export type AuthResponseApi = {
  login: AuthApi & {
    company: CompanyApi
    local: LocalApi
  }
}
export type AuthRefreshResponseApi = {
  refresh: {
    authentication: string
    authorization: string
    refresh: string
  }
}
export interface AuthApi {
  authentication?: string
  authorization?: string
  modulo_id?: string
  refresh?: string
}

export type LocalApi = {
  id: string
  direccion: string
  nombre_corto: string
}
export type CompanyApi = {
  id: string
  ruc: string
  razon_social: string
  soap_envio: string
  periodo: string
  rubro: string
  uit: string
}
