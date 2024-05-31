import { Divider, Text } from 'react-native-paper'

import Block from '@components/Block'

import { formatNumber } from '@utils/scripts'

type InvoiceTotalsProps = {
  totalOrder: number
  totalCash: number
  totalBank: number
  totalCredit: number
}
const InvoiceTotals = (props: InvoiceTotalsProps) => {
  const { totalOrder, totalCash, totalBank, totalCredit } = props
  return (
    <>
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
    </>
  )
}
export { InvoiceTotals }
