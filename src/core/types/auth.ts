import { Business, LocationBusiness } from './business'

export type Auth = {
  authentication?: string
  authorization?: string
  moduleId?: string
  refreshToken?: string
}
export type AuthResponse = Auth & {
  business: Business
  locationBusiness: LocationBusiness
}

export type UserAuth = {
  auth?: Auth
  business?: Business
  locationBusiness?: LocationBusiness
}
