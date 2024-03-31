import { MotiView } from 'moti'
import { useEffect, useState } from 'react'

import Block from '@components/Block'
import Text from '@components/Text'

const QuantityItems = ({ quantity = 0 }: { quantity: number }) => {
  const [animated, setAnimated] = useState(true)
  useEffect(() => {
    setAnimated(false)
    setTimeout(() => setAnimated(true), 100)
  }, [quantity])
  return (
    <Block row>
      <Text bold h5>
        (
      </Text>
      {animated && (
        <MotiView
          from={{
            translateY: 10,
            scale: 1.2,
          }}
          animate={{
            translateY: 0,
            scale: 1,
          }}
        >
          <Text bold h5>
            {quantity}
          </Text>
        </MotiView>
      )}
      <Text bold h5>
        ) en lista
      </Text>
    </Block>
  )
}
export default QuantityItems
