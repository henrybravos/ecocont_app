import { Keyboard, TouchableWithoutFeedback, View } from 'react-native'
import { Button, ButtonProps, Dialog, DialogProps, Portal } from 'react-native-paper'

type DialogComponentProps = Omit<DialogProps, 'onDismiss'> & {
  title?: string
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
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{ paddingTop: 12 }}>
            {title && <Dialog.Title style={{ textAlign: 'justify' }}>{title}</Dialog.Title>}
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
          </View>
        </TouchableWithoutFeedback>
      </Dialog>
    </Portal>
  )
}

export default DialogComponent
