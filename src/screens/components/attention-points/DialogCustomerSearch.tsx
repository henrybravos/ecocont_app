import { useState } from 'react'
import { FlatList, TouchableWithoutFeedback } from 'react-native'
import { Button, Checkbox, Dialog, Portal, ProgressBar, Surface, Text } from 'react-native-paper'

import SearchBarComponent from '@components/paper/SearchBar'

import { DialogCustomerForm } from '@screens/components/customer/DialogCustomerForm'
import { useCustomer } from '@screens/hooks/customer/useCustomer'

import { EnumDocumentType } from '@core/types'

import { validateDNI, validateRUC } from '@utils/scripts'

import { COLORS } from '@constants/light'

type SearchCustomerProps = {
  onFetchCustomer: (param: string) => void
  resetCustomers: () => void
  onSelectCustomer: (customer: { label: string; value: string; code: string }) => void
  onCloseSearch: () => void
  isLoadingCustomer: boolean
  customersResponse: { label: string; value: string; code: string }[]
  visible: boolean
}

const SearchCustomer = ({
  customersResponse,
  isLoadingCustomer,
  resetCustomers,
  onFetchCustomer,
  onSelectCustomer,
  onCloseSearch,
  visible,
}: SearchCustomerProps) => {
  const onCreateCustomer = (customer: { label: string; value: string; code: string }) => {
    onCloseSearch()
    onSelectCustomer(customer)
  }
  const {
    fetchApi,
    isLoadingDniRuc,
    isLoadingCreateCustomer,
    isVisibleCreate,
    customerForm,
    setCustomerForm,
    errorsForm,
    onSubmitCustomerForm,
    onChangePropertiesCustomer,
    toggleVisibleCreate,
  } = useCustomer(onCreateCustomer)

  const [textSearch, setTextSearch] = useState('')

  const onSelectCustomerItem = (item: { value: string; label: string; code: string }) => {
    onSelectCustomer(item)
    onCloseSearch()
    resetCustomers()
  }
  const onChangeSearch = (value: string) => {
    setTextSearch(value)
    onFetchCustomer(value)
  }
  const onOpenCreateCustomer = () => {
    toggleVisibleCreate()
    const isRUC = validateRUC(textSearch)
    const isDNI = validateDNI(textSearch)
    if (isRUC.success || isDNI.success) {
      fetchApi({
        dni: isDNI.success ? textSearch : undefined,
        ruc: isRUC.success ? textSearch : undefined,
      })
    }
    const onlyLettersOrSpaces = /^[a-zA-Z\s]*$/.test(textSearch)
    const documentType = isRUC.success ? EnumDocumentType.RUC : EnumDocumentType.DNI
    const documentNumber = isRUC.success || isDNI.success ? textSearch : ''
    const businessName = onlyLettersOrSpaces ? textSearch : ''
    const customerForm = {
      documentType,
      documentNumber,
      businessName,
    }
    console.log({ customerForm })
    setCustomerForm(customerForm)
  }
  return (
    <>
      <Portal>
        <Dialog onDismiss={onCloseSearch} visible={visible} dismissable={false}>
          <Dialog.Content>
            <SearchBarComponent
              clearButtonMode="always"
              onClearIconPress={resetCustomers}
              onConfirmSearch={onChangeSearch}
              elevation={0}
              autoFocus
            />
            <ProgressBar indeterminate visible={isLoadingCustomer} />
            <Text style={{ fontSize: 10 }}>Se muestran los 5 primeros resultados</Text>
            <FlatList
              data={customersResponse.slice(0, 5)}
              renderItem={({ item }) => (
                <TouchableWithoutFeedback onPress={() => onSelectCustomerItem(item)}>
                  <Surface
                    elevation={1}
                    style={{ marginVertical: 2, paddingHorizontal: 2, flexDirection: 'row' }}
                  >
                    <Checkbox status="unchecked" />
                    <Text>{item.label}</Text>
                  </Surface>
                </TouchableWithoutFeedback>
              )}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              style={{ margin: 16, flex: 1 }}
              buttonColor={COLORS.success.toString()}
              mode="contained"
              onPress={onOpenCreateCustomer}
            >
              Nuevo
            </Button>
            <Button
              style={{ margin: 16 }}
              buttonColor="grey"
              mode="contained"
              onPress={onCloseSearch}
            >
              CERRAR
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      <DialogCustomerForm
        loading={isLoadingDniRuc || isLoadingCreateCustomer}
        errorsForm={errorsForm}
        customerForm={customerForm}
        visibleDialog={isVisibleCreate}
        onToggleVisible={toggleVisibleCreate}
        onSubmitCustomerForm={onSubmitCustomerForm}
        onChangePropertiesCustomer={onChangePropertiesCustomer}
      />
    </>
  )
}
export { SearchCustomer }
