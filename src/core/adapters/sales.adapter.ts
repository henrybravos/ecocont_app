import {
  AttentionPointApi,
  AttentionPointResponseApi,
  CheckoutApi,
  SalesAreaApi,
  UserSalesResponseApi,
} from '@core/types'
import { OperationResponse, VentaApi, VentaItemApi } from '@core/types/api-sales'
import { Invoice, InvoiceResponse } from '@core/types/sales'
import { AttentionPoint, Checkout, SalesArea, UserSales } from '@core/types/user'
import { getTaxesAmounts, getTotalsInvoice } from '@core/utils/taxes'

export const salesAttentionPointAdapter = (
  point: AttentionPointApi,
  areaId?: string,
): AttentionPoint => {
  return {
    areaId: point.zona_id || areaId || '',
    code: point.codigo,
    id: point.id,
    orderId: point.pedido_id,
    x: point.x,
    y: point.y,
    description: point.descripcion,
  }
}

export const salesAreaAdapter = (area: SalesAreaApi): SalesArea => {
  return {
    attentionPoints: area.mesas?.map((m) => salesAttentionPointAdapter(m)) || [],
    code: area.codigo,
    controlAttentionPoint: area.control_mesa,
    id: area.id,
    locationId: area.local_id,
    description: area.descripcion,
  }
}
export const salesCheckoutAdapter = (checkout: CheckoutApi): Checkout => {
  return {
    areas: checkout.zonas.map(salesAreaAdapter),
    code: checkout?.code,
    description: checkout.description,
    id: checkout.id,
    accounts: checkout.cuentas.map((c) => ({
      bankId: c.banco_id,
      control: c.control,
      currency: {
        code: c.moneda.codigo,
      },
      description: c.descripcion,
      id: c.id,
      pcge: {
        id: c.pcge.id,
      },
      type: c.tipo === '1' ? 'CASH' : 'BANK',
    })),
  }
}

export const salesActiveUserResponseAdapter = (responseApi: UserSalesResponseApi): UserSales => {
  return {
    areas: responseApi.userActive.zonas.map(salesAreaAdapter),
    checkouts: responseApi.userActive.cajas.map(salesCheckoutAdapter),
    id: responseApi.userActive.id,
    roleId: responseApi.userActive.role_id,
  }
}
export const salesAttentionPointResponseAdapter = (
  areaId: string,
  point: AttentionPointResponseApi,
): AttentionPoint[] => {
  return point.mesas?.map((m) => salesAttentionPointAdapter(m, areaId)) || []
}

