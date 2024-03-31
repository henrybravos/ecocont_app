import { productOrderAdapter } from '@core/adapters/product.adapter'
import {
  CurrencyApi,
  InvoiceApi,
  MovementOrderApi,
  OrderSalesResponseApi,
  PersonApi,
} from '@core/types'
import { Currency, Customer, MovementOrder, OrderSales, TypeInvoice } from '@core/types/order-sales'

export const currencyAdapter = (currency: CurrencyApi): Currency => {
  return {
    code: currency.codigo,
    name: currency.nombre,
  }
}
export const invoiceAdapter = (invoice: InvoiceApi): TypeInvoice => {
  return {
    code: invoice.codigo,
    id: invoice.id,
    name: invoice.nombre,
  }
}
export const customerAdapter = (customer: PersonApi): Customer => {
  return {
    id: customer.id,
    businessName: customer.razon_social,
    identification: customer.numero,
  }
}

export const movementOrderAdapter = (movement: MovementOrderApi): MovementOrder => {
  return {
    icbper: movement.icbper,
    id: movement.id,
    igv: movement.igv,
    productId: movement.producto_id,
    unitCost: movement.costo_unitario,
    unitPrice: movement.precio_unitario,
    quantity: movement.cantidad,
    invoiceType: {
      code: movement.t_facturacion.codigo,
    },
    product: productOrderAdapter(movement.producto),
  }
}
export const orderSalesResponseAdapter = (response: OrderSalesResponseApi): OrderSales => {
  return {
    id: response.pedido.id,
    correlative: response.pedido.correlativo,
    currency: currencyAdapter(response.pedido.moneda),
    customerId: response.pedido.persona_asociado_id,
    description: response.pedido.glosa,
    invoice: invoiceAdapter(response.pedido.comprobante),
    issueDate: response.pedido.fecha_emision,
    customer: customerAdapter(response.pedido.persona),
    sales: {
      id: response.pedido.venta.id,
    },
    series: response.pedido.serie,
    movementOrder: response.pedido.movimientos.map(movementOrderAdapter),
  }
}
