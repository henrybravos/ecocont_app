import { useState } from 'react'

import { useInputProps } from '../constants/types'

export default function useInput({
  initialState,
  disabled,
  invalidate,
  initialMessage,
  initialUpperCase,
}: useInputProps) {
  const [value, setValue] = useState(initialState ? initialState : '')
  const [invalid, setInvalid] = useState(invalidate ? invalidate : false)
  const [message, setMessage] = useState(initialMessage ? initialMessage : '')
  const [upperCase, setUpperCase] = useState(initialUpperCase ? initialUpperCase : false)
  const [isDisabled, setIsDisabled] = useState(disabled ? disabled : false)
  const [isKeyUp, setIsKeyUp] = useState(false)

  return {
    value,
    setValue,
    setInvalid,
    setMessage,
    invalid,
    setUpperCase,
    isKeyUp,
    setIsKeyUp,
    setIsDisabled,
  }
}
