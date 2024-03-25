export type Business = {
  id: string
  ruc: string
  businessName: string
  soapSending: string
  period: string
  sector: string
  uit: string
  locations: LocationBusiness[]
}
export type LocationBusiness = {
  id: string
  address: string
  shortName: string
}
