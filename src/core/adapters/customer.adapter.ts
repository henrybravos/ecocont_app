import { CreateCustomerRequest, Customer, EnumDocumentType } from '@core/types'
import { PeopleApi, PeopleDniApiRest, PeopleRucApiRest } from '@core/types/api-people'

import { DOCUMENTS_IDS } from '@constants/document'

export const customerFromRUCRest = (apiRest: PeopleRucApiRest) => {
  console.log({ apiRest })
  const customer: CreateCustomerRequest = {
    documentType: EnumDocumentType.RUC,
    documentNumber: apiRest.RUC,
    businessName: apiRest.RazonSocial,
    address: apiRest.Direccion,
    email: '',
    phone: '',
    condition: apiRest.Condicion,
    district: apiRest.Distrito,
    province: apiRest.Provincia,
    region: apiRest.Departamento,
    state: apiRest.Estado,
    ubigeo: apiRest.Ubigeo,
    documentId: '',
  }
  return customer
}
export const customerFromDNIRest = (apiRest: PeopleDniApiRest) => {
  console.log('DNI', { apiRest })

  const customer: CreateCustomerRequest = {
    documentType: EnumDocumentType.DNI,
    documentNumber: apiRest.DNI,
    businessName: apiRest.NombreCompleto,

    address: apiRest.Direccion,
    email: '',
    phone: '',
    condition: apiRest.EstadoCivil,
    district: apiRest.Distrito,
    province: apiRest.Provincia,
    region: apiRest.Departamento,
    state: apiRest.EsPersonaViva,
    ubigeo: apiRest.Ubigeo,
    documentId: '',
  }
  return customer
}
export const customerCreateResponse = (response: {
  id: string
  numero: string
  razon_social: ''
}) => {
  return {
    id: response.id,
    documentNumber: response.numero,
    businessName: response.razon_social,
  }
}

export const customerCreateToApi = (customer: Customer) => {
  const isDni = customer.documentType === EnumDocumentType.DNI
  const isRuc = customer.documentType === EnumDocumentType.RUC

  let documentId = isDni ? DOCUMENTS_IDS.dniId : isRuc ? DOCUMENTS_IDS.rucId : ''
  const customerApi: PeopleApi = {
    email: customer.email,
    estado: customer.state,
    direccion: customer.address,
    condicion: customer.condition,
    departamento: customer.region,
    documento_id: documentId,
    razon_social: customer.businessName,
    numero: customer.documentNumber,
    provincia: customer.province,
    distrito: customer.district,
    telefono: customer.phone,
    ubigeo: customer.ubigeo,
    tipo: '2',
    is_default: false,
    observacion: '',
    suministro: '',
    localidad: '',
    potencia: '',
    tencion: '',
    energia: '',
    tarifa: '',
  }
  return customerApi
}
