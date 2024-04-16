import { NavigationProp } from '@react-navigation/native'

import { AttentionPoint, Checkout } from '@core/types/user'

export enum SCREENS {
  LOGIN = 'Login',
  AREA_SALES = 'AreaSales',
  ORDER_SALES = 'OrderSales',
}

export type RootStackParamList = {
  [SCREENS.AREA_SALES]: undefined
  [SCREENS.ORDER_SALES]: {
    point: AttentionPoint
    checkout: Checkout
  }
  [SCREENS.LOGIN]: undefined
}
export type StackNavigation = NavigationProp<RootStackParamList>
