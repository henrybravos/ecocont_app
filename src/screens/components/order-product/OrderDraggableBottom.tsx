import { MotiView } from 'moti'
import { FlatList } from 'react-native'
import { Button, Divider } from 'react-native-paper'

import Block from '@components/Block'
import DraggableBottomPanResponder from '@components/DraggableBottomPanResponder'
import Text from '@components/Text'

import QuantityItems from '@screens/components/order-product/QuantityItems'
import SwipeProductOrder from '@screens/components/order-product/SwipeProductOrder'
import { useOrderSalesContext } from '@screens/hooks/order-sales/order-context'

import { MovementOrder } from '@core/types/order-sales'

import { formatNumber } from '@utils/scripts'

type RenderProduct = {
  item: Partial<MovementOrder>
}
const OrderDraggableBottom = () => {
  const ctx = useOrderSalesContext()

  const renderProduct = (currency: string) => (row: RenderProduct) => (
    <SwipeProductOrder item={row.item} currency={currency} />
  )
  return (
    <DraggableBottomPanResponder callbackOpen={ctx.callbackOpenCart}>
      <Block paddingHorizontal={4} style={{ backgroundColor: '#fff' }} marginTop={24}>
        <Block row flex={0} paddingBottom={8} paddingHorizontal={4}>
          <Block flex={1}>
            <QuantityItems quantity={ctx.productOrders.length || 0} />
          </Block>
          <Block flex={0} align="flex-end">
            <Text size={9} bold color="#5c84ff" position="absolute" top={-12}>
              {ctx.order?.currency?.name}
            </Text>
            <Text bold h5>
              {formatNumber(ctx.totalOrder)}
            </Text>
          </Block>
          {ctx.isDisplayButtonConfirm && (
            <MotiView from={{ translateX: 100 }} animate={{ translateX: 0 }}>
              <Block flex={0} width={120}>
                <Block position="absolute" right={0} top={-16}>
                  <Button
                    buttonColor="#5c84ff"
                    elevation={5}
                    mode="elevated"
                    textColor="#fff"
                    onPress={() => {
                      alert('next to implement')
                    }}
                  >
                    Guardar
                  </Button>
                </Block>
              </Block>
            </MotiView>
          )}
        </Block>
        <Divider bold />
        <Divider bold />
        <Block flex={1} center justify="center">
          <FlatList
            data={ctx.productOrders || []}
            contentContainerStyle={{ marginVertical: 4 }}
            renderItem={renderProduct(ctx.order?.currency?.name || '')}
          />
        </Block>
      </Block>
    </DraggableBottomPanResponder>
  )
}
export default OrderDraggableBottom
