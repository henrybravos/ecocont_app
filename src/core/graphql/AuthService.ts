import { NormalizedCacheObject } from 'apollo-cache-inmemory'
import ApolloClient from 'apollo-client'
import gql from 'graphql-tag'

import client from '@utils/apollo'

import { getAuthenticationStorage } from '../../utils/scripts'
import { loginResponseFromApiAdapter } from '../adapters/auth.adapter'
import { AuthRefreshResponseApi, AuthResponseApi } from '../types'

type LoginParams = {
  email: string
  password: string
}

const AuthService = {
  createToken: (login: LoginParams) =>
    client
      .query<AuthResponseApi>({
        query: gql`
          query createToken($email: String!, $password: String!) {
            login(email: $email, password: $password) {
              authentication
              authorization
              refresh
              company {
                id
                ruc
                razon_social
                soap_envio
                periodo
                rubro
                uit
              }
              local {
                id
                direccion
                nombre_corto
              }
              modulo_id
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
  refreshToken: async ({ authentication }: { authentication: string }) =>
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
      context: { headers: { Authentication: `Bearer ${await getAuthenticationStorage()}` } },
    }),
}

export default AuthService
