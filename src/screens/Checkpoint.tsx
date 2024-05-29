import { useNavigation } from '@react-navigation/native'
import { StatusBar } from 'expo-status-bar'
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react'
import {
  Dimensions,
  FlatList,
  StyleSheet,
  TouchableHighlight,
  TouchableWithoutFeedback,
  View,
} from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import {
  Button,
  Checkbox,
  Dialog,
  Divider,
  IconButton,
  Portal,
  ProgressBar,
  Surface,
  Text,
  TextInput,
} from 'react-native-paper'
import { SafeAreaView } from 'react-native-safe-area-context'

import Block from '@components/Block'
import { RadioButtonGroup } from '@components/paper'
import SearchBarComponent from '@components/paper/SearchBar'

import PDFViewer from '@screens/components/viewer/PDFViewer'

import { CustomerService, OrderSalesService } from '@core/graphql'
import { MovementOrder } from '@core/types/order-sales'
import { Invoice } from '@core/types/sales'

import { useFetchApi } from '@hooks/index'

import { formatNumber, reduceSumMultiplyArray, strRandom, validateRUC } from '@utils/scripts'

import { COLORS } from '@constants/light'
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
type DocumentType = '03' | '01' | '99'
type SeriesType = 'N' | 'F' | 'B'
type CreateSales = { documentType: DocumentType; series: SeriesType }
const optionTypeLabel = Object.keys(paymentTypeLabel).map((p) => ({
  label: paymentTypeLabel[p as PaymentType],
  value: p,
}))
const paymentsTypes = {
  [PaymentType.CASH]: {
    total: '-',
  },
  [PaymentType.BANK]: {
    total: '-',
    randomId: '',
    reference: '',
  },
  [PaymentType.CREDIT]: {
    total: '-',
    installments: [] as { date: string; days: number; code: number; amount: string }[],
  },
}
const useCheckpoint = () => {
  const [payments, setPayments] = useState<typeof paymentsTypes>({
    ...paymentsTypes,
    BANK: {
      randomId: strRandom(5), //ni idea xd
      reference: '',
      total: '0',
    },
  })
  const [paymentType, setPaymentType] = useState<PaymentType | undefined>(undefined)
  const [isOpenModalCustomer, setIsOpenModalCustomer] = useState(false)
  const [customerSelected, setCustomerSelected] = useState({
    id: 'b97b197c-a5f1-11ec-9502-00505600d6df',
    label: '88888888 - Cliente Generico',
    value: '88888888',
    default: true,
  })
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
  const [isLoadingOrderSales, order, fetchOrder, _, __] = useFetchApi(OrderSalesService.getOrder)
  const [
    isLoadingCustomer,
    customersResponse,
    fetchCustomerParams,
    errorCustomerParam,
    resetCustomerParams,
  ] = useFetchApi(CustomerService.customerByParams)

  useEffect(() => {
    if (!params?.point || !params?.point.orderId || !params?.checkout?.id) {
      navigate(SCREENS.AREA_SALES)
    } else {
      fetchOrder({
        orderId: params?.point.orderId,
      })
    }
  }, [params])

  const onCreateSales = (createParams: CreateSales) => () => {
    const { documentType, series } = createParams
    if (!order || !order.id || !customerSelected.id) return
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
      checkoutId: params?.checkout?.id || '',
      pointAttentionId: params?.point.id || '',
      orderId: order.id,
      salesId: order.sales.id,
      areaId: params?.point.areaId || '',
    }
    const totalCash = Number(payments.CASH.total)
    const totalBank = Number(payments.BANK.total)
    const totalCredit = Number(payments.CREDIT.total)
    const accountCashInternal = params?.checkout.accounts.find(
      (a) => a.control && a.type === 'CASH' && a.currency.code === order.currency.code,
    )
    const accountBankInternal = params?.checkout.accounts.find(
      (a) => a.control && a.type === 'BANK' && a.currency.code === order.currency.code,
    )
    const accountCash = params?.checkout.accounts.find(
      (a) => !a.control && a.type === 'CASH' && a.currency.code === order.currency.code,
    )
    const accountBank = params?.checkout.accounts.find(
      (a) => !a.control && a.type === 'BANK' && a.currency.code === order.currency.code,
    )

    //Nota de venta debe tener almenos una cuenta interna (efectivo o banco)
    if (documentType === '99') {
      if ((totalCash > 0 && !accountCashInternal) || (totalBank > 0 && !accountBankInternal)) {
        alert('Debe tener una cuenta para control interno')
        return
      }
    }
    const cashPaymentDetail = {
      amount: totalCash,
      cf: accountCash?.id || '',
      pcgeId: accountCash?.pcge.id || '',
    }
    const cardPaymentDetail =
      totalBank > 0
        ? {
            amount: `${totalBank}`,
            cf: accountBank?.id || '',
            pcgeId: accountBank?.pcge.id || '',
            reference: payments.BANK.reference,
            account: accountBank?.description || '',
            id: payments.BANK.randomId,
          }
        : undefined
    const creditPaymentDetail =
      totalCredit > 0
        ? payments.CREDIT.installments.map((i) => ({
            amount: i.amount,
            code: `${i.code}`,
            date: i.date,
            id: strRandom(8),
            invalid: false, //NI IDEA
          })) || []
        : []
    const invoice: Invoice = {
      additionalInformation: '',
      currencyType: order?.currency.code || 'PEN',
      customer: customerSelected,
      documentType,
      dueDate: null,
      law_31556: false,
      number: '#',
      series,
      purchaseOrder: '',
      operationType: '0101',
      extraData,
      items,
      totals: {
        cashPayment: totalCash,
        cashPaymentDetail,
        cardPayment: totalBank,
        cardPaymentDetail,
        creditAmount: totalCredit,
        creditPaymentDetail,
      },
    }
    fetchSaveInvoice({
      invoice,
      orderId: order.id,
    })
  }
  const onChangePaymentType = (value: string) => setPaymentType(value as PaymentType)
  const onChangeAmountPayment = (value: string) => {
    setPayments({
      ...payments,
      [PaymentType.CASH]: {
        ...payments[PaymentType.CASH],
        total: value,
      },
    })
  }
  const onChangeAmountBank = (value: string) => {
    setPayments({
      ...payments,
      [PaymentType.BANK]: {
        ...payments[PaymentType.BANK],
        total: value,
      },
    })
  }
  const onChangeReferenceBank = (value: string) => {
    setPayments({
      ...payments,
      [PaymentType.BANK]: {
        ...payments[PaymentType.BANK],
        reference: value,
      },
    })
  }
  const onCreateInstallment = ({
    amount,
    date,
    days,
  }: {
    amount: string
    days: number
    date: string
  }) => {
    const total = isNaN(Number(payments.CREDIT.total)) ? 0 : Number(payments.CREDIT.total)
    setPayments({
      ...payments,
      CREDIT: {
        ...payments.CREDIT,
        total: formatNumber(total + Number(amount)),
        installments: [
          ...payments.CREDIT.installments,
          {
            date,
            days: Number(days),
            amount,
            code: payments.CREDIT.installments.length + 1,
          },
        ],
      },
    })
  }
  const onRemoveInstallment = (index: number) => {
    setPayments({
      ...payments,
      CREDIT: {
        ...payments.CREDIT,
        total: formatNumber(
          Number(payments.CREDIT.total) - Number(payments.CREDIT.installments[index].amount),
        ),
        installments: payments.CREDIT.installments.filter((_, i) => i !== index),
      },
    })
  }
  const onCloseModalInvoice = () => {
    resetSaveInvoice()
    navigate(SCREENS.AREA_SALES)
  }
  const onChangeCustomer = (customer: { label: string; value: string; code: string }) => {
    console.log({ customer })
    setCustomerSelected({
      id: customer.value,
      label: customer.label,
      value: customer.code,
      default: false,
    })
  }
  const handleModalCustomer = () => setIsOpenModalCustomer(!isOpenModalCustomer)
  const onFetchCustomer = (param: string) => {
    fetchCustomerParams({
      param,
    })
  }
  const totalOrder = useMemo(
    () => reduceSumMultiplyArray(order?.movementOrder || [], 'unitPrice', 'quantity', 0),
    [order?.movementOrder],
  )
  useEffect(() => {
    if (paymentType === PaymentType.CASH && payments.CASH.total === '-') {
      setPayments({
        ...payments,
        CASH: {
          total: formatNumber(totalOrder),
        },
      })
    }
    if (paymentType === PaymentType.BANK && payments.BANK.total === '-') {
      setPayments({
        ...payments,
        BANK: {
          total: formatNumber(totalOrder),
          randomId: strRandom(5),
          reference: '',
        },
      })
    }
  }, [paymentType, totalOrder, payments])
  console.log(payments)
  return {
    totalOrder,
    payments,
    paymentType,
    customerSelected,
    isLoadingSaveInvoice,
    isLoadingOrderSales,
    isLoadingCustomer,
    isOpenModalCustomer,
    resetCustomerParams,
    errorCustomerParam,

    errorSaveUpdate,

    onCreateSalesB: onCreateSales({
      documentType: '03',
      series: 'B',
    }),
    onCreateSalesF: onCreateSales({
      documentType: '01',
      series: 'F',
    }),
    onCreateSalesN: onCreateSales({
      documentType: '99',
      series: 'N',
    }),
    onChangePaymentType,
    onCloseModalInvoice,
    onChangeAmountPayment,
    onFetchCustomer,
    onChangeCustomer,
    onChangeAmountBank,
    onChangeReferenceBank,
    onCreateInstallment,
    onRemoveInstallment,

    handleModalCustomer,

    point: params?.point,
    checkpoint: params?.checkout,
    urlInvoice: invoiceResponse?.url,
    isCash: paymentType === PaymentType.CASH,
    isBank: paymentType === PaymentType.BANK,
    isCredit: paymentType === PaymentType.CREDIT,
    customersResponse: customersResponse || [],
  }
}
type SearchCustomerProps = {
  onFetchCustomer: (param: string) => void
  resetCustomers: () => void
  onSelectCustomer: (customer: { label: string; value: string; code: string }) => void
  onCloseSearch: () => void
  isLoadingCustomer: boolean
  customersResponse: { label: string; value: string; code: string }[]
  visible: boolean
}
const SearchCustomer = ({
  customersResponse,
  isLoadingCustomer,
  resetCustomers,
  onFetchCustomer,
  onSelectCustomer,
  onCloseSearch,
  visible,
}: SearchCustomerProps) => {
  const onSelectCustomerItem = (item: { value: string; label: string; code: string }) => {
    onSelectCustomer(item)
    onCloseSearch()
    resetCustomers()
  }
  return (
    <Portal>
      <Dialog onDismiss={onCloseSearch} visible={visible} dismissable={false}>
        <Dialog.Content>
          <SearchBarComponent
            clearButtonMode="always"
            onClearIconPress={resetCustomers}
            onConfirmSearch={onFetchCustomer}
            elevation={0}
            autoFocus
          />
          <ProgressBar indeterminate visible={isLoadingCustomer} />
          <Text style={{ fontSize: 10 }}>Se muestran los 5 primeros resultados</Text>
          <FlatList
            data={customersResponse.slice(0, 5)}
            renderItem={({ item }) => (
              <TouchableWithoutFeedback onPress={() => onSelectCustomerItem(item)}>
                <Surface
                  elevation={1}
                  style={{ marginVertical: 2, paddingHorizontal: 2, flexDirection: 'row' }}
                >
                  <Checkbox status="unchecked" />
                  <Text>{item.label}</Text>
                </Surface>
              </TouchableWithoutFeedback>
            )}
          />
        </Dialog.Content>
        <Button
          style={{ margin: 16 }}
          compact
          buttonColor="grey"
          mode="contained"
          onPress={onCloseSearch}
        >
          OK
        </Button>
      </Dialog>
    </Portal>
  )
}
const formatDate = (date: string, addDays: number) => {
  const d = new Date(date)
  d.setDate(d.getDate() + addDays)
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`
}
type InstallmentProps = {
  payments: typeof paymentsTypes
  onCreateInstallment: (installment: { amount: string; days: number; date: string }) => void
  onRemoveInstallment: (index: number) => void
}
const CreditPayment = (props: InstallmentProps) => {
  const { payments, onCreateInstallment, onRemoveInstallment } = props
  const [amount, setAmount] = useState(' ')
  const [days, setDays] = useState('30')
  const installments = payments.CREDIT.installments
  const date = formatDate(
    installments.length > 0 ? installments[installments.length - 1].date : new Date().toString(),
    Number(days),
  )

  const addInstallment = () => onCreateInstallment({ amount, days: Number(days), date })
  const removeInstallment = (index: number) => () => onRemoveInstallment(index)
  return (
    <View>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TextInput
          style={{ flex: 1 }}
          label={`Cuota ${installments.length + 1}`}
          mode="outlined"
          onChangeText={setAmount}
          value={amount}
          autoFocus
          dense
        />
        <TextInput label="Días" mode="outlined" onChangeText={setDays} value={days} dense />
        <TextInput
          style={{ flex: 1 }}
          disabled
          label="Fecha pago"
          mode="outlined"
          value={date}
          dense
        />
        <IconButton
          icon="plus"
          disabled={
            Number(amount) <= 0 ||
            Number(days) <= 0 ||
            Number.isNaN(Number(amount)) ||
            Number.isNaN(Number(days))
          }
          mode="contained"
          onPress={addInstallment}
        />
      </View>
      <Text style={{ marginTop: 8 }}>Cuotas ({installments.length})</Text>
      {installments.map((i, index) => (
        <View key={i.date} style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TextInput
            style={{ flex: 1 }}
            label={`Cuota ${index + 1}`}
            mode="outlined"
            value={formatNumber(Number(i.amount))}
            disabled
            dense
          />
          <TextInput disabled label="Días" mode="outlined" value={i.days.toString()} dense />
          <TextInput
            style={{ flex: 1 }}
            disabled
            label="Fecha pago"
            mode="outlined"
            value={i.date}
            dense
          />
          <View style={{ width: 50 }}>
            {index === installments.length - 1 && (
              <IconButton iconColor="red" icon="delete" onPress={removeInstallment(index)} />
            )}
          </View>
        </View>
      ))}
    </View>
  )
}
const CheckpointScreen = () => {
  const {
    point,
    customerSelected,
    checkpoint,
    payments,

    isCash,
    isBank,
    isCredit,
    isLoadingOrderSales,
    isLoadingSaveInvoice,
    isLoadingCustomer,
    isOpenModalCustomer,

    errorSaveUpdate,
    paymentType,
    totalOrder,
    urlInvoice,
    customersResponse,
    onCreateSalesB,
    onCreateSalesF,
    onCreateSalesN,
    onCloseModalInvoice,
    onChangePaymentType,
    onChangeAmountPayment,
    onChangeAmountBank,
    onChangeReferenceBank,
    onFetchCustomer,
    onCreateInstallment,
    onRemoveInstallment,
    resetCustomerParams,
    onChangeCustomer,
    handleModalCustomer,
  } = useCheckpoint()
  const checkouts = [
    {
      label: checkpoint?.description || '',
      value: checkpoint?.id || '',
    },
  ]
  const banks = [
    {
      label: checkpoint?.accounts.find((a) => !a.control && a.type === 'BANK')?.description || '',
      value: checkpoint?.accounts.find((a) => !a.control && a.type === 'BANK')?.id || '',
    },
  ]
  if (!point || !checkouts.length) return <ProgressBar indeterminate visible />
  const totalCash = isNaN(Number(payments.CASH.total)) ? 0 : Number(payments.CASH.total)
  const totalBank = isNaN(Number(payments.BANK.total)) ? 0 : Number(payments.BANK.total)
  const totalCredit = isNaN(Number(payments.CREDIT.total)) ? 0 : Number(payments.CREDIT.total)
  const totalPayment = totalCash + totalBank + totalCredit
  const isCorrectPayment = totalPayment >= totalOrder || totalOrder === 0
  return (
    <ScrollView>
      <SafeAreaView>
        <StatusBar style="dark" />
        <ProgressBar indeterminate visible={isLoadingOrderSales || isLoadingSaveInvoice} />
        <Surface style={styles.container}>
          {errorSaveUpdate && (
            <Block>
              <Text>Error al crear la boleta</Text>
              <IconButton icon="close" onPress={onCloseModalInvoice} />
            </Block>
          )}
          <TouchableHighlight onPress={handleModalCustomer}>
            <TextInput
              label="Documento del cliente"
              mode="outlined"
              value={customerSelected.label}
              editable={false}
              dense
            />
          </TouchableHighlight>
          <RadioButtonGroup
            items={optionTypeLabel}
            label="Método de pago"
            value={paymentType as PaymentType}
            onValueChange={onChangePaymentType}
          />
          {isCash && (
            <View style={{ flexDirection: 'row' }}>
              <View style={{ flex: 1 }}>
                {checkouts.length > 0 && (
                  <RadioButtonGroup
                    items={checkouts}
                    value={checkouts[0].value}
                    label="Caja"
                    onValueChange={() => {}}
                  />
                )}
              </View>
              <View style={{ flex: 1, bottom: 2, top: -4 }}>
                <TextInput
                  label="Monto"
                  mode="outlined"
                  onChangeText={onChangeAmountPayment}
                  value={payments.CASH.total}
                />
              </View>
            </View>
          )}
          {isBank && (
            <View style={{ flexDirection: 'row' }}>
              <View style={{ flex: 1 }}>
                {banks.length > 0 && (
                  <RadioButtonGroup
                    items={banks}
                    value={banks[0].value}
                    label="Banco"
                    onValueChange={() => {}}
                  />
                )}
              </View>
              <View style={{ flex: 1, bottom: 2, top: -4 }}>
                <TextInput
                  label="Referencia"
                  mode="outlined"
                  onChangeText={onChangeReferenceBank}
                  value={payments.BANK.reference}
                />
              </View>
              <View style={{ flex: 1, bottom: 2, top: -4 }}>
                <TextInput
                  label="Monto"
                  mode="outlined"
                  onChangeText={onChangeAmountBank}
                  value={payments.BANK.total}
                />
              </View>
            </View>
          )}
          {isCredit && (
            <CreditPayment
              payments={payments}
              onCreateInstallment={onCreateInstallment}
              onRemoveInstallment={onRemoveInstallment}
            />
          )}
          <Block flex={0} row justify="space-between" align="center">
            <Text variant="titleMedium">TOTAL A PAGAR:</Text>
            <Text variant="headlineMedium">s/ {totalOrder}</Text>
          </Block>
          <Divider />
          <Block flex={0} row justify="space-between" align="center">
            <Text variant="titleMedium">TOTAL EFECTIVO:</Text>
            <Text variant="headlineMedium">s/ {formatNumber(totalCash)}</Text>
          </Block>
          <Divider />
          <Block flex={0} row justify="space-between" align="center">
            <Text variant="titleMedium">TOTAL TARJETAS:</Text>
            <Text variant="headlineMedium">s/ {formatNumber(totalBank)}</Text>
          </Block>
          <Divider />
          <Block flex={0} row justify="space-between" align="center">
            <Text variant="titleMedium">TOTAL AL CRÉDITO:</Text>
            <Text variant="headlineMedium">s/ {formatNumber(totalCredit)}</Text>
          </Block>
          <Divider />
          <Block flex={0} row justify="space-between" align="center">
            <Text variant="titleMedium">VUELTO:</Text>
            <Text variant="headlineMedium">
              s/
              {formatNumber(totalCash + totalBank + totalCredit - totalOrder)}
            </Text>
          </Block>
          <Divider />
          <Button
            disabled={
              !isCorrectPayment ||
              isLoadingSaveInvoice ||
              (customerSelected.default && totalOrder >= 700)
            }
            onPress={onCreateSalesB}
            compact
            mode="contained"
          >
            CREAR BOLETA
          </Button>
          <Button
            disabled={
              !isCorrectPayment ||
              isLoadingSaveInvoice ||
              customerSelected.default ||
              !validateRUC(customerSelected.value).success
            }
            onPress={onCreateSalesF}
            compact
            mode="contained"
            buttonColor={COLORS.info.toString()}
          >
            CREAR FACTURA
          </Button>
          <Button
            disabled={!isCorrectPayment || isLoadingSaveInvoice}
            onPress={onCreateSalesN}
            compact
            mode="contained"
            buttonColor={COLORS.success.toString()}
          >
            CREAR NOTA DE VENTA
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
              style={styles.closeModal}
              size={24}
              icon="close"
              onPress={onCloseModalInvoice}
            />
          </Dialog>
        </Portal>
        <SearchCustomer
          onFetchCustomer={onFetchCustomer}
          isLoadingCustomer={isLoadingCustomer}
          customersResponse={customersResponse}
          resetCustomers={resetCustomerParams}
          onSelectCustomer={onChangeCustomer}
          onCloseSearch={handleModalCustomer}
          visible={isOpenModalCustomer}
        />
      </SafeAreaView>
    </ScrollView>
  )
}
const styles = StyleSheet.create({
  container: {
    padding: 8,
    gap: 8,
  },
  closeModal: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderRadius: 32,
    justifyContent: 'center',
    alignContent: 'center',
    top: 0,
    right: 0,
  },
})
export default CheckpointScreen
