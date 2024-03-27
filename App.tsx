import { DataProvider } from './src/hooks'
import AppNavigation from './src/navigation/App'

export default function App() {
  return (
    <DataProvider>
      <AppNavigation />
    </DataProvider>
  )
}
