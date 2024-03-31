import gql from 'graphql-tag'

import { productResponseAdapter } from '@core/adapters/product.adapter'
import { ProductTopResponseApi } from '@core/types'

import client from '@utils/apollo'
import { getAuthenticationStorage } from '@utils/scripts'

const ProductService = {
  getProductsFavorite: async () => {
    return client
      .query<ProductTopResponseApi>({
        query: gql`
          {
            productosTop {
              id
              codigo
              is_combo
              descripcion
              precio_unitario
              valor_unitario
              icbper
              codigo_sunat
              medida {
                id
                codigo
                nombre
              }
              precios {
                id
                nombre
                precio
                total_parcial
                total_general
                imagen
              }
              tIGV {
                id
                codigo
                descripcion
              }
              imagen
              tipo_igv
              pcgeVenta {
                id
                code
                name
              }
              stock
              codigo_barras
            }
          }
        `,
        variables: {},
        fetchPolicy: 'no-cache',
        context: { headers: { Authentication: `Bearer ${await getAuthenticationStorage()}` } },
      })
      .then((response) => {
        return productResponseAdapter(response.data)
      })
  },
}
export default ProductService
