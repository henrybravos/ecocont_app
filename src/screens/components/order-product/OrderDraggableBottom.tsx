import { useNavigation } from '@react-navigation/native'
import { MotiView } from 'moti'
import { ScrollView } from 'react-native-gesture-handler'
import { Button, ButtonProps, Divider, ProgressBar, Snackbar } from 'react-native-paper'

import Block from '@components/Block'
import DraggableBottomPanResponder from '@components/DraggableBottomPanResponder'
import Text from '@components/Text'
import { AnimatedText } from '@components/animated'

import SwipeProductOrder from '@screens/components/order-product/SwipeProductOrder'
import { useOrderSalesContext } from '@screens/hooks/order-sales/useOrderSalesContext'

import { AttentionPoint } from '@core/types/user'

import { formatNumber } from '@utils/scripts'

import { SCREENS, StackNavigation } from '@constants/types/navigation'

type OrderSaveConfirmButtonProps = Omit<ButtonProps, 'children'> & {}
const OrderSaveConfirmButton = (buttonProps: OrderSaveConfirmButtonProps) => {
  return (
    <MotiView from={{ translateX: 100 }} animate={{ translateX: 0 }}>
      <Block flex={0} width={120}>
        <Block position="absolute" right={0} top={-16}>
          <Button {...buttonProps}>Guardar</Button>
        </Block>
      </Block>
    </MotiView>
  )
}
const HeaderCartShopping = () => {
  const ctx = useOrderSalesContext()
  return (
    <Block row flex={0} paddingBottom={8} paddingHorizontal={4}>
      <Block row flex={1}>
        <Text bold>( </Text>
        <AnimatedText label={`${ctx.productOrders.length || 0}`} />
        <Text bold> ) en lista</Text>
      </Block>
      <Block flex={0} align="flex-end">
        <Text size={9} bold color="#5c84ff" position="absolute" top={-12}>
          {ctx.order?.currency?.name}
        </Text>
        <AnimatedText label={formatNumber(ctx.totalOrder)} />
      </Block>
      {ctx.isDisplayButtonConfirm && !ctx.isLoadingOrderSales && !ctx.isLoadingSaveInvoice && (
        <OrderSaveConfirmButton
          buttonColor="#5c84ff"
          elevation={5}
          mode="elevated"
          textColor="#fff"
          onPress={ctx.createOrUpdateOrder}
        />
      )}
    </Block>
  )
}
const ProductListCartShopping = () => {
  const ctx = useOrderSalesContext()
  return (
    <Block flex={1}>
      <ScrollView>
        {ctx.productOrders.map((p) => (
          <SwipeProductOrder
            key={p.priceDetail?.id}
            item={p}
            currency={ctx.order?.currency?.name || ''}
            deleteCallback={ctx.handleProductSelected('delete', p)}
            editCallback={ctx.handleProductSelected('edit', p)}
            onSwipeableOpen={ctx.handleOpenProductCartActions}
          />
        ))}
      </ScrollView>
    </Block>
  )
}

const OrderDraggableBottom = () => {
  const ctx = useOrderSalesContext()
  const navigation = useNavigation<StackNavigation>()
  const navigateToCheckpoint = () => {
    if (ctx.point.orderId && ctx.checkout?.id)
      navigation.navigate(SCREENS.CHECKPOINT, {
        point: ctx.point as AttentionPoint,
        checkout: ctx.checkout,
        area: ctx.area,
      })
  }
  return (
    <DraggableBottomPanResponder>
      <Block paddingHorizontal={4} style={{ backgroundColor: '#fff' }} marginTop={24}>
        {ctx.isLoadingOrderSales && <ProgressBar indeterminate />}
        {ctx.isLoadingSaveInvoice && <ProgressBar indeterminate />}
        <HeaderCartShopping />
        <Divider bold />
        <Divider bold />
        <ProductListCartShopping />
        {ctx.order?.movementOrder.length > 0 && ctx.checkout?.id && (
          <Button onPress={navigateToCheckpoint} mode="contained" compact>
            COBRAR
          </Button>
        )}
      </Block>
    </DraggableBottomPanResponder>
  )
}
export default OrderDraggableBottom
