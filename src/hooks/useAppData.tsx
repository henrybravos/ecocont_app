import { createContext, useContext, useEffect, useState } from 'react'

import { AuthService } from '@core/graphql'
import { UserAuth } from '@core/types'

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
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null)
  useEffect(() => {
    const remainToken = verifyAuth()
    const timeout = remainToken <= 5 ? remainToken : remainToken - 5
    //console.log('REFRESH TOKEN EN', timeout, 'SEGUNDOS, pero VENCE EN', remainToken)
    if (remainToken <= 0) {
      handleClearUserAuth()
    } else {
      const timeoutId = setTimeout(() => {
        refreshToken(userAuth.value?.auth?.refreshToken)
      }, timeout * 1000)
      setTimeoutId(timeoutId)
    }
    return () => {
      if (timeoutId) {
        //console.log('CLEAR TIMEOUT', timeoutId)
        clearInterval(timeoutId)
      }
    }
  }, [userAuth.value])
  const verifyAuth = () => {
    const verifyToken = validateToken(userAuth.value?.auth?.authentication)
    if (verifyToken.valid) return verifyToken.remain
    const verifyRefreshToken = validateToken(userAuth.value?.auth?.refreshToken)
    if (verifyRefreshToken.valid) {
      refreshToken(userAuth.value?.auth?.refreshToken)
      return verifyRefreshToken.remain
    } else {
      handleClearUserAuth()
      return 0
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
