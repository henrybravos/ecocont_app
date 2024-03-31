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

export type InvoiceApi = {
  codigo: string
  nombre: string
  id: string
}
export type PersonApi = {
  numero: string
  razon_social: string
  id: string
}
export type CurrencyApi = {
  codigo: string
  nombre: string
}
export type SalesApi = {
  id: string
}
export type ProductApi = {
  id: string
  codigo: string
  descripcion: string
  codigo_sunat: string
  tipo_igv: string
  medida: {
    id: string
    codigo: string
    nombre: string
  }
  pcgeVenta: {
    id: string
    code: string
    name: string
  }
}
export type MovementOrderApi = {
  id: string
  cantidad: number
  costo_unitario: number
  igv: number
  precio_unitario: number
  icbper: number
  producto_id: string
  t_facturacion: {
    codigo: string
  }
  producto: ProductApi
  precio: {
    id: string
    nombre: string
  }
}
export type OrderSalesApi = {
  id: string
  fecha_emision: string
  comprobante: InvoiceApi
  serie: string
  correlativo: string
  persona_asociado_id: string
  persona: PersonApi
  moneda: CurrencyApi
  glosa: string
  venta: SalesApi
  movimientos: MovementOrderApi[]
}

export type OrderSalesResponseApi = {
  pedido: OrderSalesApi
}

export type ProductTopResponseApi = {
  productosTop: {
    id: string
    codigo: string
    is_combo: boolean
    descripcion: string
    precio_unitario: number
    valor_unitario: number
    icbper: boolean
    codigo_sunat: string
    medida: {
      id: string
      codigo: string
      nombre: string
    }
    precios: {
      id: string
      nombre: string
      precio: number
      total_parcial: number
      total_general: number
      imagen: string
    }[]
    tIGV: {
      id: string
      codigo: string
      descripcion: string
    }
    imagen: string
    tipo_igv: string
    pcgeVenta: {
      id: string
      code: string
      name: string
    }
    stock: number
    codigo_barras: string
  }[]
}
