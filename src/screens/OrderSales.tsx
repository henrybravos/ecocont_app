import { useNavigation } from '@react-navigation/native'
import { StatusBar } from 'expo-status-bar'
import { ScrollView, StyleSheet, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import Block from '@components/Block'
import { BOTTOM_SHEET_MIN_HEIGHT } from '@components/DraggableBottomPanResponder'

import OrderCartDraggable from '@screens/components/order-product/OrderDraggableBottom'
import ProductComponent from '@screens/components/order-product/Product'
import SkeletonProducts from '@screens/components/order-product/SkeletonProducts'
import OrderSalesProvider, { useOrderSalesContext } from '@screens/hooks/order-sales/order-context'

import { StackNavigation } from '@constants/types/navigation'

const pointDefault = {
  areaId: '',
  code: '01',
  description: 'MESA1',
  id: 'b7a98540-9659-11ec-b4c8-02a781d03422',
  orderId: 'd4b184aa-e4bb-11ee-bf4a-000c2996f016',
  x: 21,
  y: 0,
}
const OrderSalesProductList = () => {
  const ctx = useOrderSalesContext()
  return (
    <View style={styles.container}>
      {ctx.products.map((p) => (
        <ProductComponent key={p.id} p={p} scrollEnabled={true} />
      ))}
    </View>
  )
}
const OrderSalesManagement = () => {
  const ctx = useOrderSalesContext()
  return (
    <Block>
      <Block>
        {ctx.isLoadingProducts ? (
          <SkeletonProducts />
        ) : (
          <ScrollView>
            <OrderSalesProductList />
          </ScrollView>
        )}
      </Block>
      {ctx.isOpenOrderCart && <View style={styles.overlay} />}
      <Block flex={0} height={BOTTOM_SHEET_MIN_HEIGHT} style={styles.transparent} />
      <Block flex={0}>
        <OrderCartDraggable />
      </Block>
    </Block>
  )
}
const OrderSalesScreen = () => {
  const { getState } = useNavigation<StackNavigation>()
  const state = getState()
  const pointParam = state.routes[state.index].params || pointDefault
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar style="dark" />
      <OrderSalesProvider point={pointParam}>
        <OrderSalesManagement />
      </OrderSalesProvider>
    </SafeAreaView>
  )
}
export default OrderSalesScreen
const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  overlay: {
    backgroundColor: '#000',
    opacity: 0.65,
    top: 0,
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  transparent: {
    backgroundColor: 'transparent',
  },
})
