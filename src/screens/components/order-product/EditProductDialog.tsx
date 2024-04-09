import { useEffect, useState } from 'react'
import { View } from 'react-native'
import { TextInput } from 'react-native-paper'

import Text from '@components/Text'
import { Dialog } from '@components/paper'

import { useOrderSalesContext } from '@screens/hooks/order-sales/order-context'

import { formatNumber } from '@utils/scripts'

const ProductEditDialog = () => {
  const ctx = useOrderSalesContext()
  const movement = ctx.productSelected?.movement

  const [quantityPrice, setQuantityPrice] = useState({
    quantityStr: '0',
    priceStr: '0',
  })
  useEffect(() => {
    setQuantityPrice({
      quantityStr: movement?.quantity?.toString() || '0',
      priceStr: movement?.unitPrice?.toString() || '0',
    })
  }, [movement])

  const price = parseFloat(quantityPrice.priceStr)
  const quantity = parseFloat(quantityPrice.quantityStr)
  const plusQuantity = () => incrementQuantity(1)
  const minusQuantity = () => incrementQuantity(-1)
  const incrementQuantity = (increment: number) => {
    const q = parseInt(quantityPrice.quantityStr) + increment
    if (q < 0) return
    setQuantityPrice({ ...quantityPrice, quantityStr: q.toString() })
  }

  const handleUpdateQuantity = (quantityString: string) => {
    setQuantityPrice({ ...quantityPrice, quantityStr: quantityString })
  }
  const handleUpdatePrice = (unitPriceString: string) => {
    setQuantityPrice({ ...quantityPrice, priceStr: unitPriceString })
  }
  const subTotalNumber = quantity * price

  const handleConfirmEdit = () => {
    if (subTotalNumber > 0 && movement && movement.product) {
      const priceDetail = {
        id: movement.priceDetail?.id || '',
        name: movement.priceDetail?.name || '',
      }
      ctx.handleUpdateProductToCart(priceDetail, movement.product, quantity, price)
      ctx.handleProductSelected()()
    }
  }
  const visibleEdit = ctx.productSelected.mode === 'edit' && !!movement

  const subTotal = formatNumber(quantity * price)
  return (
    <Dialog
      doneProps={{
        mode: 'contained',
        compact: true,
        disabled: isNaN(subTotalNumber) || subTotalNumber <= 0,
      }}
      cancelCallback={ctx.handleProductSelected()}
      confirmCallback={handleConfirmEdit}
      title={`EDITAR:`}
      visible={visibleEdit}
      style={{ backgroundColor: '#fff' }}
    >
      <Text align="justify" marginBottom={16}>
        {ctx.productSelected?.movement?.priceDetail?.name}
      </Text>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        <View style={{ flex: 1 }}>
          <TextInput
            mode="outlined"
            dense
            label="Cant."
            value={quantityPrice.quantityStr}
            onChangeText={handleUpdateQuantity}
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
            value={quantityPrice.priceStr}
            onChangeText={handleUpdatePrice}
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
            value={isNaN(subTotalNumber) ? '0' : subTotal}
            left={<TextInput.Affix text={ctx.order?.currency.name} />}
          />
        </View>
      </View>
    </Dialog>
  )
}
export default ProductEditDialog
