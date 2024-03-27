import { AuthApi, AuthRefreshResponseApi, AuthResponseApi } from '../types'
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
    business: businessFromApiAdapter(auth.login.company),
    locationBusiness: locationBusinessFromApiAdapter(auth.login.local),
    authentication: auth.login.authentication,
    authorization: auth.login.authorization,
    moduleId: auth.login.modulo_id,
    refreshToken: auth.login.refresh,
  }
}

export const loginRefreshResponseFromApiAdapter = (auth: AuthRefreshResponseApi): AuthResponse => {
  console.log('company', auth.refresh)
  return {
    business: businessFromApiAdapter(auth.refresh.company),
    locationBusiness: locationBusinessFromApiAdapter(auth.refresh.local),
    authentication: auth.refresh.authentication,
    authorization: auth.refresh.authorization,
    moduleId: auth.refresh.modulo_id,
    refreshToken: auth.refresh.refresh,
  }
}
