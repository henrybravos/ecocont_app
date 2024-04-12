import { useRef, useState } from 'react'
import { Swipeable, TouchableWithoutFeedback } from 'react-native-gesture-handler'
import { Divider, IconButton } from 'react-native-paper'

import Block from '@components/Block'
import Text from '@components/Text'

import { MovementOrder } from '@core/types/order-sales'

import { formatNumber } from '@utils/scripts'

type SwipeProductOrderProps = {
  item: Partial<MovementOrder>
  currency: string
  editCallback: () => void
  deleteCallback: () => void
  onSwipeableOpen: (swipeable: React.RefObject<Swipeable>) => void
}
const SwipeProductOrder = ({
  item,
  currency,
  editCallback,
  deleteCallback,
  onSwipeableOpen,
}: SwipeProductOrderProps) => {
  const swipeRef = useRef<Swipeable>(null)
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
          <IconButton icon="pencil" size={32} iconColor="#fff" onPress={editCallback} />
        </Block>

        <Block
          flex={0}
          style={{ backgroundColor: 'red' }}
          width={50}
          align="center"
          height="100%"
          justify="center"
        >
          <IconButton icon="delete" size={32} iconColor="#fff" onPress={deleteCallback} />
        </Block>
      </Block>
    )
  }
  const toggleOpenDetail = () => setOpenDetail((prev) => !prev)

  const labelDescription =
    item.priceDetail?.name === item.product?.description
      ? item.product?.description
      : `${item.priceDetail?.name} - ${item.product?.description}`
  return (
    <Block>
      <Swipeable
        renderRightActions={renderRightActions}
        ref={swipeRef}
        onSwipeableOpen={() => onSwipeableOpen(swipeRef)}
      >
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
                {labelDescription}
              </Text>
              <Text color="#5c84ff">
                {item.quantity} x {formatNumber(item.unitPrice || 0)}
              </Text>
            </Block>
            <Block flex={0} align="flex-end" justify="center" paddingHorizontal={8}>
              <Text bold h5>
                {formatNumber((item.unitPrice || 0) * (item.quantity || 0))}
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
