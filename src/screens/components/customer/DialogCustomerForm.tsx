import { Dispatch, SetStateAction, useState } from 'react'
import { Button, Dialog, Portal, ProgressBar } from 'react-native-paper'

import { ErrorsCustomer } from '@screens/hooks/customer/useCustomer'

import { Customer, EnumDocumentType } from '@core/types'

import { COLORS } from '@constants/light'

import CustomerForm from './CustomerForm'

type DialogCustomerFormProps = {
  loading: boolean
  errorsForm: ErrorsCustomer
  visibleDialog: boolean
  customerForm: Partial<Customer>
  onChangePropertiesCustomer: <T extends keyof Customer>(
    keyCustomer: keyof Customer,
    value: Customer[T],
  ) => void
  onSubmitCustomerForm: () => void
  onToggleVisible: () => void
}
export const DialogCustomerForm = (props: DialogCustomerFormProps) => {
  const {
    visibleDialog,
    loading,
    onToggleVisible,
    customerForm,
    onChangePropertiesCustomer,
    errorsForm,
    onSubmitCustomerForm,
  } = props

  return (
    <Portal>
      <Dialog visible={visibleDialog} onDismiss={onToggleVisible}>
        <ProgressBar visible={loading} indeterminate />
        <Dialog.Title>Nuevo cliente</Dialog.Title>
        <Dialog.Content>
          <CustomerForm
            errors={errorsForm}
            customerForm={customerForm}
            onChangePropertiesCustomer={onChangePropertiesCustomer}
          />
        </Dialog.Content>
        <Dialog.Actions>
          <Button
            buttonColor={COLORS.primary.toString()}
            mode="contained"
            onPress={onSubmitCustomerForm}
          >
            GUARDAR
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  )
}
