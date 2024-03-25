import { NormalizedCacheObject } from 'apollo-cache-inmemory'
import ApolloClient from 'apollo-client'
import gql from 'graphql-tag'

import { authenticationStorage, refreshStorage } from '../../utils/scripts'
import { loginResponseFromApiAdapter } from '../adapters/auth.adapter'
import { AuthResponseApi } from '../types'

type LoginParams = {
  email: string
  password: string
}
type TokenParam = {
  token: string
}
const AuthService = {
  sendVerify: (
    client: ApolloClient<NormalizedCacheObject>,
    variables: Omit<LoginParams, 'password'>,
  ) =>
    client.mutate({
      mutation: gql`
        mutation sendVerific($email: String) {
          sendVerific(email: $email) {
            id
          }
        }
      `,
      variables,
    }),
  createToken: (client: ApolloClient<NormalizedCacheObject>, login: LoginParams) =>
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
  resetPassword: <T>(
    client: ApolloClient<NormalizedCacheObject>,
    variables: LoginParams & TokenParam,
    recursos: T,
  ) =>
    client.mutate({
      mutation: gql`mutation resetPassword($email: String!, $password: String!, $token: String!){
            passwordReset(email: $email password: $password token: $token) {
                ${recursos}
            }
        }`,
      variables: variables,
    }),
  resetEmail: <T>(
    client: ApolloClient<NormalizedCacheObject>,
    variables: Omit<LoginParams, 'password'>,
    recursos: T,
  ) =>
    client.query({
      query: gql`query resetPassword($email: String!){
            reset(email: $email) {
                ${recursos}
            }
        }`,
      variables,
      fetchPolicy: 'no-cache',
    }),
  confirmationEmail: <T>(
    client: ApolloClient<NormalizedCacheObject>,
    variables: TokenParam,
    recursos: T,
  ) =>
    client.mutate({
      mutation: gql`mutation confirmationEmail($token: String!){
            emailConfirmation(token: $token) {
                ${recursos}
            }
        }`,
      variables,
    }),
  resetVerifyToken: <T>(
    client: ApolloClient<NormalizedCacheObject>,
    { token }: TokenParam,
    recursos: T,
  ) =>
    client.query({
      query: gql`query resetVerify($token: String!) {
            verify(token: $token) {
                ${recursos}
            }
        }`,
      variables: { token },
      fetchPolicy: 'no-cache',
    }),
  resetVerifyRefreshToken: async <T>(
    client: ApolloClient<NormalizedCacheObject>,
    recursos: string,
  ) =>
    client.query<T>({
      query: gql`query resetVerify($refresh: String!) {
            refresh(refresh: $refresh) {
                ${recursos}
            }
        }`,
      variables: { refresh: await refreshStorage('Auth') },
      fetchPolicy: 'no-cache',
      context: { headers: { Authentication: `Bearer ${await authenticationStorage('Auth')}` } },
    }),
  refreshToken: async (client: ApolloClient<NormalizedCacheObject>, recursos: string) =>
    client.query({
      query: gql`query refreshToken($authentication: String!) {
            refresh(authentication: $authentication) {
                ${recursos}
            }
        }`,
      variables: { refresh: await refreshStorage('Auth2') },
      fetchPolicy: 'no-cache',
      context: { headers: { Authentication: `Bearer ${await authenticationStorage('Auth2')}` } },
    }),
}

export default AuthService
