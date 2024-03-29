import { useNavigation } from '@react-navigation/native'

import Text from '@components/Text'

import { StackNavigation } from '@constants/types/navigation'

const OrderSales = () => {
  const { getState } = useNavigation<StackNavigation>()
  const state = getState()
  const point = state.routes[state.index].params
  if (!point) return
  return <Text>{point.description}</Text>
}
export default OrderSales
