import { InMemoryCache } from 'apollo-cache-inmemory'
import { ApolloClient } from 'apollo-client'
import { ApolloLink } from 'apollo-link'
import { onError } from 'apollo-link-error'
import { HttpLink } from 'apollo-link-http'
import { ServerError } from 'apollo-link-http-common'
import { WebSocketLink } from 'apollo-link-ws'
import { getMainDefinition } from 'apollo-utilities'
import { OperationDefinitionNode } from 'graphql'

import { URL_API, WS_URL } from '@constants/environment'

import { SESSION_IN_OTHER_DEVICE, TOKEN_EXPIRED, TOKEN_INVALID } from './error'

const client = new ApolloClient({
  link: ApolloLink.from([
    onError(({ networkError }) => {
      console.log('networkError', networkError)
      const error = networkError as ServerError
      if (error && error.statusCode) {
        switch (error.statusCode) {
          case TOKEN_EXPIRED:
            console.log('El Token ha Expirado')
            break
          case SESSION_IN_OTHER_DEVICE:
            console.log('Sesión iniciada en otro dispositivo')
            break
          case TOKEN_INVALID:
            console.log('No tiene los privilegios...')
            break
          default:
            break
        }
      }
    }),
    ApolloLink.split(
      ({ query }) => {
        const main = getMainDefinition(query) as OperationDefinitionNode
        if (main.operation) {
          return main.operation === 'subscription'
        }
        return false
      },
      new WebSocketLink({
        uri: WS_URL,
        options: {
          reconnect: true,
          connectionParams: {
            // headers: {
            //     Authentication: `Bearer ${authentication}`
            // }
          },
        },
      }),
      new HttpLink({
        uri: URL_API,
        headers: {
          //      Authentication: `Bearer ${authentication}`
        },
      }),
    ),
  ]),
  cache: new InMemoryCache(),
})

export default client
