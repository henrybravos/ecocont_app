import { useNavigation } from '@react-navigation/native'
import { StatusBar } from 'expo-status-bar'
import { Fragment, useEffect, useMemo, useState } from 'react'
import { Dimensions, View } from 'react-native'
import {
  Button,
  Dialog,
  Divider,
  IconButton,
  PaperProvider,
  Portal,
  ProgressBar,
  Surface,
  Text,
  TextInput,
} from 'react-native-paper'
import { SafeAreaView } from 'react-native-safe-area-context'

import Block from '@components/Block'
import { RadioButtonGroup } from '@components/paper'

import PDFViewer from '@screens/components/viewer/PDFViewer'

import { OrderSalesService } from '@core/graphql'
import { MovementOrder } from '@core/types/order-sales'
import { Invoice } from '@core/types/sales'

import { useFetchApi } from '@hooks/index'

import { reduceSumMultiplyArray } from '@utils/scripts'

import { SCREENS, StackNavigation } from '@constants/types/navigation'

const height = Dimensions.get('window').height - 100
enum PaymentType {
  BANK = 'BANK',
  CASH = 'CASH',
  CREDIT = 'CREDIT',
}
const paymentTypeLabel = {
  [PaymentType.CASH]: 'Efectivo',
  [PaymentType.BANK]: 'Cuentas B.',
  [PaymentType.CREDIT]: 'OP al crédito',
}
const optionTypeLabel = Object.keys(paymentTypeLabel).map((p) => ({
  label: paymentTypeLabel[p as PaymentType],
  value: p,
}))
const optionCheckoutLabel = [{ label: 'Caja 1', value: '1' }]
const CheckpointScreen = () => {
  const [paymentType, setPaymentType] = useState(PaymentType.CASH)
  const { getState, navigate } = useNavigation<StackNavigation>()

  const state = getState()
  const params = state.routes[state.index].params
  const [
    isLoadingSaveInvoice,
    invoiceResponse,
    fetchSaveInvoice,
    errorSaveUpdate,
    resetSaveInvoice,
  ] = useFetchApi(OrderSalesService.saveInvoice)
  const urlInvoice = invoiceResponse?.url
  const [isLoadingOrderSales, order, fetchOrder, _, __] = useFetchApi(
    OrderSalesService.getDetailUserActive,
  )

  useEffect(() => {
    if (!params?.point || !params?.point.orderId || !params?.checkout?.id) {
      navigate(SCREENS.AREA_SALES)
    } else {
      fetchOrder({
        orderId: params?.point.orderId,
      })
    }
  }, [params])
  const totalOrder = useMemo(
    () => reduceSumMultiplyArray(order?.movementOrder || [], 'unitPrice', 'quantity', 0),
    [order?.movementOrder],
  )
  if (!params?.point) return <ProgressBar indeterminate visible />
  const createSales = () => {
    const itemsOlder = order?.movementOrder || []
    const itemsNew = order?.movementOrder
    const items: { old: MovementOrder; new: MovementOrder }[] = itemsNew.map((item) => {
      const itemOld = itemsOlder.find((i) => i.priceDetail?.id === item.priceDetail?.id)
      return {
        old: (itemOld || { ...item }) as MovementOrder,
        new: item as MovementOrder,
      }
    })
    const extraData = {
      checkoutId: params.checkout?.id || '',
      pointAttentionId: params?.point.id,
      orderId: order?.id,
      salesId: order?.sales.id,
      areaId: params?.point.areaId,
    }
    const invoice: Invoice = {
      additionalInformation: '',
      currencyType: order?.currency.code || 'PEN',
      customer: {
        id: 'b97b197c-a5f1-11ec-9502-00505600d6df',
      },
      documentType: '03',
      dueDate: null,
      law_31556: false,
      number: '#',
      series: 'B',
      purchaseOrder: '',
      operationType: '0101',
      extraData,
      items,
    }
    fetchSaveInvoice({
      invoice,
      orderId: order?.id || '',
    })
  }
  const onChangePaymentType = (value: string) => setPaymentType(PaymentType.CASH)
  const onCloseModalInvoice = () => {
    resetSaveInvoice()
    navigate(SCREENS.AREA_SALES)
  }
  const isCash = paymentType === PaymentType.CASH
  return (
    <SafeAreaView>
      <StatusBar style="dark" />
      <ProgressBar indeterminate visible={isLoadingOrderSales || isLoadingSaveInvoice} />
      <Surface
        style={{
          padding: 8,
          gap: 8,
        }}
      >
        {errorSaveUpdate && (
          <Block>
            <Text>Error al crear la boleta</Text>
            <IconButton icon="close" onPress={onCloseModalInvoice} />
          </Block>
        )}
        <TextInput label="Documento del cliente" mode="outlined" value="88888888" dense />
        <RadioButtonGroup
          items={optionTypeLabel}
          label="Método de pago"
          value={paymentType}
          onValueChange={onChangePaymentType}
        />
        {isCash && (
          <>
            <RadioButtonGroup
              items={optionCheckoutLabel}
              value={'1'}
              label="Caja"
              onValueChange={(type) => {}}
            />
            <TextInput label="Monto" mode="outlined" value={totalOrder.toString()} dense />
          </>
        )}

        <Block flex={0} row justify="space-between" align="center">
          <Text variant="titleMedium">TOTAL A PAGAR:</Text>
          <Text variant="headlineMedium">s/ {totalOrder}</Text>
        </Block>
        <Divider />
        <Block flex={0} row justify="space-between" align="center">
          <Text variant="titleMedium">TOTAL EFECTIVO:</Text>
          <Text variant="headlineMedium">s/ {totalOrder}</Text>
        </Block>
        <Divider />
        <Block flex={0} row justify="space-between" align="center">
          <Text variant="titleMedium">TOTAL TARJETAS:</Text>
          <Text variant="headlineMedium">s/ 0.00</Text>
        </Block>
        <Divider />
        <Block flex={0} row justify="space-between" align="center">
          <Text variant="titleMedium">TOTAL AL CRÉDITO:</Text>
          <Text variant="headlineMedium">s/ 0.00</Text>
        </Block>
        <Divider />
        <Block flex={0} row justify="space-between" align="center">
          <Text variant="titleMedium">VUELTO:</Text>
          <Text variant="headlineMedium">s/ 0.00</Text>
        </Block>
        <Divider />
        <Button disabled={isLoadingSaveInvoice} onPress={createSales} compact mode="contained">
          CREAR BOLETA
        </Button>
      </Surface>
      <Portal>
        <Dialog visible={!!urlInvoice} onDismiss={onCloseModalInvoice}>
          <View
            style={{
              height,
            }}
          >
            <PDFViewer uri={urlInvoice || ''} />
          </View>
          <IconButton
            style={{
              position: 'absolute',
              width: 32,
              height: 32,
              borderRadius: 32,
              justifyContent: 'center',
              alignContent: 'center',
              top: 0,
              right: 0,
            }}
            size={24}
            icon="close"
            onPress={onCloseModalInvoice}
          />
        </Dialog>
      </Portal>
    </SafeAreaView>
  )
}
export default CheckpointScreen
