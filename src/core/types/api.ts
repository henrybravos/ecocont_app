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
export type AttentionPointApi = {
  id: string
  codigo: string
  zona_id: string
  x: number
  y: number
  descripcion: string
  pedido_id: string
}
export type SalesAreaApi = {
  id: string
  codigo: string
  descripcion: string
  local_id: string
  control_mesa: boolean
  mesas: AttentionPointApi[]
}
export type CheckoutApi = {
  id: string
  code: string
  description: string
  zonas: SalesAreaApi[]
}
export type UserSalesResponseApi = {
  userActive: {
    id: string
    role_id: string
    cajas: CheckoutApi[]
    zonas: SalesAreaApi[]
  }
}
export type AttentionPointResponseApi = {
  mesas: AttentionPointApi[]
}
