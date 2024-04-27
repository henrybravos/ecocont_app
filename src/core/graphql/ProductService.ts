import gql from 'graphql-tag'

import {
  productCategoryResponseAdapter,
  productResponseAdapter,
} from '@core/adapters/product.adapter'
import {
  CategoryResponseApi,
  ProductByCategoryResponseApi,
  ProductSearchResponseApi,
  ProductTopResponseApi,
} from '@core/types'

import { getClient } from '@utils/apollo'
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
    return getClient()
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
    return getClient()
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
  },
  getCategoryProducts: async ({ categoryId }: { categoryId: string }) => {
    return getClient()
      .query<ProductByCategoryResponseApi>({
        query: gql`
          query productsByCategoriaId($categoria_id: String!) {
            productsByCategoriaId(categoria_id: $categoria_id)  ${gqlProducts}
          }
        `,
        variables: { categoria_id: categoryId },
        fetchPolicy: 'no-cache',
        context: { headers: { Authentication: `Bearer ${await getAuthenticationStorage()}` } },
      })
      .then((response) => {
        return productResponseAdapter(response.data.productsByCategoriaId)
      })
  },
  getCategories: async () => {
    return getClient()
      .query<CategoryResponseApi>({
        query: gql`
          {
            Categorias: categorias {
              id
              codigo
              nombre
            }
          }
        `,
        variables: {},
        fetchPolicy: 'no-cache',
        context: { headers: { Authentication: `Bearer ${await getAuthenticationStorage()}` } },
      })
      .then((response) => {
        return productCategoryResponseAdapter(response.data)
      })
  },
}
export default ProductService
