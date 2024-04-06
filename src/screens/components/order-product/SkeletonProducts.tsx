import { MotiView } from 'moti'
import { Skeleton } from 'moti/skeleton'
import { StyleSheet, View } from 'react-native'
import { FlatList } from 'react-native-gesture-handler'

import { ITEM_PRODUCT_WIDTH_MAX } from '@screens/components/order-product/ProductVariant'

import useTheme from '@hooks/useTheme'

const Spacer = ({ height = 16 }) => <MotiView style={{ height }} />
export default function SkeletonProducts() {
  const theme = useTheme()
  return (
    <MotiView
      transition={{
        type: 'timing',
      }}
      style={[styles.container, styles.padded]}
    >
      <FlatList
        data={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]}
        numColumns={3}
        columnWrapperStyle={{
          flex: 1,
          justifyContent: 'space-around',
        }}
        renderItem={({ item }) => (
          <View
            style={{
              flexGrow: 0,
              flexShrink: 1,
              flexBasis: '33%',
              height: ITEM_PRODUCT_WIDTH_MAX,
              margin: 4,
            }}
            key={item}
          >
            <Skeleton colorMode="light" radius={8} height={ITEM_PRODUCT_WIDTH_MAX} width={'100%'} />
            <Spacer />
          </View>
        )}
      />
    </MotiView>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  padded: {},
})
