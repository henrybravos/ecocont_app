import { CompanyApi } from '../types'
import { Business } from '../types/business'

export const businessFromApiAdapter = (businessApi: CompanyApi): Business => {
  return {
    id: businessApi.id,
    businessName: businessApi.razon_social,
    period: businessApi.periodo,
    ruc: businessApi.ruc,
    sector: businessApi.rubro,
    soapSending: businessApi.soap_envio,
    uit: businessApi.uit,
    locations: [],
  }
}
