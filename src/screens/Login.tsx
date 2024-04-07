import { Platform } from 'react-native'
import { ProgressBar, Snackbar } from 'react-native-paper'

import { Block, Button, Input, Text } from '@components/index'

import { useAuth } from '@screens/hooks/useAuth'

import useTheme from '@hooks/useTheme'

const isAndroid = Platform.OS === 'android'

const Login = () => {
  const theme = useTheme()
  const {
    authInput,
    loadingSignIn,
    errorSignIn,
    onChangeEmail,
    onChangePassword,
    resetData,
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
                disabled={authInput.invalidEmail || authInput.invalidPassword || loadingSignIn}
              >
                <Text bold white transform="uppercase">
                  Ingresar
                </Text>
              </Button>
            </Block>
          </Block>
        </Block>
      </Block>
      <Snackbar onDismiss={resetData} visible={!!errorSignIn} duration={5000}>
        {errorSignIn}
      </Snackbar>
      <ProgressBar indeterminate color={theme.colors.primary as string} visible={loadingSignIn} />
    </Block>
  )
}

export default Login
