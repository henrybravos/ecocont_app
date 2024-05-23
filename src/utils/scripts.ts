import AsyncStorage from '@react-native-async-storage/async-storage'
import JWT from 'expo-jwt'
import { SupportedAlgorithms } from 'expo-jwt/dist/types/algorithms'
import { DateTime } from 'luxon'

import { UserAuth } from '@core/types'
import { DecodeToken } from '@core/types/token'

import { LOCAL } from '@constants/local-storage'

export const CHARACTERS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

export const decodeToken = (auth: string): DecodeToken | null => {
  try {
    const decoded = JWT.decode(auth, null, { algorithm: SupportedAlgorithms.HS256, timeSkew: 30 })
    return decoded as DecodeToken
  } catch (error) {
    console.log('Error decodeToken', error)
    return null
  }
}
export const validateToken = (token: string | undefined): boolean => {
  if (token) {
    const tokenDecode = decodeToken(token)
    if (tokenDecode) {
      const tokenExpRemain = calculateSecondsRemaining(tokenDecode.exp * 1000)
      if (tokenExpRemain > 0) {
        return true
      }
    }
  }
  return false
}
export function calculateSecondsRemaining(dateMillis: number): number
export function calculateSecondsRemaining(dateIso: string): number

export function calculateSecondsRemaining(millisOrIso: number | string): number {
  const date1 =
    typeof millisOrIso === 'number'
      ? DateTime.fromMillis(millisOrIso)
      : DateTime.fromISO(millisOrIso)
  return date1.diffNow().milliseconds / 1000
}
export const getAuthenticationStorage = async () => {
  const storedValue = (await AsyncStorage.getItem(LOCAL.USER_AUTH)) ?? '{}'
  const { auth } = JSON.parse(storedValue) as UserAuth
  return auth?.authentication
}
export const getAuthorizationStorage = async () => {
  const storedValue = (await AsyncStorage.getItem(LOCAL.USER_AUTH)) ?? '{}'
  const { auth } = JSON.parse(storedValue) as UserAuth
  return auth?.authorization
}

export const validateDNI = (dni: string) => {
  if (dni === null) return { success: false, message: 'Ingrese el número de DNI' }

  if (dni.length !== 8)
    return { success: false, message: 'Ha ingresado un DNI con menos de 8 digitos' }

  if (!/^([0-9])*$/.test(dni)) return { success: false, message: 'Ha ingresado letras' }

  return { success: true, message: 'Ok' }
}

export const validateRUC = (ruc: string) => {
  ruc = ruc.trim()
  if (!ruc) return { success: false, message: 'Ingrese el número de RUC' }
  if (ruc.length !== 11)
    return { success: false, message: 'Ha ingresado un RUC con menos de 11 digitos' }

  if (!/^([0-9])*$/.test(ruc)) return { success: false, message: 'Ha ingresado un RUC con letras' }
  const rucNumber = Number(ruc)
  if (
    !(
      (rucNumber >= 1e10 && rucNumber < 11e9) ||
      (rucNumber >= 15e9 && rucNumber < 18e9) ||
      (rucNumber >= 2e10 && rucNumber < 21e9)
    )
  )
    return {
      success: false,
      message: 'RUC no válido!',
    }

  const lastDigit = `${rucNumber}`.substring(10, 11)
  let sum = 0
  const factors = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2]
  factors.forEach(
    (valor, index) => (sum += Number(`${rucNumber}`.substring(index, index + 1)) * valor),
  )

  let di = Math.trunc(sum / 11)
  let total = 11 - (Number(sum) - Number(di) * 11)

  if (total === 10) total = 0
  if (total === 11) total = 1

  return Number(lastDigit) === total
    ? { success: true, message: 'Ok' }
    : { success: false, message: 'RUC no válido!' }
}
export const strRandom = (length: number) =>
  Array(length)
    .join()
    .split(',')
    .map(() => CHARACTERS.charAt(Math.floor(Math.random() * CHARACTERS.length)))
    .join('')

declare global {
  interface Number {
    myFixed(decimals: number): string
  }
}
export function formatNumber(number: number) {
  return new Intl.NumberFormat('es-PE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(number)
}
export function reduceSumMultiplyArray<T>(
  array: T[],
  keyToSum: keyof T,
  keyToMultiply: keyof T,
  initialValue?: number,
) {
  return array.reduce(
    (acc, item) => acc + (item[keyToSum] as number) * (item[keyToMultiply] as number),
    initialValue || 0,
  )
}
Number.prototype.myFixed = function (decimals: number): string {
  let rounding =
    Math.round(parseFloat(this.toString()) * Math.pow(10, decimals)) / Math.pow(10, decimals)
  return Number(rounding).toFixed(decimals)
}
