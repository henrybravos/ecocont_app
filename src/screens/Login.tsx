import { useNavigation } from '@react-navigation/core'
import { useCallback, useState } from 'react'
import { Platform } from 'react-native'
import { ProgressBar, Snackbar } from 'react-native-paper'

import { Block, Button, Input, Text } from '@components/index'

import { Auth } from '@core/index'

import { useAppData, useTheme } from '@hooks/index'

import * as regex from '@constants/regex'

const isAndroid = Platform.OS === 'android'
const initAuth = {
  email: 'henry123@gmail.com',
  password: '123457',
  invalidEmail: false,
  invalidPassword: false,
}

const useAuth = () => {
  const { client, setUserAuth } = useAppData()
  const { navigate } = useNavigation()
  const [authInput, setAuthInput] = useState(initAuth)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSignIn = useCallback(() => {
    setLoading(true)
    Auth.createToken(client, {
      email: authInput.email,
      password: authInput.password,
    })
      .then(({ login }) => {
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
        navigate('Home' as never)
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
const Login = () => {
  const theme = useTheme()
  const {
    authInput,
    loading,
    error,
    onChangeEmail,
    onChangePassword,
    handleClearError,
    handleSignIn,
  } = useAuth()
  return (
    <Block safe marginTop={theme.sizes.md}>
      <Block paddingHorizontal={theme.sizes.s} flex={1}>
        <Block flex={1} keyboard behavior={!isAndroid ? 'padding' : 'height'}>
          <Block
            flex={1}
            radius={theme.sizes.sm}
            justify="center"
            marginHorizontal="8%"
            marginVertical="60%"
            shadow={!isAndroid}
          >
            <Block
              blur
              flex={1}
              intensity={90}
              radius={theme.sizes.sm}
              overflow="hidden"
              tint={theme.colors.blurTint}
              paddingVertical={theme.sizes.sm}
            >
              <Block paddingHorizontal={theme.sizes.sm}>
                <Text h5 center marginBottom={theme.sizes.md}>
                  Ingreso de Usuario
                </Text>
                <Input
                  label="Usuario"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  placeholder={'Ingrese su usuario'}
                  success={Boolean(!authInput.invalidEmail)}
                  danger={Boolean(authInput.invalidEmail)}
                  onChangeText={onChangeEmail}
                  value={authInput.email}
                />
                <Input
                  label="Contraseña"
                  autoCapitalize="none"
                  keyboardType="default"
                  secureTextEntry
                  placeholder={'Ingrese su contraseña'}
                  success={Boolean(!authInput.invalidPassword)}
                  danger={Boolean(authInput.invalidPassword)}
                  onChangeText={onChangePassword}
                  value={authInput.password}
                />
              </Block>
              <Button
                onPress={handleSignIn}
                marginVertical={theme.sizes.s}
                marginHorizontal={theme.sizes.sm}
                gradient={theme.gradients.primary}
                disabled={authInput.invalidEmail || authInput.invalidPassword || loading}
              >
                <Text bold white transform="uppercase">
                  Ingresar
                </Text>
              </Button>
            </Block>
          </Block>
        </Block>
      </Block>
      <Snackbar onDismiss={handleClearError} visible={!!error} duration={5000}>
        {error}
      </Snackbar>
      <ProgressBar indeterminate color={theme.colors.primary as string} visible={loading} />
    </Block>
  )
}

export default Login
