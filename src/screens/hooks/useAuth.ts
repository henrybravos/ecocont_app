import { useNavigation } from '@react-navigation/native'
import { useCallback, useEffect, useState } from 'react'

import { AuthService } from '@core/index'

import { useFetchApi } from '@hooks/index'
import { useAppData } from '@hooks/useAppData'

import * as regex from '@constants/regex'
import { SCREENS, StackNavigation } from '@constants/types/navigation'

const initAuth = {
  email: 'henry123@gmail.com',
  password: '123457',
  invalidEmail: false,
  invalidPassword: false,
}

export const useAuth = () => {
  const { setUserAuth, userAuth } = useAppData()
  const { navigate } = useNavigation<StackNavigation>()
  const [authInput, setAuthInput] = useState(initAuth)
  const [loadingSignIn, authResponse, fetchLogin, errorSignIn, resetData] = useFetchApi(
    AuthService.createToken,
  )
  useEffect(() => {
    if (userAuth?.auth?.authentication) {
      navigateToHome()
    }
  }, [userAuth])
  useEffect(() => {
    if (authResponse) {
      setUserAuth({
        auth: { ...authResponse },
        business: { ...authResponse.business, locations: [authResponse.locationBusiness] },
        locationBusiness: authResponse.locationBusiness,
      })
      setAuthInput(initAuth)
    }
    if (errorSignIn) {
      setAuthInput((prev) => ({ ...prev, password: '', invalidPassword: true }))
    }
  }, [authResponse])

  const navigateToHome = () => {
    setTimeout(() => {
      navigate(SCREENS.HOME)
    }, 500)
  }
  const handleSignIn = useCallback(() => {
    fetchLogin(authInput)
  }, [authInput.email, authInput.password])

  const onChangeEmail = (value: string) => {
    setAuthInput((prev) => ({ ...prev, email: value, invalidEmail: !regex.email.test(value) }))
  }
  const onChangePassword = (value: string) => {
    setAuthInput((prev) => ({
      ...prev,
      password: value,
      invalidPassword: !value,
    }))
  }
  return {
    authInput,
    resetData,
    errorSignIn,
    handleSignIn,
    loadingSignIn,

    onChangeEmail,
    onChangePassword,
  }
}
