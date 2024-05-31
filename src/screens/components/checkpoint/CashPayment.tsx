import { View } from 'react-native'
import { TextInput } from 'react-native-paper'

import { RadioButtonGroup } from '@components/paper'

type CashPaymentProps = {
  onChangeAmountPayment: (value: string) => void
  payments: {
    CASH: {
      total: string
    }
  }
  checkouts: { label: string; value: string }[]
}
const CashPayment = (props: CashPaymentProps) => {
  const { onChangeAmountPayment, payments, checkouts } = props
  return (
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
  )
}
export { CashPayment }
