import AsyncStorage from '@react-native-async-storage/async-storage'
import { createContext, useCallback, useContext, useEffect, useState } from 'react'

import { Auth, Business, LocationBusiness } from '@core/types'

import client from '@utils/apollo'

import { ITheme, light } from '@constants/index'

import useStorage from './useStorage'

type DataProviderProps = ReturnType<typeof useDataProvider>
const initValueContext: DataProviderProps = {
  isDark: false,
  theme: light,
  client,
  setTheme: () => {},
  handleChangeMode: () => {},
  setUserAuth: () => {},
  userAuth: {
    auth: undefined,
    business: undefined,
    locationBusiness: undefined,
  },
  handleClearUserAuth: () => {},
}
export const DataContext = createContext<DataProviderProps>(initValueContext)
type UserAuth = {
  auth?: Auth
  business?: Business
  locationBusiness?: LocationBusiness
}
export const useDataProvider = () => {
  const [isDark, setIsDark] = useState(false)
  const userAuth = useStorage<UserAuth>('UserAuth')
  const [theme, setTheme] = useState<ITheme>(light)
  const getIsDark = useCallback(async () => {
    const isDarkJSON = await AsyncStorage.getItem('isDark')
    if (isDarkJSON !== null) {
      setIsDark(JSON.parse(isDarkJSON))
    }
  }, [setIsDark])
  const handleChangeMode = useCallback(
    (payload: boolean) => {
      setIsDark(payload)
      AsyncStorage.setItem('isDark', JSON.stringify(payload))
    },
    [setIsDark],
  )

  useEffect(() => {
    getIsDark()
  }, [])
  const handleClearUserAuth = useCallback(() => {
    userAuth.setValue({ auth: undefined, business: undefined, locationBusiness: undefined })
  }, [userAuth])

  return {
    isDark,
    theme,
    setTheme,
    client,
    userAuth: userAuth.value,
    setUserAuth: userAuth.setValue,
    handleChangeMode,
    handleClearUserAuth,
  }
}
export const DataProvider = ({ children }: { children: React.ReactNode }) => {
  const contextValue = useDataProvider()
  return <DataContext.Provider value={contextValue}>{children}</DataContext.Provider>
}

export const useAppData = () => useContext(DataContext)
