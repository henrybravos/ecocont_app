import {
  CategoryResponseApi,
  ProductApi,
  ProductResponseApi,
  ProductTopResponseApi,
} from '@core/types'
import { Category, MeasurementUnit, Product } from '@core/types/product'

export const measurementUnitAdapter = (measurement: ProductApi['medida']): MeasurementUnit => {
  return {
    id: measurement.id,
    code: measurement.codigo,
    name: measurement.nombre,
  }
}
export const productOrderAdapter = (product: ProductApi): Partial<Product> => {
  return {
    id: product.id,
    code: product.codigo,
    igvType: product.tipo_igv,
    pcgeSales: product.pcgeVenta,
    sunatCode: product.codigo_sunat,
    description: product.descripcion,
    measurementUnit: measurementUnitAdapter(product.medida),
  }
}
export const productAdapter = (product: ProductTopResponseApi['productosTop'][0]): Product => {
  return {
    barcode: product.codigo_barras,
    code: product.codigo,
    description: product.descripcion,
    icbper: product.icbper,
    id: product.id,
    igvType: product.tipo_igv,
    image: product.imagen,
    isCombo: product.is_combo,
    pcgeSales: product.pcgeVenta,
    stock: product.stock,
    sunatCode: product.codigo_sunat,
    tIGV: {
      code: product.tIGV.codigo,
      description: product.tIGV.descripcion,
      id: product.tIGV.id,
    },
    unitPrice: product.precio_unitario,
    unitValue: product.valor_unitario,
    variants: product.precios.map((p) => ({
      generalTotal: p.total_general,
      id: p.id,
      imageUrl: p.imagen,
      name: p.nombre,
      partialTotal: p.total_parcial,
      price: p.precio,
    })),
    measurementUnit: measurementUnitAdapter(product.medida),
  }
}
export const productResponseAdapter = (response: ProductResponseApi[]): Product[] => {
  return response.map(productAdapter)
}
export const productCategoryResponseAdapter = (response: CategoryResponseApi): Category[] => {
  return response.Categorias.map((c) => ({
    id: c.id,
    name: c.nombre,
    code: c.codigo,
  }))
}
