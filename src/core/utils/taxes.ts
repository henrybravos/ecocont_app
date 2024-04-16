import { VentaItemApi } from '@core/types/api-sales'

type TaxesAmounts = {
  codeIGVType: string
  total: number
  igv: number
}
export const getTaxesAmounts = ({ codeIGVType, total, igv }: TaxesAmounts) => {
  let subTotal = 0
  let taxable = 0
  let free = 0
  let exonerated = 0
  let unaffected = 0
  let exportAmount = 0
  //https://cpe.sunat.gob.pe/sites/default/files/inline-files/anexoV-340-2017.pdf
  switch (codeIGVType) {
    case '10': // gravadas
    case '17':
      subTotal = total - igv
      taxable = subTotal
      break
    case '21':
    case '31':
    case '32':
    case '33':
    case '34':
    case '35':
    case '36':
      igv = 0
    case '11':
    case '12':
    case '13':
    case '14':
    case '15':
    case '16':
      subTotal = total - igv
      free = subTotal
      break
    case '20':
      igv = 0
      subTotal = total - igv
      exonerated = subTotal
      break
    case '30':
      igv = 0
      subTotal = total - igv
      unaffected = subTotal
      break
    case '40':
      igv = 0
      subTotal = total - igv
      exportAmount = subTotal
      break
  }
  return {
    free,
    taxable,
    subTotal,
    unaffected,
    exonerated,
    export: exportAmount,
  }
}

export const getTotalsInvoice = (items: Partial<VentaItemApi>[]) => {
  let total_descuentos = 0,
    total_impuestos_bolsa_plastica = 0,
    total_anticipo = 0,
    total_cargos = 0,
    total_exportacion = 0,
    total_operaciones_gravadas = 0,
    total_operaciones_inafectas = 0,
    total_operaciones_exoneradas = 0,
    total_operaciones_gratuitas = 0,
    total_igv = 0,
    total_impuestos = 0,
    total_valor = 0,
    total_venta = 0,
    total_venta_info = 0

  for (const element of items) {
    const { gravada, inafecta, exonerada, exportacion, gratuita, total_valor_item, total_item } =
      element
    total_exportacion += exportacion || 0
    total_operaciones_gravadas += gravada || 0
    total_operaciones_inafectas += inafecta || 0
    total_operaciones_exoneradas += exonerada || 0
    total_impuestos_bolsa_plastica += element.total_impuestos_bolsa_plastica || 0
    total_operaciones_gratuitas += gratuita || 0
    total_igv += (gratuita || 0) === 0 ? element.total_igv ?? 0 : 0
    total_valor += (gratuita || 0) === 0 ? total_valor_item ?? 0 : 0
    total_venta += (total_item || 0) + (element.total_impuestos_bolsa_plastica || 0)
    total_venta_info += (total_item || 0) + (element.total_impuestos_bolsa_plastica || 0)
    total_impuestos +=
      ((gratuita || 0) === 0 ? element.total_igv ?? 0 : 0) +
      (element.total_impuestos_bolsa_plastica || 0)
  }

  return {
    items: items.length,
    total_descuentos,
    total_impuestos_bolsa_plastica,
    total_anticipo,
    total_cargos,
    total_exportacion,
    total_operaciones_gravadas,
    total_operaciones_inafectas,
    total_operaciones_exoneradas,
    total_operaciones_gratuitas,
    total_igv,
    total_impuestos,
    total_valor,
    total_venta,
    total_venta_info,
  }
}
