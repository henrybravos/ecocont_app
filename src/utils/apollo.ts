import { createNavigationContainerRef } from '@react-navigation/native'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { ApolloClient } from 'apollo-client'
import { ApolloLink } from 'apollo-link'
import { onError } from 'apollo-link-error'
import { HttpLink } from 'apollo-link-http'
import { ServerError } from 'apollo-link-http-common'
import { WebSocketLink } from 'apollo-link-ws'
import { getMainDefinition } from 'apollo-utilities'
import { OperationDefinitionNode } from 'graphql'

import { getAuthenticationStorage } from '@utils/scripts'

import { URL_API, WS_URL } from '@constants/environment'
import { RootStackParamList, SCREENS } from '@constants/types/navigation'

import { SESSION_IN_OTHER_DEVICE, TOKEN_EXPIRED, TOKEN_INVALID } from './error'

export const navigationRef = createNavigationContainerRef<RootStackParamList>()

let authToken = ''

const updateAuthToken = async () => {
  authToken = (await getAuthenticationStorage()) || ''
  console.log('authToken', authToken)
}
updateAuthToken()
const getClient = () => {
  return new ApolloClient({
    link: ApolloLink.from([
      onError(({ networkError }) => {
        console.log('networkError', networkError)
        const error = networkError as ServerError
        if (error && error.statusCode) {
          switch (error.statusCode) {
            case TOKEN_EXPIRED:
              console.log('El Token ha Expirado')
              if (navigationRef.isReady()) {
                navigationRef.navigate(SCREENS.LOGIN)
              }
              break
            case SESSION_IN_OTHER_DEVICE:
              console.log('Sesión iniciada en otro dispositivo')
              if (navigationRef.isReady()) {
                navigationRef.navigate(SCREENS.LOGIN)
              }
              break
            case TOKEN_INVALID:
              console.log('No tiene los privilegios...')
              if (navigationRef.isReady()) {
                navigationRef.navigate(SCREENS.LOGIN)
              }
              break
            default:
              break
          }
        }
      }),
      ApolloLink.split(
        ({ query }) => {
          const { kind, operation } = getMainDefinition(query) as OperationDefinitionNode
          return kind === 'OperationDefinition' && operation === 'subscription'
        },
        new WebSocketLink({
          uri: WS_URL,
          options: {
            reconnect: true,
            connectionParams: {
              headers: {
                Authentication: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjdmYjQ4N2MyLWU0YmItMTFlZS1hMmRmLTAwMGMyOTk2ZjAxNiIsImVtYWlsIjoiaGVucnkxMjNAZ21haWwuY29tIiwicm9sZSI6IkNhamVybyIsInJvbGVfaWQiOiIwZjE3ZTQzOC0yMjBjLTExZWMtYWRmNS03N2JlMDM0NGUyMmIiLCJzdWIiOiJIRU5SWSBZRVJSWSBCUkFWTyBTQU5DSEVaIiwidW5pcXVlZCI6IjQwNHA3bTE2bHZndHdndHYiLCJpYXQiOjE3MTQxNTI1ODMsImV4cCI6MTcxNDE1OTc4M30.JgvPbw5ARseVPzQgpJvjM52agqgSOI479DKjuMfELb0`,
              },
            },
          },
        }),
        new HttpLink({
          uri: URL_API,
          headers: {
            Authentication: authToken ? `Bearer ${authToken}` : '',
          },
        }),
      ),
    ]),
    cache: new InMemoryCache(),
  })
}
export { getClient }
