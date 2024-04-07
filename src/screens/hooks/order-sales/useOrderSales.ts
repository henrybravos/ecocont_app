import { useCallback, useEffect, useMemo, useState } from 'react'

import OrderSalesService from '@core/graphql/OrderSalesService'
import ProductService from '@core/graphql/ProductService'
import { MovementOrder } from '@core/types/order-sales'
import { Product } from '@core/types/product'
import { AttentionPoint } from '@core/types/user'

import fetchApi from '@hooks/useFetchApi'

import { reduceSumMultiplyArray } from '@utils/scripts'

const useOrderSales = (point: AttentionPoint) => {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoadingProductsTop, productsTop, fetchProductsTop] = fetchApi(
    ProductService.getTopProducts,
  )
  const [isLoadingProductsSearch, productsSearch, fetchProductsSearch] = fetchApi(
    ProductService.getSearchProducts,
  )
  const [isLoadingOrderSales, order, fetchOrder] = fetchApi(OrderSalesService.getDetailUserActive)
  const [productOrders, setProductOrders] = useState<Partial<MovementOrder>[]>([])
  const [isOpenOrderCart, setIsOpenOrder] = useState(false)

  useEffect(() => {
    if (point.orderId) fetchOrder({ orderId: point.orderId })
    if (point.id) fetchProductsTop()
  }, [point.orderId])

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
  return {
    isLoadingProducts: isLoadingProductsTop || isLoadingProductsSearch,
    isOpenOrderCart,
    isLoadingOrderSales,
    isDisplayButtonConfirm,
    order,
    point,
    products,
    totalOrder,
    productOrders,

    callbackOpenCart,
    handleExistInCart,
    handleSearchProductApi,
    handleUpdateProductToCart,
    handleRemoveProductFromCart,
  }
}

export default useOrderSales
