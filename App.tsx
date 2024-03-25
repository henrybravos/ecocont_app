import { StyleSheet } from 'react-native'

import { DataProvider } from './src/hooks'
import AppNavigation from './src/navigation/App'

export default function App() {
  return (
    <DataProvider>
      <AppNavigation />
    </DataProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
