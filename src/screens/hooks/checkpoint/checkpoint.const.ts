import { DocumentInvoiceType, SeriesType } from '@core/types/sales'

enum PaymentType {
  BANK = 'BANK',
  CASH = 'CASH',
  CREDIT = 'CREDIT',
}
const PaymentTypeLabel = {
  [PaymentType.CASH]: 'Efectivo',
  [PaymentType.BANK]: 'Cuentas B.',
  [PaymentType.CREDIT]: 'OP al crédito',
}
const PaymentsTypes = {
  [PaymentType.CASH]: {
    total: '-',
  },
  [PaymentType.BANK]: {
    total: '-',
    randomId: '',
    reference: '',
  },
  [PaymentType.CREDIT]: {
    total: '-',
    installments: [] as { date: string; days: number; code: number; amount: string }[],
  },
}
type CreateSales = { documentType: DocumentInvoiceType; series: SeriesType }

export { PaymentType, PaymentTypeLabel, PaymentsTypes, CreateSales }
