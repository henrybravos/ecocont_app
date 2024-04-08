import { useCallback, useEffect, useMemo, useState } from 'react'

import OrderSalesService from '@core/graphql/OrderSalesService'
import ProductService from '@core/graphql/ProductService'
import { MovementOrder } from '@core/types/order-sales'
import { Product } from '@core/types/product'
import { AttentionPoint } from '@core/types/user'

import fetchApi from '@hooks/useFetchApi'

import { reduceSumMultiplyArray } from '@utils/scripts'

type ProductSelected = {
  mode?: 'edit' | 'delete'
  product?: Partial<MovementOrder>
}
const useOrderSales = (point: AttentionPoint) => {
  const [products, setProducts] = useState<Product[]>([])
  const [productSelected, setProductSelected] = useState<ProductSelected>({})
  const [isLoadingProductsTop, productsTop, fetchProductsTop] = fetchApi(
    ProductService.getTopProducts,
  )
  const [isLoadingProductsSearch, productsSearch, fetchProductsSearch] = fetchApi(
    ProductService.getSearchProducts,
  )
  const [isLoadingProductsCategory, productsCategory, fetchProductsByCategory] = fetchApi(
    ProductService.getCategoryProducts,
  )
  const [isLoadingCategories, categories, fetchCategories] = fetchApi(ProductService.getCategories)
  const [isLoadingOrderSales, order, fetchOrder] = fetchApi(OrderSalesService.getDetailUserActive)
  const [productOrders, setProductOrders] = useState<Partial<MovementOrder>[]>([])
  const [isOpenOrderCart, setIsOpenOrder] = useState(false)
  const [categoryIdSelected, setCategoryIdSelected] = useState<string>('TOP')

  useEffect(() => {
    if (point.orderId) fetchOrder({ orderId: point.orderId })
    if (point.id) {
      fetchProductsTop()
      fetchCategories()
    }
  }, [point.orderId])

  useEffect(() => {
    if (categoryIdSelected !== 'TOP') {
      fetchProductsByCategory({
        categoryId: categoryIdSelected,
      })
    }
  }, [categoryIdSelected])
  useEffect(() => {
    if (productsCategory) {
      setProducts(productsCategory)
    }
  }, [productsCategory])
  useEffect(() => {
    if (productsTop) {
      setProducts(productsTop)
    }
  }, [productsTop])
  useEffect(() => {
    if (productsSearch) {
      setProducts(productsSearch)
    }
  }, [productsSearch])
  useEffect(() => {
    if (order) {
      const movementsCopy = order.movementOrder?.map((m) => ({ ...m })) || []
      setProductOrders(movementsCopy)
    }
  }, [order])
  if (!point.id) return

  const totalOrder = useMemo(
    () => reduceSumMultiplyArray(productOrders || [], 'unitPrice', 'quantity', 0),
    [productOrders],
  )
  const handleExistInCart = useCallback(
    (productId: string) => {
      return productOrders?.find((m) => m.priceDetail?.id === productId)
    },
    [productOrders],
  )
  const handleSearchProductApi = useCallback(
    (search: string) => {
      if (search.trim().length === 0) {
        setProducts(productsTop)
      } else {
        fetchProductsSearch({ search })
      }
    },
    [fetchProductsSearch, productsTop],
  )
  const handleRemoveProductFromCart = useCallback(
    (productVariantId: string, quantityDecrease: number) => {
      const existIndex = productOrders.findIndex(
        (productOrder) => productOrder.priceDetail?.id === productVariantId,
      )
      if (existIndex >= 0) {
        const product = productOrders[existIndex]
        if ((product.quantity || 0) - quantityDecrease <= 0) {
          setProductOrders(productOrders.filter((p) => p.priceDetail?.id !== productVariantId))
        } else {
          const newProductOrders = [...productOrders]
          newProductOrders[existIndex].quantity =
            (newProductOrders[existIndex].quantity || 0) - quantityDecrease
          setProductOrders(newProductOrders)
        }
      }
    },
    [productOrders],
  )
  const handleUpdateProductToCart = useCallback(
    (variant: Product['variants'][0], product: Product, quantity: number, unitPrice: number) => {
      const existIndex = productOrders.findIndex(
        (productOrder) => productOrder.priceDetail?.id === variant.id,
      )
      if (existIndex >= 0) {
        const newProductOrders = [...productOrders]
        newProductOrders[existIndex].quantity =
          (newProductOrders[existIndex].quantity || 0) + quantity
        newProductOrders[existIndex].unitPrice = unitPrice
        setProductOrders(newProductOrders)
      } else {
        const newItem = {
          product,
          priceDetail: {
            id: variant.id,
            name: variant.name,
          },
          quantity,
          unitPrice,
        }
        setProductOrders([...productOrders, newItem])
      }
    },
    [productOrders],
  )
  const isDisplayButtonConfirm = useMemo(() => {
    const movementStringExist = JSON.stringify(order?.movementOrder || [])
    const movementStringToSave = JSON.stringify(productOrders)
    return movementStringExist !== movementStringToSave
  }, [order?.movementOrder, productOrders])
  const callbackOpenCart = (status: boolean) => setIsOpenOrder(status)
  const handleSelectCategory = (categoryId: string) => () => {
    setCategoryIdSelected(categoryId)
    if (categoryId === 'TOP') {
      setProducts(productsTop)
    }
  }
  const handleProductSelected = useCallback(
    (mode?: 'edit' | 'delete', product?: Partial<MovementOrder>) => () => {
      setProductSelected({ mode, product })
    },
    [],
  )
  return {
    isLoadingProducts: isLoadingProductsTop || isLoadingProductsSearch || isLoadingProductsCategory,
    isLoadingCategories,
    isOpenOrderCart,
    isLoadingOrderSales,
    isDisplayButtonConfirm,
    order,
    point,
    products,
    totalOrder,
    categories,
    productOrders,
    categoryIdSelected,
    productSelected,

    callbackOpenCart,
    handleExistInCart,
    handleSearchProductApi,
    handleUpdateProductToCart,
    handleRemoveProductFromCart,
    handleSelectCategory,
    handleProductSelected,
  }
}

export default useOrderSales
