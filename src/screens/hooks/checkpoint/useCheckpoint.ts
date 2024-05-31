import { useNavigation } from '@react-navigation/native'
import { useEffect, useMemo, useState } from 'react'

import { CreateSales, PaymentType, PaymentsTypes } from '@screens/hooks/checkpoint/checkpoint.const'

import { CustomerService, OrderSalesService } from '@core/graphql'
import { MovementOrder } from '@core/types/order-sales'
import { Invoice } from '@core/types/sales'

import useFetchApi from '@hooks/useFetchApi'

import { formatNumber, reduceSumMultiplyArray, strRandom } from '@utils/scripts'

import { SCREENS, StackNavigation } from '@constants/types/navigation'

const useCheckpoint = () => {
  const [payments, setPayments] = useState<typeof PaymentsTypes>({
    ...PaymentsTypes,
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
      pointAttentionId: params?.point?.id || '',
      orderId: order.id,
      salesId: order.sales.id,
      areaId: params?.area?.id || '',
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
    //console.log({ customer })
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
  //console.log(payments)
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
export { useCheckpoint }
