import { AuthApi, AuthResponseApi } from '../types'
import { Auth, AuthResponse } from '../types/auth'
import { businessFromApiAdapter } from './business.adapter'
import { locationBusinessFromApiAdapter } from './location-business.adapter'

export const authFromApiAdapter = (auth: AuthApi): Auth => {
  return {
    authentication: auth.authentication,
    authorization: auth.authorization,
    moduleId: auth.modulo_id,
    refreshToken: auth.refresh,
  }
}
export const loginResponseFromApiAdapter = (auth: AuthResponseApi): AuthResponse => {
  return {
    login: {
      business: businessFromApiAdapter(auth.login.company),
      locationBusiness: locationBusinessFromApiAdapter(auth.login.local),
      authentication: auth.login.authentication,
      authorization: auth.login.authorization,
      moduleId: auth.login.modulo_id,
      refreshToken: auth.login.refresh,
    },
  }
}
