export type MeasurementUnit = {
  id: string
  code: string
  name: string
}
export type PcgeSales = {
  id: string
  code: string
  name: string
}
export type tIGV = {
  id: string
  code: string
  description: string
}
export type ProductVariant = {
  id: string
  name: string
  price: number
  partialTotal: number
  generalTotal: number
  imageUrl: string
}
export type Product = {
  id: string
  code: string
  stock: number
  image: string
  icbper: number
  igvType: string
  barcode: string
  isCombo: boolean
  sunatCode: string
  unitPrice: number
  unitValue: number
  description: string
  tIGV: tIGV
  pcgeSales: PcgeSales
  measurementUnit: MeasurementUnit
  variants: ProductVariant[]
}
export type Category = {
  id: string
  name: string
  code: string
}
