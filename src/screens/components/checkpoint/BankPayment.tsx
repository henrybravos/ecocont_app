import { View } from 'react-native'
import { TextInput } from 'react-native-paper'

import { RadioButtonGroup } from '@components/paper'

type BankPaymentProps = {
  onChangeReferenceBank: (value: string) => void
  onChangeAmountBank: (value: string) => void
  banks: { label: string; value: string }[]
  payments: {
    BANK: {
      reference: string
      total: string
    }
  }
}
const BankPayment = (props: BankPaymentProps) => {
  const { onChangeReferenceBank, onChangeAmountBank, payments, banks } = props
  return (
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
  )
}
export { BankPayment }
