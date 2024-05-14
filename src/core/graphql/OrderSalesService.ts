import gql from 'graphql-tag'

import { orderSalesResponseAdapter } from '@core/adapters/order-sales.adapter'
import { salesToApiRequest } from '@core/adapters/sales.adapter'
import { OrderSalesResponseApi } from '@core/types'
import { CreateOrUpdatePedidoResponse } from '@core/types/api-sales'
import { Invoice } from '@core/types/sales'

import { getClient } from '@utils/apollo'
import { getAuthenticationStorage } from '@utils/scripts'

const OrderSalesService = {
  getDetailUserActive: async ({ orderId }: { orderId: string }) =>
    getClient()
      .query<OrderSalesResponseApi>({
        query: gql`
          query order($id: String!) {
            pedido(id: $id) {
              id
              fecha_emision
              comprobante {
                codigo
                nombre
                id
              }
              serie
              correlativo
              persona_asociado_id
              persona {
                numero
                razon_social
                id
              }
              moneda {
                codigo
                nombre
              }
              glosa
              venta {
                id
              }
              movimientos {
                id
                cantidad
                costo_unitario
                igv
                precio_unitario
                icbper
                producto_id
                t_facturacion {
                  codigo
                }
                producto {
                  id
                  codigo
                  descripcion
                  codigo_sunat
                  tipo_igv
                  tIGV {
                    id
                    codigo
                    descripcion
                  }
                  medida {
                    id
                    codigo
                    nombre
                  }
                  pcgeVenta {
                    id
                    code
                    name
                  }
                }
                precio {
                  id
                  nombre
                }
              }
            }
          }
        `,
        variables: { id: orderId },
        fetchPolicy: 'no-cache',
        context: { headers: { Authentication: `Bearer ${await getAuthenticationStorage()}` } },
      })
      .then((response) => {
        return orderSalesResponseAdapter(response.data)
      }),
  createUpdateOrder: async ({ orderId, invoice }: { orderId: string; invoice: Invoice }) => {
    const invoiceToApi = salesToApiRequest(invoice)
    console.log({ invoiceToApi: JSON.stringify(invoiceToApi) })

    return getClient()
      .query<CreateOrUpdatePedidoResponse>({
        query: gql`
          mutation createOrUpdatePedido($id: String, $venta: JSON!) {
            createOrUpdatePedido(id: $id, venta: $venta) {
              id
              fecha_emision
              comprobante {
                codigo
                nombre
                id
              }
              serie
              correlativo
              persona_asociado_id
              persona {
                numero
                razon_social
                id
                email
                telefono
              }
              moneda {
                codigo
                nombre
              }
              observaciones
              venta {
                id
              }
              movimientos {
                id
                cantidad
                costo_unitario
                igv
                precio_unitario
                icbper
                producto_id
                t_facturacion {
                  codigo
                }
                producto {
                  id
                  codigo
                  descripcion
                  codigo_sunat
                  is_combo
                  tipo_igv
                  medida {
                    id
                    codigo
                    nombre
                  }
                  pcgeVenta {
                    id
                    code
                    name
                  }
                  stock
                }
                datos_adicionales
                precio {
                  id
                  nombre
                  total_parcial
                  total_general
                }
              }
              zona_id
            }
          }
        `,
        variables: { id: orderId, venta: invoiceToApi },

        fetchPolicy: 'no-cache',
        context: { headers: { Authentication: `Bearer ${await getAuthenticationStorage()}` } },
      })
      .then((response) => {
        console.log(response.data.createOrUpdatePedido)
        return response.data.createOrUpdatePedido.id
      })
      .catch((error) => {
        console.log({ error })
        return null
      })
  },
  saveInvoice: async ({ orderId, invoice }: { orderId: string; invoice: Invoice }) => {
    const invoiceToApi = salesToApiRequest(invoice)
    console.log({ invoiceToApi: JSON.stringify(invoiceToApi) })

    return getClient()
      .query<CreateOrUpdatePedidoResponse>({
        query: gql`
          mutation createOrUpdatePedido($id: String, $venta: JSON!) {
            createOrUpdatePedido(id: $id, venta: $venta) {
              apifact
              external_id
              file_name
              api_fact
              pdf_ruta
            }
          }
        `,
        variables: { id: orderId, venta: invoiceToApi },

        fetchPolicy: 'no-cache',
        context: { headers: { Authentication: `Bearer ${await getAuthenticationStorage()}` } },
      })
      .then((response) => {
        console.log(response.data.createOrUpdatePedido)
        return response.data.createOrUpdatePedido.id
      })
      .catch((error) => {
        console.log({ error })
        return null
      })
  },
}

export default OrderSalesService
