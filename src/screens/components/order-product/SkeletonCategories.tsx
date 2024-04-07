import { MotiView } from 'moti'
import { Skeleton } from 'moti/skeleton'
import { StyleSheet, View } from 'react-native'

export default function SkeletonCategories() {
  return (
    <MotiView
      transition={{
        type: 'timing',
      }}
      style={[styles.container]}
    >
      <Skeleton colorMode="light" radius={8} width={100} />
      <Skeleton colorMode="light" radius={8} width={50} />
      <Skeleton colorMode="light" radius={8} width={75} />
      <Skeleton colorMode="light" radius={8} width={100} />
    </MotiView>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    marginHorizontal: 8,
  },
})
