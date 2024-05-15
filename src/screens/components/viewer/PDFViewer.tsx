import * as Print from 'expo-print'
import * as Sharing from 'expo-sharing'
import { View } from 'moti'
import { useState } from 'react'
import { Dimensions, StyleSheet } from 'react-native'
import { IconButton } from 'react-native-paper'
import Pdf from 'react-native-pdf'

const PDFViewer = ({ uri }: { uri: string }) => {
  const [filePrint, setFilePrint] = useState('')
  const printPdf = () => {
    Print.printAsync({ uri: filePrint })
  }
  const sharePdf = async () => {
    await Sharing.shareAsync(filePrint, {
      dialogTitle: 'Comprabante de pago',
      mimeType: 'application/pdf',
      UTI: 'com.adobe.pdf',
    })
  }
  return (
    <View style={styles.container}>
      <View style={{ flexDirection: 'row' }}>
        {filePrint && <IconButton icon="printer" size={24} onPress={printPdf} />}
        {filePrint && <IconButton onPress={sharePdf} icon="export-variant" size={24} />}
      </View>
      <Pdf
        trustAllCerts={false}
        source={{
          uri,
          cache: true,
        }}
        scale={1.5}
        style={styles.pdf}
        onLoadComplete={(numberOfPages, filePath) => {
          setFilePrint(filePath)
          console.log(`number of pages: ${numberOfPages} ${filePath}`)
        }}
        onError={(error) => {
          console.log({ error })
        }}
      />
    </View>
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
