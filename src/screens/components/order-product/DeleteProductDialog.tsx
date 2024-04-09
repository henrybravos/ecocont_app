import Text from '@components/Text'
import { Dialog } from '@components/paper'

import { useOrderSalesContext } from '@screens/hooks/order-sales/order-context'

const DeleteProductDialog = () => {
  const ctx = useOrderSalesContext()
  const movement = ctx.productSelected.movement
  const confirmDelete = () => {
    if (movement?.priceDetail?.id) {
      const allDecrease = movement.quantity || 1
      ctx.handleRemoveProductFromCart(movement.priceDetail?.id, allDecrease)
      ctx.handleProductSelected()()
    }
  }
  const visibleDelete = ctx.productSelected.mode === 'delete' && !!ctx.productSelected?.movement

  return (
    <Dialog
      doneProps={{
        mode: 'contained',
        compact: true,
      }}
      cancelCallback={ctx.handleProductSelected()}
      confirmCallback={confirmDelete}
      title="¿Está seguro?"
      visible={visibleDelete}
    >
      <Text align="justify" bold>
        Usted desea eliminar el producto:
      </Text>
      <Text align="justify" bold marginTop={16}>
        {movement?.priceDetail?.name}
      </Text>
    </Dialog>
  )
}
export default DeleteProductDialog
