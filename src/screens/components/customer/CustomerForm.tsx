import { useState } from 'react'
import { NativeSyntheticEvent, StyleSheet, TextInputChangeEventData, View } from 'react-native'
import { Button, Menu, TextInput } from 'react-native-paper'

import { DocumentTypeLabels } from '@screens/components/customer/customer.const'

import { Customer, EnumDocumentType } from '@core/types'

type CustomerFormProps = {
  customerForm: Partial<Customer>
  errors: { [key in keyof Customer]?: boolean }
  onChangePropertiesCustomer: <T extends keyof Customer>(
    keyCustomer: keyof Customer,
    value: Customer[T],
  ) => void
}

const CustomerForm = (props: CustomerFormProps) => {
  const { customerForm, errors, onChangePropertiesCustomer } = props
  const [visibleDocumentMenu, setVisibleDocumentMenu] = useState(false)
  const selectDocument = DocumentTypeLabels.find(
    (item) => item.value === customerForm?.documentType,
  )
  const toggleDocumentMenu = () => setVisibleDocumentMenu((prev) => !prev)
  const onChangeInput =
    (key: keyof Customer) => (e: NativeSyntheticEvent<TextInputChangeEventData>) => {
      onChangePropertiesCustomer(key, e.nativeEvent.text)
    }
  const onChangeDocumentType = (value: EnumDocumentType) => () => {
    onChangePropertiesCustomer('documentType', value)
    toggleDocumentMenu()
  }
  return (
    <View>
      <View style={styles.root}>
        <View style={styles.documentTypeInput}>
          <TextInput
            label="Documento *"
            value={customerForm.documentNumber}
            dense
            keyboardType="number-pad"
            onChange={onChangeInput('documentNumber')}
            error={errors.documentNumber}
            autoFocus
          />
        </View>
        <View style={styles.documentTypeMenu}>
          <Menu
            visible={visibleDocumentMenu}
            onDismiss={toggleDocumentMenu}
            anchor={
              <Button compact mode="outlined" onPress={toggleDocumentMenu}>
                {selectDocument?.label || 'DOC. *'}
              </Button>
            }
          >
            {DocumentTypeLabels.map((item) => (
              <Menu.Item
                key={item.value}
                onPress={onChangeDocumentType(item.value)}
                title={item.fullLabel}
              />
            ))}
          </Menu>
        </View>
      </View>
      <TextInput
        error={errors.businessName}
        label="Razón Social / Nombre *"
        dense
        value={customerForm.businessName}
        onChange={onChangeInput('businessName')}
      />
      <TextInput
        error={errors.address}
        label="Dirección"
        dense
        onChange={onChangeInput('address')}
      />
      <TextInput
        label="Email"
        dense
        error={errors.email}
        keyboardType="email-address"
        onChange={onChangeInput('email')}
      />
      <TextInput
        label="Teléfono"
        error={errors.phone}
        dense
        keyboardType="phone-pad"
        onChange={onChangeInput('phone')}
      />
    </View>
  )
}
export default CustomerForm

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  documentTypeInput: { flex: 1 },
  documentTypeMenu: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
})
