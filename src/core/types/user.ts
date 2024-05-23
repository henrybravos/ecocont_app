export type AttentionPoint = {
  id: string
  code: string
  description: string
  x: number
  y: number
  areaId: string
  orderId: string
}
export type SalesArea = {
  id: string
  code: string
  description: string
  locationId: string
  controlAttentionPoint: boolean
  attentionPoints: AttentionPoint[]
}
export type Account = {
  id: string
  description: string
  currency: {
    code: string
  }
  pcge: {
    id: string
  }
  type: 'CASH' | 'BANK'
  control: boolean
  bankId: string | null
}
export type Checkout = {
  id: string
  code: string
  description: string
  areas: SalesArea[]
  accounts: Account[]
}
export type UserSales = {
  id: string
  roleId: string
  checkouts: Checkout[]
  areas: SalesArea[]
}
