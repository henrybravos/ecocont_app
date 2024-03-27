import { useNavigation } from '@react-navigation/core'
import { createStackNavigator } from '@react-navigation/stack'
import React, { Fragment, useEffect } from 'react'
import { Text, View } from 'react-native'

import { Login } from '@screens/index'

import { useAppData, useScreenOptions } from '@hooks/index'

const Stack = createStackNavigator()

const Home = () => {
  return (
    <View>
      <Text>Inicio</Text>
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
          <Stack.Screen name="Home" component={Home} options={{ title: 'Inicio' }} />
        </Fragment>
      )}
      <Stack.Screen
        name="Login"
        component={Login}
        options={{ title: 'Ingreso', headerShown: false }}
      />
    </Stack.Navigator>
  )
}
