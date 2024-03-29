import { NavigationProp } from '@react-navigation/native'

import { AttentionPoint } from '@core/types/user'

export enum SCREENS {
  LOGIN = 'Login',
  AREA_SALES = 'AreaSales',
  HOME = 'Home',
  ORDER_SALES = 'OrderSales',
}

export type RootStackParamList = {
  [SCREENS.HOME]: undefined
  [SCREENS.AREA_SALES]: undefined
  [SCREENS.ORDER_SALES]: AttentionPoint
  [SCREENS.LOGIN]: undefined
}
export type StackNavigation = NavigationProp<RootStackParamList>
