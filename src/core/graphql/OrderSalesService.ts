import gql from 'graphql-tag'

import { orderSalesResponseAdapter } from '@core/adapters/order-sales.adapter'
import { OrderSalesResponseApi } from '@core/types'

import client from '@utils/apollo'
import { getAuthenticationStorage } from '@utils/scripts'

const OrderSalesService = {
  getDetailUserActive: async ({ orderId }: { orderId: string }) =>
    client
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
}

export default OrderSalesService
