import gql from 'graphql-tag'

import {
  salesActiveUserResponseAdapter,
  salesAttentionPointResponseAdapter,
} from '@core/adapters/sales.adapter'

import { getClient } from '@utils/apollo'
import { getAuthenticationStorage } from '@utils/scripts'

import { AttentionPointApi, AttentionPointResponseApi, UserSalesResponseApi } from '../types'

const UserSalesService = {
  getDetailUserActive: async () =>
    getClient()
      .query<UserSalesResponseApi>({
        query: gql`
          query getUserActive {
            userActive {
              id
              role_id
              cajas {
                id
                code
                description
                zonas {
                  id
                  codigo
                  descripcion
                }
                cuentas {
                  id
                  tipo
                  banco_id
                  descripcion
                  control
                  moneda {
                    codigo
                  }
                  pcge {
                    id
                  }
                }
                detalle {
                  id
                  saldo_inicial
                  created_at
                  opened_at
                }
              }
              zonas {
                id
                codigo
                local_id
                control_mesa
                descripcion
                mesas {
                  id
                  codigo
                  zona_id
                  pedido_id
                  x
                  y
                }
              }
            }
          }
        `,
        variables: {},
        fetchPolicy: 'no-cache',
        context: { headers: { Authentication: `Bearer ${await getAuthenticationStorage()}` } },
      })
      .then((response) => {
        //console.log('userData', response.data)
        return salesActiveUserResponseAdapter(response.data)
      }),
  getAttentionPoints: async ({ areaId }: { areaId: string }) =>
    getClient()
      .query<AttentionPointResponseApi>({
        query: gql`
          query mesas($zona: String!) {
            mesas(zona: $zona) {
              id
              codigo
              descripcion
              x
              y
              pedido_id
              pedido {
                created_at
                __typename
              }
              __typename
            }
          }
        `,
        variables: { zona: areaId },
        fetchPolicy: 'no-cache',
        context: { headers: { Authentication: `Bearer ${await getAuthenticationStorage()}` } },
      })
      .then((response) => salesAttentionPointResponseAdapter(areaId, response.data)),
  subscriptionPointSaleByZone: ({ areaId }: { areaId: string }) => {
    const client = getClient()
    return client.subscribe<{
      updateMesaByZona: AttentionPointApi
    }>({
      query: gql`
        subscription updateMesaByZona($zona_id: String!) {
          updateMesaByZona(zona_id: $zona_id) {
            id
            zone_id
            codigo
            descripcion
            x
            y
            pedido_id
            pedido {
              created_at
            }
          }
        }
      `,
      variables: { zona_id: areaId },
      fetchPolicy: 'no-cache',
    })
  },
}

export default UserSalesService
