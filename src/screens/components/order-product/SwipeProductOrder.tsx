import { useState } from 'react'
import { Swipeable, TouchableWithoutFeedback } from 'react-native-gesture-handler'
import { Divider, Icon } from 'react-native-paper'

import Block from '@components/Block'
import Text from '@components/Text'

import { MovementOrder } from '@core/types/order-sales'

import { formatNumber } from '@utils/scripts'

const SwipeProductOrder = ({ item, currency }: { item: MovementOrder; currency: string }) => {
  const [openDetail, setOpenDetail] = useState(false)
  const renderRightActions = () => {
    return (
      <Block flex={0} row align="center" width={100}>
        <Block
          flex={0}
          style={{ backgroundColor: '#5c84ff' }}
          width={50}
          align="center"
          height="100%"
          justify="center"
        >
          <Icon color="#fff" source="pencil" size={32} />
        </Block>

        <Block
          flex={0}
          style={{ backgroundColor: 'red' }}
          width={50}
          align="center"
          height="100%"
          justify="center"
        >
          <Icon color="#fff" source="delete" size={32} />
        </Block>
      </Block>
    )
  }
  const toggleOpenDetail = () => setOpenDetail((prev) => !prev)
  return (
    <Block>
      <Swipeable renderRightActions={renderRightActions}>
        <TouchableWithoutFeedback onPress={toggleOpenDetail}>
          <Block
            row
            align="flex-end"
            justify="space-between"
            paddingVertical={16}
            style={{ backgroundColor: '#fff' }}
          >
            <Block flex={1} paddingHorizontal={4}>
              <Text align="justify" numberOfLines={openDetail ? undefined : 1}>
                {item.product.description}
              </Text>
              <Text color="#5c84ff">
                {item.quantity} x {item.unitPrice}
              </Text>
            </Block>
            <Block flex={0} align="flex-end" justify="center" paddingHorizontal={8}>
              <Text bold h5>
                {formatNumber(item.unitPrice * item.quantity)}
              </Text>
              <Text color="#5c84ff" size={9} bold>
                {currency}
              </Text>
            </Block>
          </Block>
        </TouchableWithoutFeedback>
      </Swipeable>
      <Divider />
    </Block>
  )
}
export default SwipeProductOrder
