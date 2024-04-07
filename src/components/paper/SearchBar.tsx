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
  onConfirmSearch,
  ...rest
}: Omit<SearchBarProps, 'value' | 'onChangeText'>) {
  const [searchQuery, setSearchQuery] = useState('')

  const [timeoutCancel, setTimeoutCancel] = useState<NodeJS.Timeout | null>(null)
  const handleOnChangeText = (text: string) => {
    setSearchQuery(text)
    if (timeoutCancel) clearTimeout(timeoutCancel)
    if (text.length === 0) {
      onConfirmSearch && onConfirmSearch(text)
      return
    }
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
      value={searchQuery}
      onChangeText={handleOnChangeText}
    />
  )
}
