import { useNavigation } from '@react-navigation/core'
import { createStackNavigator } from '@react-navigation/stack'
import { Fragment, useEffect } from 'react'
import { View } from 'react-native'

import Text from '@components/Text'

import { AreaSales, Checkpoint, Login, OrderSales, ViewerPdf } from '@screens/index'

import { useAppData, useScreenOptions } from '@hooks/index'

import { RootStackParamList, SCREENS } from '@constants/types/navigation'

const Stack = createStackNavigator<RootStackParamList>()

export default () => {
  const { userAuth } = useAppData()
  const { setOptions } = useNavigation()
  const screenOptions = useScreenOptions()
  const auth = userAuth?.auth
  useEffect(() => setOptions({ gestureEnabled: !!auth?.authentication }), [auth, setOptions])
  return (
    <Stack.Navigator screenOptions={{ ...screenOptions.stack }}>
      {auth?.authentication && (
        <Fragment>
          <Stack.Screen
            name={SCREENS.ORDER_SALES}
            component={OrderSales}
            options={{ title: 'Pedidos', headerShown: false }}
          />
          <Stack.Screen
            name={SCREENS.AREA_SALES}
            component={AreaSales}
            options={{ title: 'Zonas de atención' }}
          />
          <Stack.Screen
            name={SCREENS.CHECKPOINT}
            component={Checkpoint}
            options={{ title: 'Caja', headerShown: false }}
          />
        </Fragment>
      )}
      <Stack.Screen
        name={SCREENS.LOGIN}
        component={Login}
        options={{ title: 'Ingreso', headerShown: false }}
      />
    </Stack.Navigator>
  )
}
