import { useNavigation } from '@react-navigation/core'
import { createStackNavigator } from '@react-navigation/stack'
import { Fragment, useEffect } from 'react'
import { Text, View } from 'react-native'

import { AreaSales, Login, OrderSales } from '@screens/index'

import { useAppData, useScreenOptions } from '@hooks/index'

import { RootStackParamList, SCREENS, StackNavigation } from '@constants/types/navigation'

const Stack = createStackNavigator<RootStackParamList>()

const Home = () => {
  const navigation = useNavigation<StackNavigation>()
  useEffect(() => {
    navigation.navigate(SCREENS.AREA_SALES)
  }, [])
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
            options={{ title: 'Pedidos', headerShown: false }}
          />
          <Stack.Screen
            name={SCREENS.AREA_SALES}
            component={AreaSales}
            options={{ title: 'Zonas de atención' }}
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
