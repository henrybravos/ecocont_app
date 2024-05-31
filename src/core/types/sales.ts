import { MovementOrder } from '@core/types/order-sales'

export type DocumentInvoiceType = '03' | '01' | '99'
export type SeriesType = 'N' | 'F' | 'B'

export type Sales = {
  id: string
}

export type TotalsInvoice = {
  quantityItems: number
  cardPayment: number
  otherPayment: number
  discount_bi: number
  igv: number
  discount_nbi: number
  cashPaymentDetail: {
    amount: number
    cf: string
    pcgeId: string
  }
  cardPaymentDetail: {
    id: string
    reference: string
    amount: string
    cf: string
    account: string
    pcgeId: string
  }
  creditPaymentDetail: {
    id: string
    code: string
    amount: string
    date: string
    invalid: boolean
  }[]
  cashPayment: number
  salesAmount: number
  plasticBagTax: number
  taxableAmount: number
  exoneratedAmount: number
  unaffectedAmount: number
  exportAmount: number
  freeAmount: number
  creditAmount: number
  discountAmount: number
  advanceAmount: number
  chargeAmount: number
  taxesAmount: number
  valueAmount: number
}

export type Invoice = {
  series: string
  number: string
  law_31556: boolean
  operationType: string
  documentType: string
  currencyType: string
  dueDate: string | null
  purchaseOrder: string | null
  customer: {
    id: string
  }
  totals?: Partial<TotalsInvoice>
  items: {
    old: MovementOrder
    new: MovementOrder
  }[]
  additionalInformation: string
  extraData: {
    pointAttentionId: string
    checkoutId: string
    orderId: string
    salesId: string
    areaId: string
  }
}
export type InvoiceResponse = {
  url: string
  downloadUrl: string
  status: boolean
}
