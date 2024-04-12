import { useNavigation } from '@react-navigation/native'
import { StatusBar } from 'expo-status-bar'
import { useMemo } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'
import { Chip, ChipProps } from 'react-native-paper'
import { SafeAreaView } from 'react-native-safe-area-context'

import Block from '@components/Block'
import { BOTTOM_SHEET_MIN_HEIGHT } from '@components/DraggableBottomPanResponder'
import EmptyComponent from '@components/EmptyComponent'
import SearchBarComponent from '@components/paper/SearchBar'

import DeleteProductDialog from '@screens/components/order-product/DeleteProductDialog'
import EditProductDialog from '@screens/components/order-product/EditProductDialog'
import OrderCartDraggable from '@screens/components/order-product/OrderDraggableBottom'
import ProductListOrderSales from '@screens/components/order-product/ProductListOrderSales'
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
        selected={!ctx.searchText && ctx.categoryIdSelected === c.id}
        onPress={ctx.handleSelectCategory(c.id)}
      >
        {c.name}
      </Category>
    ))
  }, [ctx.categories, ctx.categoryIdSelected, ctx.searchText])
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
        <SkeletonProducts visible={ctx.isLoadingProducts} />
        <EmptyComponent
          message="No hay productos"
          visible={!ctx.isLoadingProducts && ctx.products.length === 0}
        />
        <ProductListOrderSales />
      </Block>
      <Block flex={0} height={BOTTOM_SHEET_MIN_HEIGHT} style={styles.transparent} />
      <OrderCartDraggable />
      <EditProductDialog />
      <DeleteProductDialog />
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
  transparent: {
    backgroundColor: 'transparent',
  },
})
