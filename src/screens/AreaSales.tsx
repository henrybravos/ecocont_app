import { ParamListBase, useNavigation } from '@react-navigation/native'
import { useEffect, useState } from 'react'
import { StyleSheet, TouchableHighlight } from 'react-native'
import { FlatList } from 'react-native-gesture-handler'
import { Icon } from 'react-native-paper'

import Block from '@components/Block'
import EmptyComponent from '@components/EmptyComponent'
import SkeletonAttentionPoints from '@components/SkeletonAttentionPoints'
import Text from '@components/Text'
import { DropdownList } from '@components/paper'

import UserSalesService from '@core/graphql/UserSalesService'
import { AttentionPoint, Checkout, SalesArea, UserSales } from '@core/types/user'

import useTheme from '@hooks/useTheme'

import { SCREENS } from '@constants/screens'

import { type StackNavigation } from '../navigation/Screens'

const AttentionPointComponent = ({ point }: { point: AttentionPoint }) => {
  const theme = useTheme()
  const { navigate } = useNavigation<StackNavigation>()
  const isOccupied = !!point.orderId
  const styleStatus = isOccupied ? styles.pointOccupied : styles.pointAvailable
  const icon = !isOccupied ? 'circle-outline' : 'circle-slice-8'
  const navigateToOrder = () => {
    navigate(SCREENS.ORDER_SALES, point)
  }
  return (
    <TouchableHighlight
      underlayColor={styleStatus.backgroundColor}
      onPress={navigateToOrder}
      style={styles.itemAttention}
    >
      <Block
        key={point.id}
        margin={theme.sizes.s}
        card
        color={styleStatus.backgroundColor}
        style={[{ height: theme.sizes.height / 5 }, styleStatus]}
        center
        align="center"
      >
        <Text color="grey" h5 bold>
          {point.description?.toUpperCase()}
        </Text>
        <Icon color={styleStatus.color} source={icon} size={42} />
      </Block>
    </TouchableHighlight>
  )
}
const AreaSales = () => {
  const [userSales, setUserSales] = useState<UserSales | null>(null)
  const [checkoutSelected, setCheckoutSelected] = useState<Checkout | null>(null)
  const [areaSelected, setAreaSelected] = useState<SalesArea | null>(null)
  const [attentionPoints, setAttentionPoints] = useState<AttentionPoint[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUserSales()
  }, [])

  useEffect(() => {
    if (userSales && userSales.checkouts.length > 0) {
      setCheckoutSelected(userSales.checkouts[0])
    } else {
      setCheckoutSelected(null)
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
      fetchAttentionSales(areaSelected.id)
    }
  }, [areaSelected])

  const fetchUserSales = async () => {
    setLoading(true)
    const userSales = await UserSalesService.getDetailUserActive()
    if (userSales) {
      setUserSales(userSales)
    }
    setLoading(false)
  }

  const fetchAttentionSales = async (areaId: string) => {
    setLoading(true)
    const points = await UserSalesService.getAttentionPoints(areaId)
    if (points) {
      setAttentionPoints(points)
    }
    setLoading(false)
  }

  const handleCheckoutSelected = (checkout: Checkout | null) => {
    setCheckoutSelected(checkout)
  }
  const handleAreaSelected = (area: SalesArea | null) => {
    setAreaSelected(area)
  }
  const renderPint = ({ item }: { item: AttentionPoint }) => (
    <AttentionPointComponent point={item} />
  )
  const checkouts = userSales?.checkouts || []
  const isCashier = !!userSales?.areas.length
  const areas = isCashier ? userSales?.areas || [] : checkoutSelected?.areas || []
  return (
    <Block marginVertical={4} justify="flex-start">
      <Block row flex={0} marginVertical={4}>
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
      {!loading ? (
        <FlatList
          data={attentionPoints || []}
          columnWrapperStyle={styles.listAttention}
          numColumns={2}
          renderItem={renderPint}
          ListEmptyComponent={
            <EmptyComponent
              message={`No existen puntos de atención ${areaSelected?.description && `en ${areaSelected.description}`}`}
            />
          }
        />
      ) : (
        <SkeletonAttentionPoints />
      )}
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
    backgroundColor: '#ffd3eb',
    color: '#fd5e5e',
  },
  pointAvailable: {
    backgroundColor: '#d3ffde',
    color: '#5efd83',
  },
})