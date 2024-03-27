import { NormalizedCacheObject } from 'apollo-cache-inmemory'
import ApolloClient from 'apollo-client'
import gql from 'graphql-tag'

import { authenticationStorage } from '../../utils/scripts'
import { loginResponseFromApiAdapter } from '../adapters/auth.adapter'
import { AuthRefreshResponseApi, AuthResponseApi } from '../types'

type LoginParams = {
  email: string
  password: string
}
const UserService = {
  getUserActive: (client: ApolloClient<NormalizedCacheObject>, login: LoginParams) =>
    client
      .query<AuthResponseApi>({
        query: gql`
          query getUserActive($email: String!, $password: String!) {
            userActive {
              id
              role_id
              cajas {
                id
                code
                zonas:{
                  id
                  codigo
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
                  x
                  y
                }
              }
             
            }
          }
        `,
        variables: login,
        fetchPolicy: 'no-cache',
      })
      .then((response) => {
        if (!response.data.login) throw new Error('Credenciales incorrectas')
        return loginResponseFromApiAdapter(response.data)
      }),
  refreshToken: async (client: ApolloClient<NormalizedCacheObject>, authentication: string) =>
    client.query<AuthRefreshResponseApi>({
      query: gql`
        query refreshToken($refresh: String!) {
          refresh(refresh: $refresh) {
            authentication
            authorization
            refresh
          }
        }
      `,
      variables: { refresh: authentication },
      fetchPolicy: 'no-cache',
      context: { headers: { Authentication: `Bearer ${await authenticationStorage('Auth')}` } },
    }),
}

export default UserService
