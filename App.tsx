import { PaperProvider } from 'react-native-paper'

import { DataProvider } from './src/hooks'
import AppNavigation from './src/navigation/App'

export default function App() {
  return (
    <PaperProvider>
      <DataProvider>
        <AppNavigation />
      </DataProvider>
    </PaperProvider>
  )
}
