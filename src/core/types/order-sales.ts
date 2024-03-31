import { Product } from '@core/types/product'
import { Sales } from '@core/types/sales'

export type TypeInvoice = {
  code: string
  name: string
  id: string
}
export type Customer = {
  identification: string
  businessName: string
  id: string
}
export type Currency = {
  code: string
  name: string
}
export type MovementOrder = {
  id: string
  quantity: number
  igv: number
  unitCost: number
  unitPrice: number
  icbper: number
  productId: string
  invoiceType: {
    code: string
  }
  product: Partial<Product>
}
export type OrderSales = {
  id: string
  sales: Sales
  series: string
  invoice: TypeInvoice
  customer: Customer
  currency: Currency
  issueDate: string
  customerId: string
  description: string
  correlative: string
  movementOrder: MovementOrder[]
}
