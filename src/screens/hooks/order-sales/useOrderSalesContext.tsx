import { ReactElement, createContext, useContext } from 'react'

import useOrderSales from '@screens/hooks/order-sales/useOrderSales'

import { AttentionPoint, Checkout } from '@core/types/user'

type OrderSalesType = ReturnType<typeof useOrderSales>
const OrderSalesContext = createContext<OrderSalesType | null>(null)

type OrderSalesProvider = {
  children: ReactElement
  point: AttentionPoint
  checkout: Checkout
}
const OrderSalesProvider = (props: OrderSalesProvider) => {
  const order = useOrderSales(props.point, props.checkout)
  return <OrderSalesContext.Provider value={order}>{props.children}</OrderSalesContext.Provider>
}
export const useOrderSalesContext = () => {
  const ctx = useContext(OrderSalesContext)
  if (!ctx) {
    throw new Error('should useOrderSalesContext in a OrderSalesProvider')
  }
  return ctx
}
export default OrderSalesProvider
