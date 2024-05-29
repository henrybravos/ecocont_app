import { NavigationProp } from '@react-navigation/native'

import { AttentionPoint, Checkout, SalesArea } from '@core/types/user'

export enum SCREENS {
  LOGIN = 'Login',
  AREA_SALES = 'AreaSales',
  ORDER_SALES = 'OrderSales',
  VIEWER_PDF = 'ViewerPdf',
  CHECKPOINT = 'Checkpoint',
}

export type RootStackParamList = {
  [SCREENS.AREA_SALES]: undefined
  [SCREENS.ORDER_SALES]: {
    point: AttentionPoint | undefined
    checkout: Checkout
    area: Partial<SalesArea>
  }
  [SCREENS.LOGIN]: undefined
  [SCREENS.VIEWER_PDF]: undefined
  [SCREENS.CHECKPOINT]: {
    point: AttentionPoint
    checkout: Checkout
    area: Partial<SalesArea>
  }
}
export type StackNavigation = NavigationProp<RootStackParamList>
