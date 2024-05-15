export type VentaItemProductoApi = {
  movimiento_id: string
  cantidad: number
  codigo: string
  precio_unitario: number
  tIGV: {
    codigo: string
  }
  icbper: number
  nombre: string
  codigo_sunat: string
  medida: {
    id: string
    codigo: string
    nombre: string
  }
  producto_id: string
  precio_id: string
  tipo_igv: string
  pcgeVenta: {
    id: string
    code: string
    name: string
  }
  equivalencia: unknown
  t_tabla_facturacion: string
}
export type VentaItemApi = {
  movimiento_id: string
  cantidad: number
  codigo: string
  precio_unitario: number
  tIGV: {
    codigo: string
  }
  icbper: number
  nombre: string
  codigo_sunat: string
  medida: {
    id: string
    codigo: string
    nombre: string
  }
  producto_id: string
  precio_id: string
  tipo_igv: string
  pcgeVenta: {
    id: string
    code: string
    name: string
  }
  equivalencia: unknown
  t_tabla_facturacion: string
  producto: Partial<VentaItemProductoApi>
  id: string
  gravada: number
  exonerada: number
  inafecta: number
  exportacion: number
  gratuita: number
  codigo_interno: string
  descripcion: string
  codigo_producto_sunat: string
  unidad_de_medida: string
  valor_unitario: number
  codigo_tipo_precio: string
  precio_uni: number
  codigo_tipo_afectacion_igv: string
  total_base_igv: number
  porcentaje_igv: number
  total_igv: number
  total_valor_item: number
  total_impuestos_bolsa_plastica: number
  total_item: number
  total_impuestos: number
}
export type VentaTotalesApi = {
  items: number
  totalTarjetas: number
  totalOtros: number
  tarjetas: any[]
  otros: any[]
  total_descuento_bi: number
  total_igv: number
  total_descuento_nbi: number
  efectivo: {
    monto: string
    cf: string
    pcge_id: string
  }
  totalEfectivo: number
  total_venta_info: number
  total_impuestos_bolsa_plastica: number
  total_operaciones_gravadas: number
  total_operaciones_exoneradas: number
  total_operaciones_inafectas: number
  total_exportacion: number
  total_operaciones_gratuitas: number
  totalCredito: number
  total_descuentos: number
  total_anticipo: number
  total_cargos: number
  total_impuestos: number
  total_valor: number
  total_venta: number
}
export type VentaApi = {
  id?: string
  serie_documento: string
  numero_documento: string
  codigo_tipo_operacion: string
  codigo_tipo_documento: string
  codigo_tipo_moneda: string
  fecha_de_vencimiento: string | null
  numero_orden_de_compra: string
  datos_del_cliente_o_receptor: {
    id: string
  }
  totales: VentaTotalesApi
  descuentos: unknown[]
  items: Partial<VentaItemApi>[]
  leyendas: unknown[]
  informacion_adicional: string
  extra: {
    caja_id: string
    mesa_id: string
    pedido_id: string
    venta_id: string
    zona_id: string
  }
}

export interface CreateOrUpdatePedidoResponse {
  createOrUpdatePedido: CreateOrUpdatePedido
}

export interface CreateOrUpdatePedido {
  id: string
  fecha_emision: string
  comprobante: Comprobante
  serie: string
  correlativo: string
  persona_asociado_id: string
  persona: Persona
  moneda: Moneda
  observaciones: string
  venta: Venta
  movimientos: Movimiento[]
  zona_id: string
}
export interface OperationResponse {
  createOrUpdatePedido: {
    api_fact: string
    apifact: {
      data: {
        external_id: string
      }
      links: {
        cdr: string
        pdf: string
        xml: string
      }
      message: string
      response: {
        description: string
      }
      success: boolean
    }
    external_id: string
    file_name: string
    pdf_ruta: {
      base: string
      contenedor: boolean
      data: string
      download: string
      exists: boolean
      message: string
      status: boolean
    }
  }
}
export interface Comprobante {
  codigo: string
  nombre: string
  id: string
}

export interface Persona {
  numero: string
  razon_social: string
  id: string
  email: string
  telefono: string
}

export interface Moneda {
  codigo: string
  nombre: string
}

export interface Venta {
  id: string
}

export interface Movimiento {
  id: string
  cantidad: number
  costo_unitario: number
  igv: number
  precio_unitario: number
  icbper: number
  producto_id: string
  t_facturacion: TFacturacion
  producto: Producto
  datos_adicionales: any[]
  precio: Precio
}

export interface TFacturacion {
  codigo: string
}

export interface Producto {
  id: string
  codigo: string
  descripcion: string
  codigo_sunat?: string
  is_combo: boolean
  tipo_igv: string
  medida: Medida
  pcgeVenta: PcgeVenta
  stock?: boolean
}

export interface Medida {
  id: string
  codigo: string
  nombre: string
}

export interface PcgeVenta {
  id: string
  code: string
  name: string
}

export interface Precio {
  id: string
  nombre: string
  total_parcial: number
  total_general: number
}
