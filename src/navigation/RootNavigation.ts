import { createNavigationContainerRef } from '@react-navigation/native'

import { RootStackParamList } from '@constants/types/navigation'

export const navigationRef = createNavigationContainerRef<RootStackParamList>()
