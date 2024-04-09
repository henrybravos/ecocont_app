import { ScrollView, StyleSheet, View } from 'react-native'

import ProductComponent from '@screens/components/order-product/Product'
import { useOrderSalesContext } from '@screens/hooks/order-sales/order-context'

const ProductListOrderSales = () => {
  const ctx = useOrderSalesContext()
  return (
    <ScrollView>
      <View style={styles.container}>
        {ctx.products.map((p) => (
          <ProductComponent key={p.id} p={p} scrollEnabled={true} />
        ))}
      </View>
    </ScrollView>
  )
}
export default ProductListOrderSales
const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
})
