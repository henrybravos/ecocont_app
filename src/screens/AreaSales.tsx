import { useNavigation } from '@react-navigation/native'
import { CommonActions } from '@react-navigation/native'
import { StatusBar } from 'expo-status-bar'
import { useEffect, useState } from 'react'
import { StyleSheet, TouchableHighlight, View } from 'react-native'
import { FlatList } from 'react-native-gesture-handler'
import { Button, Icon, ProgressBar } from 'react-native-paper'

import Block from '@components/Block'
import Text from '@components/Text'
import { DropdownList } from '@components/paper'

import { salesAttentionPointAdapter } from '@core/adapters/sales.adapter'
import UserSalesService from '@core/graphql/UserSalesService'
import { AttentionPoint, Checkout, SalesArea } from '@core/types/user'

import { useFetchApi } from '@hooks/index'
import useTheme from '@hooks/useTheme'

import { COLORS } from '@constants/light'
import { SCREENS, StackNavigation } from '@constants/types/navigation'

import SkeletonAttentionPoints from './components/attention-points/SkeletonAttentionPoints'

type AttentionPointComponentProps = { point: AttentionPoint; checkout: Checkout }
const AttentionPointComponent = ({ point, checkout }: AttentionPointComponentProps) => {
  const theme = useTheme()
  const navigation = useNavigation<StackNavigation>()
  const isOccupied = !!point.orderId
  const styleStatus = isOccupied ? styles.pointOccupied : styles.pointAvailable
  const icon = !isOccupied ? 'circle-outline' : 'circle-slice-8'
  const navigateToOrder = () => {
    navigation.navigate(SCREENS.ORDER_SALES, { point, checkout, area: { id: point.areaId } })
  }
  const navigateToCheckout = () => {
    navigation.navigate(SCREENS.CHECKPOINT, { point, checkout, area: { id: point.areaId } })
  }
  return (
    <Block
      key={point.id}
      margin={theme.sizes.s}
      card
      color={styleStatus.backgroundColor}
      style={[{ height: theme.sizes.height / 5 }, styleStatus, styles.itemAttention]}
      center
      align="center"
      justify="center"
    >
      <Text color="grey" h5 bold>
        {point.description?.toUpperCase()}
      </Text>
      <Icon color={styleStatus.color} source={icon} size={42} />
      <View style={{ flexDirection: 'row' }}>
        <Button mode="elevated" onPress={navigateToOrder}>
          PEDIDO
        </Button>
        {checkout && !!point?.orderId && (
          <Button onPress={navigateToCheckout} mode="elevated">
            CAJA
          </Button>
        )}
      </View>
    </Block>
  )
}

