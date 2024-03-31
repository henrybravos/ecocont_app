import { useNavigation } from '@react-navigation/native'
import { MotiView } from 'moti'
import { useEffect, useMemo, useState } from 'react'
import { FlatList, ScrollView, StyleSheet, View } from 'react-native'
import { Button, Divider, Icon, Surface } from 'react-native-paper'

import Block from '@components/Block'
import DraggableBottomPanResponder from '@components/DraggableBottomPanResponder'
import Text from '@components/Text'

import OrderDraggableBottom from '@screens/components/order-product/OrderDraggableBottom'
import ProductComponent from '@screens/components/order-product/Product'
import QuantityItems from '@screens/components/order-product/QuantityItems'
import SwipeProductOrder from '@screens/components/order-product/SwipeProductOrder'

import OrderSalesService from '@core/graphql/OrderSalesService'
import ProductService from '@core/graphql/ProductService'
import { MovementOrder, OrderSales } from '@core/types/order-sales'
import { Product } from '@core/types/product'

import { formatNumber, reduceSumMultiplyArray } from '@utils/scripts'

import { StackNavigation } from '@constants/types/navigation'

const pointDefault = {
  areaId: undefined,
  code: '01',
  description: 'MESA1',
  id: 'b7a98540-9659-11ec-b4c8-02a781d03422',
  orderId: 'd4b184aa-e4bb-11ee-bf4a-000c2996f016',
  x: 21,
  y: 0,
}

const OrderSalesScreen = () => {
  const { getState } = useNavigation<StackNavigation>()
  const state = getState()
  const pointParam = state.routes[state.index].params || pointDefault
  const [products, setProducts] = useState<Product[]>([])
  const [scrollEnabled, setScrollEnabled] = useState(true)
  const [order, setOrder] = useState<Partial<OrderSales> | null>({
    id: pointParam.orderId,
  })

  if (!pointParam.id) return

  const fetchOrderDetails = (orderId: string) => {
    OrderSalesService.getDetailUserActive(orderId).then((data) => setOrder(data))
  }
  const fetchProductsFavorites = () => {
    ProductService.getProductsFavorite().then((productsTop) => setProducts(productsTop))
  }
  useEffect(() => {
    if (pointDefault.orderId) fetchOrderDetails(pointParam.orderId)
    fetchProductsFavorites()
  }, [pointParam.orderId])

  const callbackReleasePan = () => {
    setScrollEnabled(true)
  }
  const callbackStartPan = () => {
    setScrollEnabled(false)
  }
  return (
    <Block>
      <Block>
        <Text>Mesa {pointParam.description}</Text>
        <ScrollView scrollEnabled={scrollEnabled}>
          <View style={styles.container}>
            {products.map((p) => (
              <ProductComponent key={p.id} p={p} scrollEnabled={scrollEnabled} />
            ))}
          </View>
        </ScrollView>
      </Block>
      <Block flex={0} height={80}>
        <Surface style={{ flex: 1 }}>
          <Text />
        </Surface>
      </Block>
      <Block flex={0}>
        <OrderDraggableBottom
          callbackReleasePan={callbackReleasePan}
          callbackStartPan={callbackStartPan}
          order={order || {}}
        />
      </Block>
    </Block>
  )
}
export default OrderSalesScreen
const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
})
