import { MotiView } from 'moti'
import { Dispatch, SetStateAction, useMemo } from 'react'
import { FlatList } from 'react-native'
import { Button, Divider } from 'react-native-paper'

import Block from '@components/Block'
import DraggableBottomPanResponder from '@components/DraggableBottomPanResponder'
import Text from '@components/Text'

import QuantityItems from '@screens/components/order-product/QuantityItems'
import SwipeProductOrder from '@screens/components/order-product/SwipeProductOrder'

import { MovementOrder, OrderSales } from '@core/types/order-sales'

import { formatNumber, reduceSumMultiplyArray } from '@utils/scripts'

type OrderDraggableBottomProps = {
  order: Partial<OrderSales>
  callbackReleasePan: () => void
  callbackStartPan: () => void
}
type RenderProduct = {
  item: MovementOrder
}
const OrderDraggableBottom = ({
  order,
  callbackReleasePan,
  callbackStartPan,
}: OrderDraggableBottomProps) => {
  const renderProduct = (currency: string) => (row: RenderProduct) => (
    <SwipeProductOrder item={row.item} currency={currency} />
  )
  const totalAccount = useMemo(
    () => reduceSumMultiplyArray(order?.movementOrder || [], 'unitPrice', 'quantity', 0),
    [order?.movementOrder],
  )
  return (
    <DraggableBottomPanResponder
      callbackReleasePan={callbackReleasePan}
      callbackStartPan={callbackStartPan}
    >
      <Block paddingHorizontal={4} style={{ backgroundColor: '#fff' }} marginTop={32}>
        <Block row flex={0} paddingBottom={8}>
          <Block flex={1}>
            <QuantityItems quantity={order?.movementOrder?.length || 0} />
          </Block>
          <Block flex={0} align="flex-end">
            <Text size={9} bold color="#5c84ff" position="absolute" top={-12}>
              {order?.currency?.name}
            </Text>
            <Text bold h5>
              {formatNumber(totalAccount)}
            </Text>
          </Block>
          {false && (
            <MotiView from={{ translateX: 100 }} animate={{ translateX: 0 }}>
              <Block flex={0} width={120}>
                <Block position="absolute" right={0} top={-16}>
                  <Button elevation={5} mode="elevated" textColor="#011c33" onPress={() => {}}>
                    Guardar
                  </Button>
                </Block>
              </Block>
            </MotiView>
          )}
        </Block>
        <Divider />
        <Block flex={1} center justify="center">
          <FlatList
            data={order?.movementOrder || []}
            contentContainerStyle={{ marginVertical: 4 }}
            renderItem={renderProduct(order?.currency?.name || '')}
          />
        </Block>
      </Block>
    </DraggableBottomPanResponder>
  )
}
export default OrderDraggableBottom
