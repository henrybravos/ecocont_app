import { useNavigation } from '@react-navigation/core'
import { DrawerActions } from '@react-navigation/native'
import { CardStyleInterpolators } from '@react-navigation/stack'
import { StackHeaderOptions } from '@react-navigation/stack/lib/typescript/src/types'
import React from 'react'
import { TouchableOpacity } from 'react-native'

import Block from '../components/Block'
import Button from '../components/Button'
import Image from '../components/Image'
import Text from '../components/Text'
import useTheme from '../hooks/useTheme'

export default () => {
  const navigation = useNavigation()
  const { gradients, sizes, icons, colors } = useTheme()

  const menu = {
    headerStyle: { elevation: 0 },
    headerTitleAlign: 'left',
    headerTitleContainerStyle: { marginLeft: -sizes.sm },
    headerLeftContainerStyle: { paddingLeft: sizes.s },
    headerRightContainerStyle: { paddingRight: sizes.s },
    cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
    headerTitle: ({ children }) => <Text marginHorizontal={4}>{children}</Text>,
    headerLeft: () => (
      <Button onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}>
        <Image source={icons.menu} radius={0} color={colors.icon} />
      </Button>
    ),
    headerRight: () => (
      <Block row flex={0} align="center" marginRight={sizes.padding}>
        <TouchableOpacity style={{ marginRight: sizes.sm }} onPress={() => {}}>
          <Block
            flex={0}
            right={0}
            width={sizes.s}
            height={sizes.s}
            radius={sizes.xs}
            position="absolute"
            gradient={gradients?.primary}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            navigation.dispatch(DrawerActions.jumpTo('Screens', { screen: 'Profile' }))
          }
        >
          <Image radius={6} width={24} height={24} source={{ uri: undefined }} />
        </TouchableOpacity>
      </Block>
    ),
  } as StackHeaderOptions

  const options = {
    stack: menu,
  }

  return options
}
