export interface Customer {
  id: string
  documentType: EnumDocumentType
  documentNumber: string
  businessName: string
  address: string
  email: string
  phone: string
  region: string
  province: string
  district: string
  ubigeo: string
  state: string
  condition: string
  documentId?: string
}
export interface CreateCustomerRequest extends Omit<Customer, 'id'> {}
export enum EnumDocumentType {
  DNI = '1',
  PASSPORT = '7',
  DIPLOMATIC_IDENTITY_CARD = 'A',
  FOREIGNER_IDENTITY_CARD = '4',
  OTHERS = '0',
  RUC = '6',
}
