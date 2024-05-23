import gql from 'graphql-tag'

import { CustomerByParamResponseApi } from '@core/types'

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
              __typename
            }
          }
        `,
        variables: {
          param,
        },
      })
      .then((response) => {
        console.log(response.data.clientesByParam)
        return response.data.clientesByParam
      }),
}
export default CustomerService
