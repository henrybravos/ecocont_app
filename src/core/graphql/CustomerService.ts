import gql from 'graphql-tag'

import {
  customerCreateResponse,
  customerCreateToApi,
  customerFromDNIRest,
  customerFromRUCRest,
} from '@core/adapters/customer.adapter'
import { Customer, CustomerByParamResponseApi } from '@core/types'

import { getClient } from '@utils/apollo'

const CustomerService = {
  customerByParams: async ({ param }: { param: string }) =>
    getClient()
      .query<CustomerByParamResponseApi>({
        query: gql`
          query clientesByParam($param: String!) {
            clientesByParam(param: $param) {
              value
              label
              code
              name
            }
          }
        `,
        variables: {
          param,
        },
      })
      .then((response) => {
        //console.log(response.data.clientesByParam)
        return response.data.clientesByParam
      }),
  apiRestDniRuc: async ({ dni, ruc }: { dni?: string; ruc?: string }) => {
    const path = dni ? 'getDni' : 'getRuc'
    return getClient()
      .query({
        query: gql`
          query getApiRest($path: String!, $json: JSON!) {
            apirest(path: $path, json: $json) {
              success
              result
            }
          }
        `,
        variables: {
          path,
          json: {
            dni,
            ruc,
          },
        },
      })
      .then((response) => {
        if (!response.data?.apirest?.success) return
        if (dni) {
          return customerFromDNIRest(response.data.apirest.result)
        } else if (ruc) {
          return customerFromRUCRest(response.data.apirest.result)
        }
      })
  },

  createCustomer: async (customer: Customer) => {
    const customerApi = customerCreateToApi(customer)
    return getClient()
      .mutate({
        mutation: gql`
          mutation createPersona(
            $numero: String!
            $razon_social: String!
            $direccion: String
            $departamento: String
            $provincia: String
            $distrito: String
            $ubigeo: String
            $estado: String
            $condicion: String
            $documento_id: String!
            $observacion: String
            $email: String
            $telefono: String
            $tipo: String!
            $is_default: Boolean
            $suministro: String
            $localidad: String
            $tarifa: String
            $potencia: String
            $tencion: String
            $energia: String
            $cuenta_detraccion: String
          ) {
            createPersona(
              numero: $numero
              razon_social: $razon_social
              direccion: $direccion
              departamento: $departamento
              provincia: $provincia
              distrito: $distrito
              ubigeo: $ubigeo
              estado: $estado
              condicion: $condicion
              documento_id: $documento_id
              observacion: $observacion
              email: $email
              telefono: $telefono
              tipo: $tipo
              is_default: $is_default
              suministro: $suministro
              localidad: $localidad
              tarifa: $tarifa
              potencia: $potencia
              tencion: $tencion
              energia: $energia
              cuenta_detraccion: $cuenta_detraccion
            ) {
              id
              numero
              razon_social
            }
          }
        `,
        variables: {
          ...customerApi,
        },
      })
      .then((responseApi) => {
        console.log('response', responseApi.data)
        const response = customerCreateResponse(responseApi.data.createPersona)
        return {
          ...customer,
          id: response.id,
        }
      })
  },
}
export default CustomerService
