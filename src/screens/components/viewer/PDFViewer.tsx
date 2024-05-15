import { Dimensions, StyleSheet } from 'react-native'
import Pdf from 'react-native-pdf'

import Text from '@components/Text'

const PDFViewer = () => {
  return (
    <Pdf
      trustAllCerts={false}
      source={{
        uri: 'https://www.orimi.com/pdf-test.pdf',
      }}
      style={styles.pdf}
      onLoadComplete={(numberOfPages, filePath) => {
        console.log(`number of pages: ${numberOfPages}`)
      }}
    />
  )
}
export default PDFViewer
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 25,
  },
  pdf: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
})
