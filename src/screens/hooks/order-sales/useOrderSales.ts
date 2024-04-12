import { RefObject, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Swipeable } from 'react-native-gesture-handler'

import OrderSalesService from '@core/graphql/OrderSalesService'
import ProductService from '@core/graphql/ProductService'
import { MovementOrder } from '@core/types/order-sales'
import { Product } from '@core/types/product'
import { AttentionPoint } from '@core/types/user'

import fetchApi from '@hooks/useFetchApi'

import { reduceSumMultiplyArray } from '@utils/scripts'

type ProductSelected = {
  mode?: 'edit' | 'delete'
  movement?: Partial<MovementOrder>
}
const useOrderSales = (point: AttentionPoint) => {
  const [products, setProducts] = useState<Product[]>([])
  const openSwipeProduct = useRef<Swipeable | null>(null)
  const [searchText, setSearchText] = useState<string>('')
  const [productSelected, setProductSelected] = useState<ProductSelected>({})
  const [isLoadingProductsTop, productsTop, fetchProductsTop] = fetchApi(
    ProductService.getTopProducts,
  )
  const [isLoadingProductsSearch, productsSearch, fetchProductsSearch] = fetchApi(
    ProductService.getSearchProducts,
  )
  const [isLoadingProductsCategory, productsCategory, fetchProductsByCategory] = fetchApi(
    ProductService.getCategoryProducts,
  )
  const [isLoadingCategories, categories, fetchCategories] = fetchApi(ProductService.getCategories)
  const [isLoadingOrderSales, order, fetchOrder] = fetchApi(OrderSalesService.getDetailUserActive)
  const [productOrders, setProductOrders] = useState<Partial<MovementOrder>[]>([])
  const [categoryIdSelected, setCategoryIdSelected] = useState<string>('TOP')

  useEffect(() => {
    if (point.orderId) fetchOrder({ orderId: point.orderId })
    if (point.id) {
      fetchProducts()
      fetchCategories()
    }
  }, [point.orderId])

  useEffect(() => {
    if (categoryIdSelected !== 'TOP') {
      fetchProductsByCategory({
        categoryId: categoryIdSelected,
      })
    }
  }, [categoryIdSelected])
  useEffect(() => {
    if (productsCategory) {
      setProducts(productsCategory)
    }
  }, [productsCategory])
  useEffect(() => {
    if (productsTop) {
      setProducts(productsTop)
    }
  }, [productsTop])
  useEffect(() => {
    if (productsSearch) {
      setProducts(productsSearch)
    }
  }, [productsSearch])
  useEffect(() => {
    if (order) {
      const movementsCopy = order.movementOrder?.map((m) => ({ ...m })) || []
      setProductOrders(movementsCopy)
    }
  }, [order])
  if (!point.id) return
  const fetchProducts = () => {
    if (searchText.trim().length === 0) {
      if (categoryIdSelected === 'TOP') {
        fetchProductsTop()
      } else {
        fetchProductsByCategory({
          categoryId: categoryIdSelected,
        })
      }
    } else {
      fetchProductsSearch({
        search: searchText,
      })
    }
  }
  const totalOrder = useMemo(
    () => reduceSumMultiplyArray(productOrders || [], 'unitPrice', 'quantity', 0),
    [productOrders],
  )
  const handleExistInCart = useCallback(
    (productId: string) => {
      return productOrders?.find((m) => m.priceDetail?.id === productId)
    },
    [productOrders],
  )
  const handleSearchProductApi = useCallback(
    (search: string) => {
      if (search.trim().length === 0) {
        if (categoryIdSelected === 'TOP') {
          setProducts(productsTop)
        } else {
          setProducts(productsCategory)
        }
      } else {
        fetchProductsSearch({ search })
      }
      setSearchText(search)
    },
    [fetchProductsSearch, productsTop, productsCategory],
  )
  const handleRemoveProductFromCart = useCallback(
    (productVariantId: string, quantityDecrease: number) => {
      const existIndex = productOrders.findIndex(
        (productOrder) => productOrder.priceDetail?.id === productVariantId,
      )
      if (existIndex >= 0) {
        const product = productOrders[existIndex]
        if ((product.quantity || 0) - quantityDecrease <= 0) {
          setProductOrders(productOrders.filter((p) => p.priceDetail?.id !== productVariantId))
        } else {
          const newProductOrders = [...productOrders]
          newProductOrders[existIndex].quantity =
            (newProductOrders[existIndex].quantity || 0) - quantityDecrease
          setProductOrders(newProductOrders)
        }
      }
    },
    [productOrders],
  )
  const handleUpdateProductToCart = useCallback(
    (
      priceDetails: {
        id: string
        name: string
      },
      product: Partial<Product>,
      quantity: number,
      unitPrice: number,
    ) => {
      const existIndex = productOrders.findIndex(
        (productOrder) => productOrder.priceDetail?.id === priceDetails.id,
      )
      if (existIndex >= 0) {
        const newProductOrders = [...productOrders]
        newProductOrders[existIndex].quantity = quantity
        newProductOrders[existIndex].unitPrice = unitPrice
        setProductOrders(newProductOrders)
      } else {
        const newItem = {
          product,
          priceDetail: {
            id: priceDetails.id || '',
            name: priceDetails.name || '',
          },
          quantity,
          unitPrice,
        }
        setProductOrders([...productOrders, newItem])
      }
    },
    [productOrders],
  )
  const isDisplayButtonConfirm = useMemo(() => {
    const movementStringExist = JSON.stringify(order?.movementOrder || [])
    const movementStringToSave = JSON.stringify(productOrders)
    return movementStringExist !== movementStringToSave
  }, [order?.movementOrder, productOrders])
  const handleSelectCategory = (categoryId: string) => () => {
    setCategoryIdSelected(categoryId)
    if (categoryId === 'TOP') {
      setProducts(productsTop)
    }
  }
  const handleProductSelected = useCallback(
    (mode?: 'edit' | 'delete', movement?: Partial<MovementOrder>) => () => {
      setProductSelected({ mode, movement })
      if (!mode && !movement) {
        openSwipeProduct?.current?.close()
      }
    },
    [],
  )
  const handleOpenProductCartActions = (swipeable: RefObject<Swipeable>) => {
    openSwipeProduct.current = swipeable.current
  }

  return {
    isLoadingProducts: isLoadingProductsTop || isLoadingProductsSearch || isLoadingProductsCategory,
    isLoadingCategories,
    isLoadingOrderSales,
    isDisplayButtonConfirm,
    order,
    point,
    products,
    totalOrder,
    categories,
    productOrders,
    categoryIdSelected,
    productSelected,
    searchText,

    handleExistInCart,
    handleSearchProductApi,
    handleUpdateProductToCart,
    handleRemoveProductFromCart,
    handleSelectCategory,
    handleProductSelected,
    fetchProducts,
    handleOpenProductCartActions,
  }
}

export default useOrderSales
