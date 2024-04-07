import { createContext, useContext, useEffect, useState } from 'react'

import { AuthService } from '@core/index'
import { UserAuth } from '@core/types'

import client from '@utils/apollo'
import { validateToken } from '@utils/scripts'

import { ITheme, LOCAL, light } from '@constants/index'

import useStorage from './useStorage'

type DataProviderProps = ReturnType<typeof useDataProvider>
const emptyUserAuth = {
  auth: undefined,
  business: undefined,
  locationBusiness: undefined,
}
const initValueContext: DataProviderProps = {
  isDark: false,
  theme: light,
  client,
  setTheme: () => {},
  handleChangeMode: () => {},
  setUserAuth: () => {},
  userAuth: emptyUserAuth,
  handleClearUserAuth: () => {},
}
export const DataContext = createContext<DataProviderProps>(initValueContext)

export const useDataProvider = () => {
  const isDark = useStorage<boolean>(LOCAL.IS_DARK)
  const userAuth = useStorage<UserAuth>(LOCAL.USER_AUTH)
  const [theme, setTheme] = useState<ITheme>(light)

  useEffect(() => {
    const interval = setInterval(verifyAuth, 5000)
    verifyAuth()
    return () => {
      clearInterval(interval)
    }
  }, [userAuth.value])
  const verifyAuth = () => {
    const isValidTokenAuth = validateToken(userAuth.value?.auth?.authentication)
    if (isValidTokenAuth) return
    const isValidRefreshAuth = validateToken(userAuth.value?.auth?.refreshToken)
    if (isValidRefreshAuth) {
      refreshToken(userAuth.value?.auth?.refreshToken)
    } else {
      handleClearUserAuth()
    }
  }
  const refreshToken = async (token: string | undefined) => {
    if (!token) return
    const response = await AuthService.refreshToken({
      authentication: token,
    })
    if (response.data) {
      userAuth.setValue((prev) => ({
        ...prev,
        auth: {
          authentication: response.data.refresh.authentication,
          authorization: response.data.refresh.authorization,
          refreshToken: response.data.refresh.refresh,
          moduleId: prev?.auth?.moduleId,
        },
      }))
      return
    }
    handleClearUserAuth()
  }

  const handleChangeMode = () => isDark.setValue(!isDark.value)

  const handleClearUserAuth = () => userAuth.setValue(emptyUserAuth)

  return {
    theme,
    client,
    setTheme,
    handleChangeMode,
    handleClearUserAuth,
    isDark: !!isDark.value,
    userAuth: userAuth.value,
    setUserAuth: userAuth.setValue,
  }
}
export const DataProvider = ({ children }: { children: React.ReactNode }) => {
  const contextValue = useDataProvider()
  return <DataContext.Provider value={contextValue}>{children}</DataContext.Provider>
}

export const useAppData = () => useContext(DataContext)
