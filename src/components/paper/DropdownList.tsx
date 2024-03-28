import { useEffect, useState } from 'react'
import { Button, Menu } from 'react-native-paper'

export type OptionSelected = {
  id: string
  label: string
}
type DropdownListProps<T> = {
  items: T[]
  placeholder?: string
  keyRender: keyof T
  autoClose?: boolean
  keyIdRender: keyof T
  itemSelected?: T | null
  callbackSelectedItem: (item: T | null) => void
}
function DropdownList<T>({
  items = [],
  keyIdRender,
  keyRender,
  itemSelected,
  autoClose = true,
  placeholder = 'Select item',
  callbackSelectedItem = () => {},
}: DropdownListProps<T>) {
  const [openMenu, setOpenMenu] = useState(false)
  const toggleOpenMenu = () => setOpenMenu((prev) => !prev)
  const handleItemSelected = (item: T | null) => () => {
    callbackSelectedItem(item)
    if (item && autoClose) {
      setOpenMenu(false)
    }
  }
  return (
    <Menu
      visible={openMenu}
      onDismiss={toggleOpenMenu}
      anchorPosition="bottom"
      anchor={
        <Button
          mode="elevated"
          onPress={toggleOpenMenu}
          icon={openMenu ? 'chevron-up' : 'chevron-down'}
          compact
        >
          {(itemSelected?.[keyRender] as string) || placeholder}
        </Button>
      }
    >
      {items.map((item) => (
        <Menu.Item
          key={item[keyIdRender] as string}
          onPress={handleItemSelected(item)}
          title={item[keyRender] as string}
        />
      ))}
    </Menu>
  )
}
export default DropdownList
