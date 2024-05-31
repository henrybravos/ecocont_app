import { useEffect, useState } from 'react'
import { Alert } from 'react-native'

import { CustomerService } from '@core/graphql'
import { Customer, EnumDocumentType } from '@core/types'

import useFetchApi from '@hooks/useFetchApi'

import { validateDNI, validateRUC } from '@utils/scripts'

export type ErrorsCustomer = {
  [key in keyof Customer]?: boolean
}
const initCustomerForm: Partial<Customer> = {
  documentType: EnumDocumentType.DNI,
}
const useCustomer = (
  onCreatedCustomer: (customer: { label: string; value: string; code: string }) => void,
) => {
  const [customerForm, setCustomerForm] = useState<Partial<Customer>>(initCustomerForm)
  const [errors, setErrors] = useState<ErrorsCustomer>({})
  const [visibleCreate, setVisibleCreate] = useState(false)

  const [isLoadingDniRuc, customerRest, fetchApi, _, resetApi] = useFetchApi(
    CustomerService.apiRestDniRuc,
  )
  const [
    isLoadingCreateCustomer,
    createCustomer,
    fetchCreateCustomer,
    errorCreateCustomer,
    resetCreateCustomer,
  ] = useFetchApi(CustomerService.createCustomer)

  useEffect(() => {
    if (customerRest?.documentNumber) {
      setCustomerForm((prev) => ({ ...prev, ...customerRest }))
      resetApi()
    }
  }, [customerRest?.documentNumber])
  useEffect(() => {
    if (createCustomer?.id) {
      resetCreateCustomer()
      setVisibleCreate(false)
      setCustomerForm(initCustomerForm)
      onCreatedCustomer({ label: createCustomer.businessName, value: createCustomer.id, code: '' })
    } else if (createCustomer?.id === null) {
      Alert.alert('Error', 'Cliente ya existe')
    }
  }, [createCustomer?.id])
  const validateCustomerForm = () => {
    const errors = {} as ErrorsCustomer
    if (!customerForm.documentNumber) {
      errors.documentNumber = true
    }
    if (!customerForm.businessName) {
      errors.businessName = true
    }

    const haveErrors = Object.keys(errors).length > 0
    setErrors(errors)
    return !haveErrors
  }
  const onSubmitCustomerForm = () => {
    const isValid = validateCustomerForm()
    if (!isValid) return
    console.log('customerForm send API', customerForm)
    fetchCreateCustomer(customerForm as Customer)
  }
  const onChangePropertiesCustomer = <T extends keyof Customer>(
    keyCustomer: keyof Customer,
    value: Customer[T],
  ) => {
    if (keyCustomer === 'documentNumber') {
      if (validateDNI(value || '').success) {
        fetchApi({ dni: value })
      } else if (validateRUC(value || '').success) {
        fetchApi({ ruc: value })
      }
    }
    setCustomerForm((prev) => ({ ...prev, [keyCustomer]: value }))
  }
  const toggleVisibleCreate = () => setVisibleCreate((prev) => !prev)

  return {
    isLoadingDniRuc,
    isLoadingCreateCustomer,
    isVisibleCreate: visibleCreate,

    fetchApi,
    customerForm,
    setCustomerForm,
    errorsForm: errors,
    errorCreateCustomer,

    onSubmitCustomerForm,
    onChangePropertiesCustomer,
    toggleVisibleCreate,
  }
}

export { useCustomer }
