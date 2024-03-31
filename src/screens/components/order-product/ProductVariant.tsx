import { MotiView } from 'moti'
import { useState } from 'react'
import { Dimensions, StyleSheet } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { Icon, Surface } from 'react-native-paper'

import Block from '@components/Block'
import Image from '@components/Image'
import Text from '@components/Text'

import { Product } from '@core/types/product'

import { formatNumber } from '@utils/scripts'

const ITEM_WIDTH_MAX = Dimensions.get('window').width / 3 - 8

const getImageProduct = (uri: string | undefined) => {
  return uri
    ? {
        uri,
      }
    : require('@assets/img/default_product.jpg')
}
const ProductVariantComponent = ({ item }: { item: Product['variants'][0] }) => {
  const [visibleActions, setVisibleActions] = useState(false)
  const toggleVisibleActions = () => {
    setVisibleActions(true)
    setTimeout(() => setVisibleActions(false), 5000)
  }
  const labelVariant = formatNumber(item.price)
  return (
    <Surface key={item.id} elevation={1} style={styles.itemProductContainer}>
      <Image background style={styles.itemProductPrice} source={getImageProduct(item.imageUrl)} />
      <Block position="absolute" top={-2} right={2} left={0} row justify="flex-end" padding={2}>
        {!visibleActions ? (
          <Block flex={0} style={styles.itemProductHeader} center>
            <TouchableOpacity onPress={toggleVisibleActions}>
              <Icon source="plus" size={26} />
            </TouchableOpacity>
          </Block>
        ) : (
          <MotiView
            from={{
              translateX: 30,
            }}
            animate={{
              translateX: 0,
            }}
          >
            <Block flex={0} style={[styles.itemProductHeader]} center row align="center">
              <Icon source="pencil" size={18} />
              <Text paddingLeft={4} align="center">
                1
              </Text>
              <Icon source="plus" size={26} />
            </Block>
          </MotiView>
        )}
      </Block>
      <Block position="absolute" padding={2} bottom={0} row right={0}>
        <Block style={styles.itemProductHeader} paddingHorizontal={4} flex={0} center>
          <Text bold size={12}>
            {labelVariant}
          </Text>
        </Block>
      </Block>
    </Surface>
  )
}
export default ProductVariantComponent

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  itemProductContainer: {
    width: ITEM_WIDTH_MAX - 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#efefef',
    margin: 4,
    padding: 4,
  },
  itemProductPrice: {
    width: ITEM_WIDTH_MAX - 48,
    height: ITEM_WIDTH_MAX - 48,
    resizeMode: 'cover',
  },
  itemProductHeader: {
    backgroundColor: '#fff',
    borderRadius: 4,
    borderWidth: 1,
  },
})
