import { MotiView } from 'moti'
import { useEffect, useState } from 'react'
import { Dimensions, StyleSheet } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { Icon, IconButton, Surface } from 'react-native-paper'

import Block from '@components/Block'
import Image from '@components/Image'
import Text from '@components/Text'

import { useOrderSalesContext } from '@screens/hooks/order-sales/order-context'

import { Product } from '@core/types/product'

import { formatNumber } from '@utils/scripts'

export const ITEM_PRODUCT_WIDTH_MAX = Dimensions.get('window').width / 3 - 8

const getImageProduct = (uri: string | undefined) => {
  return uri
    ? {
        uri,
      }
    : require('@assets/img/default_product.jpg')
}
type ProductVariantComponentProps = {
  item: Product['variants'][0]
  product: Product
}
const ProductVariantComponent = ({ item, product }: ProductVariantComponentProps) => {
  const ctx = useOrderSalesContext()
  const [visibleActions, setVisibleActions] = useState(false)
  const productOrder = ctx.handleExistInCart(item.id)
  const quantityOrder = productOrder?.quantity || 0
  useEffect(() => {
    let timeout: NodeJS.Timeout
    if (visibleActions) {
      timeout = setTimeout(() => setVisibleActions(false), 5000)
    }
    return () => {
      clearTimeout(timeout)
    }
  }, [visibleActions, quantityOrder])
  const toggleVisibleActions = () => {
    setVisibleActions(true)
  }
  const updateOrPushToCart = () => {
    toggleVisibleActions()
    ctx.handleUpdateProductToCart(
      {
        id: item.id,
        name: item.name,
      },
      product,
      quantityOrder + 1,
      item.price,
    )
  }
  const removeOrDecreaseToCart = () => {
    toggleVisibleActions()
    ctx.handleRemoveProductFromCart(item.id, 1)
    if (quantityOrder - 1 <= 0) {
      setVisibleActions(false)
    }
  }

  const labelVariant = formatNumber(item.price)
  return (
    <Surface key={item.id} elevation={1} style={styles.itemProductContainer}>
      <Image background style={styles.itemProductPrice} source={getImageProduct(item.imageUrl)} />
      <Block position="absolute" top={-2} right={2} left={0} row justify="flex-end" padding={2}>
        {!visibleActions ? (
          <Block flex={0} style={styles.itemProductHeader} center>
            {productOrder ? (
              <TouchableOpacity onPress={toggleVisibleActions}>
                <Block height={24} width={24} black center align="center">
                  <Text white bold>
                    {productOrder.quantity}
                  </Text>
                </Block>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={updateOrPushToCart}>
                <Icon source="plus" size={26} />
              </TouchableOpacity>
            )}
          </Block>
        ) : (
          <MotiView
            from={{
              opacity: 0,
              scale: 0.2,
              translateX: 80,
              translateY: -8,
            }}
            animate={{
              scale: 1,
              opacity: 1,
              translateX: 0,
              translateY: 0,
            }}
            transition={{
              type: 'timing',
              duration: 500,
            }}
          >
            <Block flex={0} style={[styles.itemProductHeader]} center row align="center">
              <IconButton
                onPress={ctx.handleProductSelected('edit', productOrder)}
                mode="outlined"
                icon="pencil"
                size={12}
                style={styles.iconAction}
              />
              <IconButton
                onPress={removeOrDecreaseToCart}
                mode="outlined"
                icon={quantityOrder > 1 ? 'minus' : 'delete'}
                size={12}
                style={styles.iconAction}
              />
              <Text align="center">{quantityOrder || ''}</Text>
              <IconButton
                onPress={updateOrPushToCart}
                mode="outlined"
                icon="plus"
                size={12}
                style={styles.iconAction}
              />
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
    width: ITEM_PRODUCT_WIDTH_MAX - 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#efefef',
    margin: 4,
    padding: 4,
  },
  itemProductPrice: {
    width: ITEM_PRODUCT_WIDTH_MAX - 48,
    height: ITEM_PRODUCT_WIDTH_MAX - 48,
    resizeMode: 'cover',
  },
  itemProductHeader: {
    backgroundColor: '#fff',
    borderRadius: 4,
    borderWidth: 1,
  },
  iconAction: { margin: 2, marginHorizontal: 4 },
})