export const salesToApiRequest = (invoice: Invoice): VentaApi => {
  const itemsApi: Partial<VentaItemApi>[] = invoice.items.map((item) => {
    const total = item.new.unitPrice * item.new.quantity
    const ley_31556 = invoice.law_31556
    const igv = (total * (ley_31556 ? 0.1 : 0.18)) / (ley_31556 ? 1.1 : 1.18)

    const taxes = getTaxesAmounts({
      codeIGVType: item.new.product.tIGV?.code || '',
      igv,
      total,
    })
    return {
      cantidad: item.new.quantity,
      codigo: item.new.product?.code || '',
      codigo_interno: item.new.product?.code,
      codigo_producto_sunat: item.new.product.sunatCode,
      codigo_sunat: item.new.product.sunatCode,
      descripcion: item.new.product.description,
      id: item.new.id,
      movimiento_id: item.new.id,
      nombre: item.new.product.description,
      unidad_de_medida: item.new.product.measurementUnit?.code || '',
      is_combo: item.new.product.isCombo,
      stock: item.new.product.stock,
      precios: item.new.product.variants?.map((v) => ({
        id: v.id,
        imagen: v.imageUrl,
        nombre: v.name,
        precio: v.price,
        total_general: v.generalTotal,
        total_parcial: v.partialTotal,
      })),
      producto: {
        cantidad: item.old.quantity,
        codigo: item.old.product?.code || '',
        codigo_sunat: item.old.product.sunatCode,
        icbper: item.old.product.icbper,
        id: item.old.product.id,
        is_combo: item.old.product.isCombo,
        stock: item.old.product.stock,
        medida: {
          codigo: item.old.product.measurementUnit?.code || '',
          id: item.old.product.measurementUnit?.id || '',
          nombre: item.old.product.measurementUnit?.name || '',
        },
        precios: item.old.product.variants?.map((v) => ({
          id: v.id,
          imagen: v.imageUrl,
          nombre: v.name,
          precio: v.price,
          total_general: v.generalTotal,
          total_parcial: v.partialTotal,
        })),
        valor_unitario: taxes.free === 0 ? taxes.subTotal / item.old.quantity : 0,
        nombre: item.old.product.description,
        precio_id: item.old.priceDetail?.id,
        precio_unitario: item.old.unitPrice,
        producto_id: item.old.product.id,
        tIGV: {
          codigo: item.new.product.tIGV?.code || '',
          id: item.new.product.tIGV?.id || '',
          descripcion: item.new.product.tIGV?.description || '',
        },
        tipo_igv: item.old.product.igvType,
        pcgeVenta: {
          code: item.old.product.pcgeSales?.code || '',
          id: item.old.product.pcgeSales?.id || '',
          name: item.old.product.pcgeSales?.name || '',
        },
        equivalencia:
          Number(item.old.variantSelected?.partialTotal) /
          Number(item.old.variantSelected?.generalTotal),
        t_tabla_facturacion: item.old.product.igvType,
        movimiento_id: item.old.id,
      },
      codigo_tipo_afectacion_igv: item.new.product.tIGV?.code, //ERROR undefined =>10
      codigo_tipo_precio: taxes.free === 0 ? '01' : '02',
      equivalencia:
        Number(item.new.variantSelected?.partialTotal) /
        Number(item.new.variantSelected?.generalTotal),
      exonerada: taxes.exonerated,
      exportacion: taxes.export,
      gratuita: taxes.free,
      gravada: taxes.taxable, //ERROR debe ser 0
      inafecta: taxes.unaffected,
      icbper: item.new.product.icbper,
      porcentaje_igv: ley_31556 ? 10 : 18,
      medida: {
        id: item.new.product.measurementUnit?.id || '',
        codigo: item.new.product.measurementUnit?.code || '',
        nombre: item.new.product.measurementUnit?.name || '',
      },
      pcgeVenta: item.new.product.pcgeSales,
      precio_unitario:
        taxes.free === 0 ? total / item.new.quantity : taxes.subTotal / item.new.quantity,
      precio_uni: total / item.new.quantity,
      producto_id: item.new.product.id,
      precio_id: item.new.priceDetail?.id,
      t_tabla_facturacion: item.new.product.igvType,
      tIGV: {
        codigo: item.new.product.tIGV?.code || '',
        id: item.new.product.tIGV?.id || '',
        descripcion: item.new.product.tIGV?.description || '',
      },
      tipo_igv: item.new.product.igvType,
      valor_unitario: taxes.free === 0 ? taxes.subTotal / item.new.quantity : 0,
      total_base_igv: taxes.subTotal,
      total_igv: igv,
      total_impuestos: igv + item.new.quantity * item.new.icbper,
      total_impuestos_bolsa_plastica: item.new.quantity * item.new.icbper,
      total_item: taxes.free === 0 ? total : 0,
      total_valor_item: taxes.subTotal,
    }
  })
  const totals = getTotalsInvoice(itemsApi)
  return {
    serie_documento: invoice.series,
    numero_documento: invoice.number,
    codigo_tipo_operacion: invoice.operationType,
    codigo_tipo_documento: invoice.documentType,
    codigo_tipo_moneda: invoice.currencyType,
    fecha_de_vencimiento: invoice.dueDate,
    numero_orden_de_compra: invoice.purchaseOrder || '',
    datos_del_cliente_o_receptor: {
      id: invoice.customer.id,
    },
    totales: {
      totalTarjetas: invoice.totals?.cardPayment || 0,
      totalOtros: 0,
      otros: [],
      credito:
        invoice.totals?.creditPaymentDetail?.map((c) => ({
          monto: c.amount,
          fecha: c.date,
          id: c.id,
          invalid: c.invalid,
          numero: `00${c.code}`.slice(-3),
        })) || [],
      total_descuento_bi: 0,
      total_descuento_nbi: 0,
      efectivo: {
        monto: `${invoice.totals?.cashPaymentDetail?.amount ?? 0}` || '0',
        cf: invoice.totals?.cashPaymentDetail?.cf || '',
        pcge_id: invoice.totals?.cashPaymentDetail?.pcgeId || '',
      },
      tarjetas:
        (invoice.totals?.cardPayment || 0) > 0
          ? [
              {
                id: invoice.totals?.cardPaymentDetail?.id || '',
                cf: invoice.totals?.cardPaymentDetail?.cf || '',
                cuenta: invoice.totals?.cardPaymentDetail?.account || '',
                monto: invoice.totals?.cardPaymentDetail?.amount || '',
                pcge_id: invoice.totals?.cardPaymentDetail?.pcgeId || '',
                referencia: invoice.totals?.cardPaymentDetail?.reference || '',
              },
            ]
          : [],
      totalEfectivo: totals.total_venta_info,
      totalCredito: 0,
      ...totals,
    },
    descuentos: [],
    items: itemsApi,
    leyendas: [],
    informacion_adicional: '',
    extra: {
      caja_id: invoice.extraData.checkoutId || 'cb828156-41cd-11ec-9419-0289b1985170',
      mesa_id: invoice.extraData.pointAttentionId,
      pedido_id: invoice.extraData.orderId,
      venta_id: invoice.extraData.salesId,
      zona_id: invoice.extraData.areaId,
    },
  }
}

export const invoiceResponseFromApi = (response: OperationResponse): InvoiceResponse => {
  return {
    downloadUrl: response.createOrUpdatePedido.pdf_ruta.data,
    url: response.createOrUpdatePedido.pdf_ruta.data,
    status: response.createOrUpdatePedido.pdf_ruta.status,
  }
}
