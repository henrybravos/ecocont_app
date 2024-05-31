import { useState } from 'react'
import { View } from 'react-native'
import { IconButton, Text, TextInput } from 'react-native-paper'

import { PaymentsTypes } from '@screens/hooks/checkpoint/checkpoint.const'

import { formatNumber } from '@utils/scripts'

const formatDate = (date: string, addDays: number) => {
  const d = new Date(date)
  d.setDate(d.getDate() + addDays)
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`
}
type InstallmentProps = {
  payments: typeof PaymentsTypes
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
export { CreditPayment }