const AreaSales = () => {
  const navigation = useNavigation<StackNavigation>()

  const [checkoutSelected, setCheckoutSelected] = useState<Checkout | null>(null)
  const [areaSelected, setAreaSelected] = useState<SalesArea | null>(null)
  const [attentionPoints, setAttentionPoints] = useState<AttentionPoint[]>([])
  const [isLoadingPoints, attentionPointsResponse, fetchAttentionPoints] = useFetchApi(
    UserSalesService.getAttentionPoints,
  )
  const [isLoadingUser, userSales, fetchUserDetail] = useFetchApi(
    UserSalesService.getDetailUserActive,
  )
  useEffect(() => {
    setAttentionPoints(attentionPointsResponse ?? [])
  }, [attentionPointsResponse])
  useEffect(() => {
    if (!areaSelected || !areaSelected.id) return
    //console.log('areaSelected', areaSelected.id)
    const subscription = UserSalesService.subscriptionPointSaleByZone({
      areaId: areaSelected?.id || '',
    }).subscribe({
      next: (stream) => {
        //console.log('stream', stream.data?.updateMesaByZona)
        if (stream.data?.updateMesaByZona) {
          const attentionPoint = salesAttentionPointAdapter(stream.data.updateMesaByZona)
          attentionPoint.areaId = areaSelected.id
          const newAttentionPoints = attentionPoints.map((att) =>
            att.id === attentionPoint.id ? attentionPoint : att,
          )
          setAttentionPoints(newAttentionPoints)
        }
      },
      error: (error) => {
        //console.log('error', error)
      },
      start: (dd) => {
        //console.log('start', dd)
      },
      complete() {
        //console.log('complete')
      },
    })
    return () => {
      subscription.unsubscribe()
    }
  }, [areaSelected?.id, attentionPoints])

  useEffect(() => {
    fetchUserDetail()
  }, [])
  useEffect(() => {
    if (userSales && userSales.checkouts.length > 0) {
      setCheckoutSelected(userSales.checkouts[0])
    } else {
      setCheckoutSelected(null)
    }
    if (userSales && userSales.areas.length > 0) {
      setAreaSelected(userSales.areas[0])
    } else {
      setAreaSelected(null)
    }
  }, [userSales?.checkouts.length])
  useEffect(() => {
    if (checkoutSelected && checkoutSelected.areas.length > 0) {
      setAreaSelected(checkoutSelected.areas[0])
    } else {
      setAreaSelected(null)
    }
  }, [checkoutSelected])

  useEffect(() => {
    if (areaSelected && areaSelected.id) {
      fetchAttentionPoints({
        areaId: areaSelected.id,
      })
    }
  }, [areaSelected])

  const handleCheckoutSelected = (checkout: Checkout | null) => {
    setCheckoutSelected(checkout)
  }
  const handleAreaSelected = (area: SalesArea | null) => {
    setAreaSelected(area)
  }
  const renderAttentionPoint = ({ item }: { item: AttentionPoint }) => (
    <AttentionPointComponent point={item} checkout={checkoutSelected!} />
  )
  const navigateToOrderWithoutPoint = () => {
    //console.log('checkoutSelected', checkoutSelected)
    if (!checkoutSelected || !areaSelected) return
    navigation.navigate(SCREENS.ORDER_SALES, {
      checkout: checkoutSelected,
      area: areaSelected,
      point: undefined,
    })
  }
  const checkouts = userSales?.checkouts || []
  const isCashier = !!userSales?.areas.length
  const areas = isCashier ? userSales?.areas || [] : checkoutSelected?.areas || []

  const isLoading = isLoadingUser || isLoadingPoints
  if (isLoading) return <SkeletonAttentionPoints />
  const enableButtonToOrder = attentionPoints.length === 0 && !!checkoutSelected?.id
  return (
    <Block marginVertical={4} justify="flex-start">
      <StatusBar style="dark" />
      <Block row flex={0} marginVertical={8}>
        {isLoading && <ProgressBar indeterminate visible={isLoading} />}
        {checkouts.length > 0 && (
          <Block>
            <DropdownList
              items={checkouts}
              keyIdRender="id"
              keyRender="description"
              placeholder="Selecciona una caja"
              callbackSelectedItem={handleCheckoutSelected}
              itemSelected={checkoutSelected}
            />
          </Block>
        )}

        {areas.length > 0 && (
          <Block>
            <DropdownList
              items={areas}
              keyIdRender="id"
              keyRender="description"
              placeholder="Selecciona una área/zona"
              callbackSelectedItem={handleAreaSelected}
              itemSelected={areaSelected}
            />
          </Block>
        )}
      </Block>
      {enableButtonToOrder && (
        <Button
          buttonColor={COLORS.success.toString()}
          onPress={navigateToOrderWithoutPoint}
          mode="contained"
        >
          IR A ORDENAR
        </Button>
      )}

      <FlatList
        data={attentionPoints || []}
        columnWrapperStyle={styles.listAttention}
        numColumns={2}
        renderItem={renderAttentionPoint}
      />
    </Block>
  )
}
export default AreaSales

const styles = StyleSheet.create({
  listAttention: {
    flex: 1,
    justifyContent: 'space-around',
  },
  itemAttention: {
    flexGrow: 0,
    flexShrink: 1,
    flexBasis: '50%',
  },
  pointOccupied: {
    backgroundColor: COLORS.card.toString(),
    color: COLORS.danger.toString(),
  },
  pointAvailable: {
    backgroundColor: COLORS.card.toString(),
    color: COLORS.success.toString(),
  },
})
