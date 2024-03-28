import { Icon } from 'react-native-paper'

import Block from '@components/Block'
import Text from '@components/Text'

import useTheme from '@hooks/useTheme'

type EmptyComponentProps = {
  message: string
  sizeIcon?: number
}
const EmptyComponent = ({ message, sizeIcon = 64 }: EmptyComponentProps) => {
  const theme = useTheme()
  return (
    <Block align="center" flex={1} height={theme.sizes.height - 150} center>
      <Icon color="grey" size={sizeIcon} source="information-outline" />
      <Text>{message}</Text>
    </Block>
  )
}
export default EmptyComponent
