import { useCallback, useEffect, useMemo, useState } from 'react'

import OrderSalesService from '@core/graphql/OrderSalesService'
import ProductService from '@core/graphql/ProductService'
import { MovementOrder, OrderSales } from '@core/types/order-sales'
import { Product } from '@core/types/product'
import { AttentionPoint } from '@core/types/user'

import fetchApi from '@hooks/useFetchApi'

import { reduceSumMultiplyArray } from '@utils/scripts'

const useOrderSales = (point: AttentionPoint) => {
  const [isLoadingProducts, products, fetchProductsFavorites] = fetchApi(
    ProductService.getProductsFavorite,
  )
  const [isLoadingOrderSales, orderSales, fetchOrderSales] = fetchApi(
    OrderSalesService.getDetailUserActive,
  )
  const [productOrders, setProductOrders] = useState<Partial<MovementOrder>[]>([])
  const [isOpenOrderCart, setIsOpenOrder] = useState(false)
  const [order, setOrder] = useState<Partial<OrderSales> | null>({
    id: point.orderId,
  })
  useEffect(() => {
    if (point.orderId) fetchOrderSales({ orderId: point.orderId })
    if (point.id) fetchProductsFavorites()
  }, [point.orderId])

  useEffect(() => {
    if (orderSales) {
      setOrder(orderSales)
      const movementsCopy = orderSales.movementOrder?.map((m) => ({ ...m })) || []
      setProductOrders(movementsCopy)
    }
  }, [orderSales])
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
    isLoadingProducts,
    isLoadingOrderSales,
    point,
    products,
    order,
    isOpenOrderCart,
    totalOrder,
    productOrders,
    isDisplayButtonConfirm,

    callbackOpenCart,
    handleExistInCart,
    handleUpdateProductToCart,
    handleRemoveProductFromCart,
  }
}

export default useOrderSales
