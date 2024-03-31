import { DimensionValue, FlatList, View } from 'react-native'
import { Surface } from 'react-native-paper'

import Block from '@components/Block'
import Text from '@components/Text'

import ProductVariantComponent from '@screens/components/order-product/ProductVariant'

import { Product } from '@core/types/product'

const COLUMN_MAX = 3
const ITEM_HEIGHT_MIN = 120
const ProductComponent = ({ p, scrollEnabled }: { p: Product; scrollEnabled: boolean }) => {
  const percentage = (100 / COLUMN_MAX) * p.variants.length
  const width = `${percentage > 100 ? 100 : percentage}%` as DimensionValue
  const numVariants = p.variants.length
  const renderProduct = ({ item }: { item: Product['variants'][0] }) => (
    <ProductVariantComponent item={item} product={p} />
  )
  return (
    <View key={p.id} style={{ width }}>
      <Surface
        style={{
          height: ITEM_HEIGHT_MIN,
          margin: 4,
        }}
      >
        <Block>
          <FlatList
            data={p.variants}
            horizontal
            scrollEnabled={scrollEnabled}
            renderItem={renderProduct}
          />
        </Block>
        <Block
          style={{ backgroundColor: '#efefef' }}
          bottom={0}
          right={0}
          left={0}
          padding={4}
          flex={0}
        >
          <Text lineHeight={14} numberOfLines={2} size={11} bold align="center">
            {p.description.toUpperCase()}
            {numVariants > 1 ? ` (${numVariants})` : ''}
          </Text>
        </Block>
      </Surface>
    </View>
  )
}
export default ProductComponent
