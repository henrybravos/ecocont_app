import { useNavigation } from '@react-navigation/native'
import { StatusBar } from 'expo-status-bar'
import { useMemo } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'
import { Chip, ChipProps } from 'react-native-paper'
import { SafeAreaView } from 'react-native-safe-area-context'

import Block from '@components/Block'
import { BOTTOM_SHEET_MIN_HEIGHT } from '@components/DraggableBottomPanResponder'
import EmptyComponent from '@components/EmptyComponent'
import Text from '@components/Text'
import SearchBarComponent from '@components/paper/SearchBar'

import OrderCartDraggable from '@screens/components/order-product/OrderDraggableBottom'
import ProductComponent from '@screens/components/order-product/Product'
import SkeletonCategories from '@screens/components/order-product/SkeletonCategories'
import SkeletonProducts from '@screens/components/order-product/SkeletonProducts'
import OrderSalesProvider, { useOrderSalesContext } from '@screens/hooks/order-sales/order-context'

import { COLORS } from '@constants/light'
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
type CategoryProps = ChipProps & {}
const Category = (props: CategoryProps) => {
  return (
    <Chip
      {...props}
      elevated
      compact
      mode="outlined"
      selectedColor={props.selected ? COLORS.primary.toString() : COLORS.dark.toString()}
    >
      {props.children}
    </Chip>
  )
}
const CategoryList = () => {
  const ctx = useOrderSalesContext()
  const CategoriesMemo = useMemo(() => {
    return ctx.categories?.map((c) => (
      <Category
        key={c.id}
        selected={ctx.categoryIdSelected === c.id}
        onPress={ctx.handleSelectCategory(c.id)}
      >
        {c.name}
      </Category>
    ))
  }, [ctx.categories, ctx.categoryIdSelected])
  return (
    <Block flex={0} row paddingVertical={4}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 4 }}
      >
        <Category
          selected={ctx.categoryIdSelected === 'TOP'}
          onPress={ctx.handleSelectCategory('TOP')}
        >
          TOP
        </Category>
        {ctx.isLoadingCategories ? <SkeletonCategories /> : CategoriesMemo}
      </ScrollView>
    </Block>
  )
}
const OrderSalesManagement = () => {
  const ctx = useOrderSalesContext()
  return (
    <Block>
      <SearchBarComponent onConfirmSearch={ctx.handleSearchProductApi} elevation={1} />
      <CategoryList />
      <Block>
        {ctx.isLoadingProducts ? (
          <SkeletonProducts />
        ) : ctx.products.length === 0 ? (
          <EmptyComponent message="No hay productos" />
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
