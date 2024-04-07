import gql from 'graphql-tag'

import { productResponseAdapter } from '@core/adapters/product.adapter'
import { ProductSearchResponseApi, ProductTopResponseApi } from '@core/types'

import client from '@utils/apollo'
import { getAuthenticationStorage } from '@utils/scripts'

const gqlProducts = `
{
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
`
const ProductService = {
  getTopProducts: async () => {
    return client
      .query<ProductTopResponseApi>({
        query: gql`
          {
            productosTop ${gqlProducts}
          }
        `,
        variables: {},
        fetchPolicy: 'no-cache',
        context: { headers: { Authentication: `Bearer ${await getAuthenticationStorage()}` } },
      })
      .then((response) => {
        return productResponseAdapter(response.data.productosTop)
      })
  },
  getSearchProducts: async ({ search }: { search: string }) => {
    return client
      .query<ProductSearchResponseApi>({
        query: gql`
          query productosbyParam($param: String!) {
              productosbyParam(param: $param) ${gqlProducts}
          }
        `,
        variables: { param: search },
        fetchPolicy: 'no-cache',
        context: { headers: { Authentication: `Bearer ${await getAuthenticationStorage()}` } },
      })
      .then((response) => {
        return productResponseAdapter(response.data.productosbyParam)
      })
      .catch((error) => {
        console.error(error)
        return error
      })
  },
}
export default ProductService
