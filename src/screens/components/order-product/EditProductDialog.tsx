import { useEffect, useState } from 'react'
import { View } from 'react-native'
import { TextInput } from 'react-native-paper'

import Text from '@components/Text'
import { Dialog } from '@components/paper'

import { useOrderSalesContext } from '@screens/hooks/order-sales/order-context'

import { MovementOrder } from '@core/types/order-sales'

import { formatNumber } from '@utils/scripts'

const ProductEditDialog = () => {
  const ctx = useOrderSalesContext()
  const [productOrder, setProductOrder] = useState<Partial<MovementOrder>>({
    ...ctx.productSelected.product,
  })
  useEffect(() => {
    setProductOrder({ ...ctx.productSelected.product })
  }, [ctx.productSelected.product])
  const plusQuantity = () => incrementQuantity(1)
  const minusQuantity = () => incrementQuantity(-1)
  const incrementQuantity = (increment: number) => {
    const quantity = (productOrder?.quantity || 0) + increment
    if (quantity < 0) return
    setProductOrder({ ...productOrder, quantity })
  }

  const setQuantity = (quantityString: string) => {
    const quantity = parseInt(quantityString) ?? 0
    setProductOrder({ ...productOrder, quantity })
  }
  const setUnitPrice = (unitPriceString: string) => {
    const unitPrice = parseFloat(unitPriceString) ?? 0
    setProductOrder({ ...productOrder, unitPrice })
  }
  const visibleEdit = ctx.productSelected.mode === 'edit' && !!productOrder
  const quantity = productOrder?.quantity
    ? isNaN(productOrder?.quantity)
      ? ''
      : productOrder?.quantity.toString()
    : ''

  const unitPrice = productOrder?.unitPrice
    ? isNaN(productOrder?.unitPrice)
      ? ''
      : productOrder?.unitPrice.toString()
    : ''
  const subTotal = formatNumber((productOrder?.quantity || 0) * (productOrder?.unitPrice || 0))
  return (
    <Dialog
      doneProps={{
        mode: 'contained',
        compact: true,
        disabled: !productOrder?.quantity || !productOrder?.unitPrice,
      }}
      cancelCallback={ctx.handleProductSelected()}
      confirmCallback={() => {
        alert('next to implement')
      }}
      title={`EDITAR:`}
      visible={visibleEdit}
      style={{ backgroundColor: '#fff' }}
    >
      <Text align="justify" marginBottom={16}>
        {productOrder?.priceDetail?.name}
      </Text>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        <View style={{ flex: 1 }}>
          <TextInput
            mode="outlined"
            dense
            label="Cant."
            value={quantity}
            onChangeText={setQuantity}
            left={
              <TextInput.Icon
                mode="contained-tonal"
                size={18}
                icon="minus"
                onPress={minusQuantity}
              />
            }
            right={
              <TextInput.Icon mode="contained-tonal" size={18} icon="plus" onPress={plusQuantity} />
            }
          />
        </View>
        <View style={{ flex: 1 }}>
          <TextInput
            mode="outlined"
            dense
            label="Precio"
            value={unitPrice}
            onChangeText={setUnitPrice}
            left={<TextInput.Affix text={ctx.order?.currency?.name} />}
          />
        </View>
      </View>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        <View style={{ flex: 1 }} />
        <View style={{ flex: 1 }}>
          <TextInput
            mode="outlined"
            dense
            label="Can. x Precio"
            editable={false}
            value={subTotal}
            left={<TextInput.Affix text={ctx.order?.currency.name} />}
          />
        </View>
      </View>
    </Dialog>
  )
}
export default ProductEditDialog
