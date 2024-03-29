import { useNavigation } from '@react-navigation/native'
import { useCallback, useState } from 'react'

import { AuthService } from '@core/index'

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
  const { client, setUserAuth } = useAppData()
  const { navigate } = useNavigation<StackNavigation>()
  const [authInput, setAuthInput] = useState(initAuth)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSignIn = useCallback(() => {
    setLoading(true)
    AuthService.createToken(client, {
      email: authInput.email,
      password: authInput.password,
    })
      .then((login) => {
        if (!login) {
          setError('Credenciales incorrectas')
          return
        }

        if (login.authentication === 'verify') {
          return
        }
        if (login.authentication === 'expired') {
          setError('Caducó su Tiempo Como Practicante')
          return
        }
        setUserAuth({
          auth: { ...login },
          business: { ...login.business, locations: [login.locationBusiness] },
          locationBusiness: login.locationBusiness,
        })
        setAuthInput(initAuth)
        navigate(SCREENS.HOME)
        setLoading(false)
      })
      .catch(({ message }: { message: string }) => {
        setError(message)
        setLoading(false)
        setAuthInput((prev) => ({ ...prev, password: '', invalidPassword: true }))
        console.log({ message })
      })
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
  const handleClearError = useCallback(() => setError(''), [])
  return {
    error,
    loading,
    authInput,
    onChangeEmail,
    onChangePassword,
    handleClearError,
    handleSignIn,
  }
}
