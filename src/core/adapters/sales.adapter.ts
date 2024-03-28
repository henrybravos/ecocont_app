import {
  AttentionPointApi,
  AttentionPointResponseApi,
  CheckoutApi,
  SalesAreaApi,
  UserSalesResponseApi,
} from '@core/types'
import { AttentionPoint, Checkout, SalesArea, UserSales } from '@core/types/user'

export const salesAttentionPointAdapter = (point: AttentionPointApi): AttentionPoint => {
  return {
    areaId: point.zona_id,
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
    attentionPoints: area.mesas?.map(salesAttentionPointAdapter) || [],
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
    code: checkout.code,
    description: checkout.description,
    id: checkout.id,
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
  point: AttentionPointResponseApi,
): AttentionPoint[] => {
  return point.mesas?.map(salesAttentionPointAdapter) || []
}
