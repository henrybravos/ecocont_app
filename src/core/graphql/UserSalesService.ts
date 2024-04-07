import gql from 'graphql-tag'

import {
  salesActiveUserResponseAdapter,
  salesAttentionPointResponseAdapter,
} from '@core/adapters/sales.adapter'

import client from '@utils/apollo'
import { getAuthenticationStorage } from '@utils/scripts'

import { AttentionPointResponseApi, UserSalesResponseApi } from '../types'

const UserSalesService = {
  getDetailUserActive: async () =>
    client
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
              }
              zonas {
                id
                codigo
                local_id
                control_mesa
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
        return salesActiveUserResponseAdapter(response.data)
      }),
  getAttentionPoints: async ({ areaId }: { areaId: string }) =>
    client
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
      .then((response) => salesAttentionPointResponseAdapter(response.data)),
}

export default UserSalesService
