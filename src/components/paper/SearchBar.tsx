import { useState } from 'react'
import { Searchbar, SearchbarProps } from 'react-native-paper'

type SearchBarProps = SearchbarProps & {
  backgroundColor?: string
  onConfirmSearch: (text: string) => void
  height?: number
  margin?: number
  minHeightInput?: number
}
export default function SearchBarComponent({
  backgroundColor = 'white',
  height = 42,
  margin = 0,
  minHeightInput = 0,
  style,
  onChangeText,
  onConfirmSearch,
  ...rest
}: SearchBarProps) {
  const [timeoutCancel, setTimeoutCancel] = useState<NodeJS.Timeout | null>(null)
  const handleOnChangeText = (text: string) => {
    onChangeText && onChangeText(text)
    if (text.length === 0) {
      onConfirmSearch && onConfirmSearch(text)
      return
    }
    if (timeoutCancel) clearTimeout(timeoutCancel)
    setTimeoutCancel(
      setTimeout(() => {
        onConfirmSearch && onConfirmSearch(text)
      }, 750),
    )
  }

  return (
    <Searchbar
      {...rest}
      placeholder={'buscar...'}
      mode="view"
      style={[
        style,
        {
          height,
          backgroundColor,
          margin,
        },
      ]}
      inputStyle={{
        minHeight: minHeightInput,
      }}
      onChangeText={handleOnChangeText}
    />
  )
}
