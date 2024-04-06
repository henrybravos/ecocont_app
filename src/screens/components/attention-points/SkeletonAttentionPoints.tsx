import { MotiView } from 'moti'
import { Skeleton } from 'moti/skeleton'
import { StyleSheet, View } from 'react-native'
import { FlatList } from 'react-native-gesture-handler'

import useTheme from '@hooks/useTheme'

const Spacer = ({ height = 16 }) => <MotiView style={{ height }} />
export default function SkeletonAttentionPoints() {
  const theme = useTheme()
  return (
    <MotiView
      transition={{
        type: 'timing',
      }}
      style={[styles.container, styles.padded]}
    >
      <FlatList
        data={[1, 2, 3, 4, 5]}
        numColumns={2}
        columnWrapperStyle={{
          flex: 1,
          justifyContent: 'space-around',
        }}
        renderItem={({ item }) => (
          <View
            style={{
              flexGrow: 0,
              flexShrink: 1,
              flexBasis: '50%',
              height: theme.sizes.height / 5,
              margin: 8,
            }}
            key={item}
          >
            <Skeleton colorMode="light" radius={8} height={theme.sizes.height / 5} width={'100%'} />
            <Spacer />
          </View>
        )}
      />
    </MotiView>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  padded: {
    padding: 16,
  },
})
