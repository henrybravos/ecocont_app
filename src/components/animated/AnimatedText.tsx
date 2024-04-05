import { MotiView } from 'moti'
import { useEffect, useState } from 'react'

import Text from '@components/Text'

type AnimatedLabelProps = {
  label: string
  timeout?: number
}
const AnimatedText = ({ timeout = 100, label }: AnimatedLabelProps) => {
  const [animated, setAnimated] = useState(true)
  useEffect(() => {
    setAnimated(false)
    setTimeout(() => setAnimated(true), timeout)
  }, [label])
  return (
    <>
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
          <Text bold>{label}</Text>
        </MotiView>
      )}
    </>
  )
}
export default AnimatedText
