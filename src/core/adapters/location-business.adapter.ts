import { LocalApi } from '../types'
import { LocationBusiness } from '../types/business'

export const locationBusinessFromApiAdapter = (localApi: LocalApi): LocationBusiness => {
  return {
    id: localApi.id,
    address: localApi.direccion,
    shortName: localApi.nombre_corto,
  }
}
