import * as SplashScreen from 'expo-splash-screen'
import { DefaultTheme, NavigationContainer } from '@react-navigation/native'
import { useFonts } from 'expo-font'
import { useEffect } from 'react'
import { Platform, StatusBar } from 'react-native'

import { ThemeProvider, useAppData } from '@hooks/index'

import Menu from './Menu'

SplashScreen.preventAutoHideAsync()

export default () => {
  const { isDark, theme, setTheme } = useAppData()
  useEffect(() => {
    Platform.OS === 'android' && StatusBar.setTranslucent(true)
    StatusBar.setBarStyle(isDark ? 'light-content' : 'dark-content')
    return () => {
      StatusBar.setBarStyle('default')
    }
  }, [isDark])

  const [fontsLoaded] = useFonts({
    'OpenSans-Light': theme.assets.OpenSansLight,
    'OpenSans-Regular': theme.assets.OpenSansRegular,
    'OpenSans-SemiBold': theme.assets.OpenSansSemiBold,
    'OpenSans-ExtraBold': theme.assets.OpenSansExtraBold,
    'OpenSans-Bold': theme.assets.OpenSansBold,
  })

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync()
    }
  }, [fontsLoaded])

  const navigationTheme = {
    ...DefaultTheme,
    dark: isDark,
    colors: {
      ...DefaultTheme.colors,
      border: 'rgba(0,0,0,0)',
      text: String(theme.colors.text),
      card: String(theme.colors.card),
      primary: String(theme.colors.primary),
      notification: String(theme.colors.primary),
      background: String(theme.colors.background),
    },
  }

  if (!fontsLoaded) {
    return null
  }

  return (
    <ThemeProvider theme={theme} setTheme={setTheme}>
      <NavigationContainer theme={navigationTheme}>
        <Menu />
      </NavigationContainer>
    </ThemeProvider>
  )
}
