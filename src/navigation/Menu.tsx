import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerNavigationOptions,
  createDrawerNavigator,
  useDrawerStatus,
} from '@react-navigation/drawer'
import React, { useCallback, useEffect, useRef } from 'react'
import { Animated, StyleSheet } from 'react-native'

import { Block, Button, Image, Switch, Text } from '@components/index'

import { useAppData, useTheme } from '@hooks/index'

import Screens from './Screens'

const Drawer = createDrawerNavigator()

const ScreensStack = () => {
  const { colors } = useTheme()

  const isDrawerOpen = useDrawerStatus() === 'open'
  const animation = useRef(new Animated.Value(0)).current

  const scale = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.88],
  })

  const borderRadius = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 16],
  })

  const animatedStyle = {
    borderRadius: borderRadius,
    transform: [{ scale: scale }],
  }

  useEffect(() => {
    Animated.timing(animation, {
      duration: 200,
      useNativeDriver: true,
      toValue: isDrawerOpen ? 1 : 0,
    }).start()
  }, [isDrawerOpen, animation])

  return (
    <Animated.View
      style={StyleSheet.flatten([
        animatedStyle,
        {
          flex: 1,
          overflow: 'hidden',
          borderColor: colors.card,
          borderWidth: isDrawerOpen ? 1 : 0,
        },
      ])}
    >
      <Screens />
    </Animated.View>
  )
}

/* custom drawer menu */
const DrawerContentCustom = (props: DrawerContentComponentProps) => {
  const { navigation } = props
  const { isDark, handleChangeMode, handleClearUserAuth, userAuth } = useAppData()
  const { colors, gradients, sizes, icons } = useTheme()
  const isAuth = !!userAuth?.auth?.authentication
  const labelColor = isDark ? colors.white : colors.text
  const state = navigation.getState()
  const route = state.routes[state.index]
  const name = route.state?.routes[route.state.index || 0].name || isAuth ? 'Home' : 'Login'

  const handleNavigation = useCallback(
    (to: string) => {
      navigation.navigate(to)
    },
    [navigation],
  )
  const screens = [{ name: 'Home', to: 'Home', icon: icons.home }]

  const handleCloseSession = useCallback(() => {
    handleClearUserAuth()
    handleNavigation('Login')
  }, [handleClearUserAuth, handleNavigation])
  return (
    <DrawerContentScrollView
      {...props}
      scrollEnabled
      removeClippedSubviews
      renderToHardwareTextureAndroid
      contentContainerStyle={{ paddingBottom: sizes.padding }}
    >
      <Block paddingHorizontal={sizes.padding}>
        <Block flex={0} row align="center" marginBottom={sizes.l}>
          <Block>
            <Text size={12} semibold align={'center'}>
              ALTERNATIVAS
            </Text>
            <Text size={12} semibold align={'center'}>
              CONTABLES
            </Text>
          </Block>
        </Block>

        {screens?.map((screen, index) => {
          const isActive = name === screen.to
          return (
            <Button
              row
              justify="flex-start"
              marginBottom={sizes.s}
              key={`menu-screen-${screen.name}-${index}`}
              onPress={() => handleNavigation(screen.to)}
            >
              <Block
                flex={0}
                radius={6}
                align="center"
                justify="center"
                width={sizes.md}
                height={sizes.md}
                marginRight={sizes.s}
                gradient={gradients[isActive ? 'info' : 'white']}
              >
                <Image
                  radius={0}
                  width={14}
                  height={14}
                  source={screen.icon}
                  color={colors[isActive ? 'white' : 'black']}
                />
              </Block>
              <Text p semibold={isActive} color={labelColor}>
                {screen.name}
              </Text>
            </Button>
          )
        })}

        <Block
          flex={0}
          height={1}
          marginRight={sizes.md}
          marginVertical={sizes.sm}
          gradient={gradients.menu}
        />

        <Block row justify="space-between" marginTop={sizes.sm}>
          <Text color={labelColor}>Mode</Text>
          <Switch checked={isDark} onPress={handleChangeMode} />
        </Block>

        <Button
          row
          justify="flex-start"
          marginTop={sizes.sm}
          marginBottom={sizes.s}
          onPress={handleCloseSession}
        >
          <Text p semibold={name === 'Login'} color={labelColor}>
            Cerrar sesión
          </Text>
        </Button>
      </Block>
    </DrawerContentScrollView>
  )
}

/* drawer menu navigation */
export default () => {
  const { isDark, userAuth } = useAppData()
  const { gradients } = useTheme()
  const isAuth = !!userAuth?.auth?.authentication
  return (
    <Block gradient={gradients[isDark ? 'dark' : 'light']}>
      <Drawer.Navigator
        screenOptions={{
          ...screenOptions,
          swipeEnabled: isAuth,
        }}
        drawerContent={(props) => <DrawerContentCustom {...props} />}
      >
        <Drawer.Screen name="App" component={ScreensStack} />
      </Drawer.Navigator>
    </Block>
  )
}
const screenOptions: DrawerNavigationOptions = {
  drawerStyle: {
    flex: 1,
    width: '60%',
    borderRightWidth: 0,
    backgroundColor: 'transparent',
  },
  drawerType: 'slide',
  overlayColor: 'transparent',
  headerShown: false,
  sceneContainerStyle: { backgroundColor: 'transparent' },
}
