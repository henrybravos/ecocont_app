import AsyncStorage from '@react-native-async-storage/async-storage'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { ApolloClient } from 'apollo-client'
import { ApolloLink, Observable } from 'apollo-link'
import { onError } from 'apollo-link-error'
import { HttpLink } from 'apollo-link-http'
import { ServerError } from 'apollo-link-http-common'
import { WebSocketLink } from 'apollo-link-ws'
import { getMainDefinition } from 'apollo-utilities'
import { OperationDefinitionNode } from 'graphql'

import { Auth } from '../core'
import { SESSION_IN_OTHER_DEVICE, TOKEN_EXPIRED, TOKEN_INVALID } from './error'

let count = true
const logout = async () => {
  await AsyncStorage.setItem('Auth', JSON.stringify({}))
  await AsyncStorage.setItem('Company', JSON.stringify({}))
  // window.location.href = '/login'
}
type RefreshResponse = {
  authentication: string
  refresh: {
    authentication: string
  }
}
const client = new ApolloClient({
  link: ApolloLink.from([
    onError(({ networkError, operation, forward }) => {
      const error = networkError as ServerError
      if (error && error.statusCode) {
        switch (error.statusCode) {
          case TOKEN_EXPIRED:
            return new Observable((observer) => {
              Auth.resetVerifyRefreshToken<RefreshResponse>(client, 'authentication, refresh')
                .then(async ({ data, errors }) => {
                  const { refresh } = data
                  if (errors && errors.length > 0) {
                    await logout()
                    return
                  }
                  operation.setContext({
                    headers: { Authentication: `Bearer ${refresh.authentication}` },
                  })
                  forward(operation).subscribe({
                    next: observer.next.bind(observer),
                    error: observer.error.bind(observer),
                    complete: observer.complete.bind(observer),
                  })

                  let storedValue = await AsyncStorage.getItem('Auth')
                  storedValue = storedValue ? storedValue : '{}'

                  await AsyncStorage.setItem(
                    'Auth',
                    JSON.stringify({
                      ...JSON.parse(storedValue),
                      ...refresh,
                    }),
                  )
                })
                .catch(async (error) => {
                  // No refresh or client token available, we force user to login
                  observer.error(error)
                  await logout()
                })
            })
          case SESSION_IN_OTHER_DEVICE:
            if (count) {
              console.log('Se ha Inicio Sessión en otro Dispositivo')

              count = false
              setTimeout(async () => await logout(), 1000)
            }
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
        uri: `ws://erp.ecocont.pe:3008/graphql`,
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
        uri: `https://erp.ecocont.pe:3008/api`,
        // headers: {
        //     Authentication: `Bearer ${authentication}`
        // }
      }),
    ),
  ]),
  cache: new InMemoryCache(),
})

export default client
