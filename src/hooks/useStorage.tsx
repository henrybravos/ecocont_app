import AsyncStorage from '@react-native-async-storage/async-storage'
import { useEffect, useState } from 'react'

function useStorage<T>(key: string, initialValue?: T | undefined) {
  const [value, setValue] = useState<T | undefined>(initialValue)

  useEffect(() => {
    const loadValue = async () => {
      try {
        const storedValue = await AsyncStorage.getItem(key)
        if (storedValue !== null) setValue(JSON.parse(storedValue))
      } catch (error) {
        console.log(`Error retrieving value for key "${key}":`, error)
      }
    }

    loadValue()
  }, [key])

  useEffect(() => {
    const saveValue = async () => {
      try {
        await AsyncStorage.setItem(key, JSON.stringify(value ?? {}))
      } catch (error) {
        console.log(`Error saving value for key "${key}":`, error)
      }
    }

    saveValue()
  }, [key, value])

  const resetValue = async () => {
    try {
      await AsyncStorage.removeItem(key)
      setValue(initialValue)
    } catch (error) {
      console.log(`Error resetting value for key "${key}":`, error)
    }
  }

  return { value, setValue, resetValue }
}

export default useStorage
