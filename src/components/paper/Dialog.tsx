import { Button, ButtonProps, Dialog, DialogProps, Portal } from 'react-native-paper'

type DialogComponentProps = DialogProps & {
  title: string
  labelCancel?: string
  labelDone?: string
  doneProps?: Omit<ButtonProps, 'children'>
  cancelProps?: Omit<ButtonProps, 'children'>
  cancelCallback?: () => void
  confirmCallback?: () => void
}
const DialogComponent = ({
  title,
  labelCancel,
  labelDone,
  cancelCallback,
  confirmCallback,
  doneProps,
  cancelProps,
  children,
  ...rest
}: DialogComponentProps) => {
  return (
    <Portal>
      <Dialog {...rest} onDismiss={cancelCallback}>
        <Dialog.Title style={{ textAlign: 'justify' }}>{title}</Dialog.Title>
        <Dialog.Content>{children}</Dialog.Content>
        <Dialog.Actions>
          {cancelCallback && (
            <Button {...cancelProps} onPress={cancelCallback}>
              {labelCancel || 'Cancelar'}
            </Button>
          )}
          {confirmCallback && (
            <Button {...doneProps} onPress={confirmCallback}>
              {labelDone || 'Confirmar'}
            </Button>
          )}
        </Dialog.Actions>
      </Dialog>
    </Portal>
  )
}

export default DialogComponent
