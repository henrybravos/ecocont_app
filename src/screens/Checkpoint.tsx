import { StatusBar } from 'expo-status-bar'
import { Dimensions, StyleSheet, TouchableHighlight, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import {
  Button,
  Dialog,
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

import { SearchCustomer } from '@screens/components/attention-points/DialogCustomerSearch'
import { BankPayment } from '@screens/components/checkpoint/BankPayment'
import { CashPayment } from '@screens/components/checkpoint/CashPayment'
import { CreditPayment } from '@screens/components/checkpoint/CreditPayment'
import { InvoiceTotals } from '@screens/components/checkpoint/InvoiceTotals'
import PDFViewer from '@screens/components/viewer/PDFViewer'
import { PaymentType, PaymentTypeLabel } from '@screens/hooks/checkpoint/checkpoint.const'
import { useCheckpoint } from '@screens/hooks/checkpoint/useCheckpoint'

import { validateRUC } from '@utils/scripts'

import { COLORS } from '@constants/light'

const height = Dimensions.get('window').height - 100

const optionTypeLabel = Object.keys(PaymentTypeLabel).map((p) => ({
  label: PaymentTypeLabel[p as PaymentType],
  value: p,
}))

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
            <CashPayment
              onChangeAmountPayment={onChangeAmountPayment}
              payments={payments}
              checkouts={checkouts}
            />
          )}
          {isBank && (
            <BankPayment
              onChangeReferenceBank={onChangeReferenceBank}
              onChangeAmountBank={onChangeAmountBank}
              banks={banks}
              payments={payments}
            />
          )}
          {isCredit && (
            <CreditPayment
              payments={payments}
              onCreateInstallment={onCreateInstallment}
              onRemoveInstallment={onRemoveInstallment}
            />
          )}
          <InvoiceTotals
            totalOrder={totalOrder}
            totalBank={totalBank}
            totalCash={totalCash}
            totalCredit={totalCredit}
          />
          <Button
            disabled={
              !isCorrectPayment ||
              isLoadingSaveInvoice ||
              (customerSelected.default && totalOrder >= 700)
            }
            onPress={onCreateSalesB}
            compact
            mode="contained"
            buttonColor={COLORS.primary.toString()}
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
