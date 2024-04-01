import { useNavigation } from '@react-navigation/core'
import { createStackNavigator } from '@react-navigation/stack'
import React, { Fragment, useEffect } from 'react'
import { Text, View } from 'react-native'

import { AreaSales, Login, OrderSales } from '@screens/index'

import { useAppData, useScreenOptions } from '@hooks/index'

import { RootStackParamList, SCREENS } from '@constants/types/navigation'

const Stack = createStackNavigator<RootStackParamList>()

const Home = () => {
  return (
    <View>
      <Text>Falta control de roles, por favor navegue por el menú</Text>
    </View>
  )
}
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
            options={{ title: 'Pedidos' }}
          />
          <Stack.Screen
            name={SCREENS.AREA_SALES}
            component={AreaSales}
            options={{ title: 'Zonas de atención' }}
          />
          <Stack.Screen name={SCREENS.HOME} component={Home} options={{ title: 'Inicio' }} />
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
