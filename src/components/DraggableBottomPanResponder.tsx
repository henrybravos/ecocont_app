import { useRef, useState } from 'react'
import {
  Animated,
  Dimensions,
  PanResponder,
  Platform,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native'

const WINDOW_HEIGHT = Dimensions.get('window').height
const WINDOW_WIDTH = Dimensions.get('window').width

const BOTTOM_SHEET_MAX_HEIGHT = WINDOW_HEIGHT * 0.8
export const BOTTOM_SHEET_MIN_HEIGHT = WINDOW_HEIGHT * 0.065
const MAX_UPWARD_TRANSLATE_Y = BOTTOM_SHEET_MIN_HEIGHT - BOTTOM_SHEET_MAX_HEIGHT // negative number;
const MAX_DOWNWARD_TRANSLATE_Y = 0
const DRAG_THRESHOLD = 50
type DraggableBottomPanResponderProps = {
  children?: React.ReactNode
}
const DraggableBottomPanResponder = ({ children }: DraggableBottomPanResponderProps) => {
  const animatedValue = useRef(new Animated.Value(0)).current
  const lastGestureDy = useRef(0)
  const [isHiddenBottom, setIsHiddenBottom] = useState(false)

  const bottomSheetAnimation = {
    transform: [
      {
        translateY: animatedValue.interpolate({
          inputRange: [MAX_UPWARD_TRANSLATE_Y, MAX_DOWNWARD_TRANSLATE_Y],
          outputRange: [MAX_UPWARD_TRANSLATE_Y, MAX_DOWNWARD_TRANSLATE_Y],
          extrapolate: 'clamp',
        }),
      },
    ],
  }
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => {
        return true
      },
      onPanResponderGrant: () => {
        animatedValue.setOffset(lastGestureDy.current)
      },
      onPanResponderMove: (e, gesture) => {
        animatedValue.setValue(gesture.dy)
      },
      onPanResponderRelease: (e, gesture) => {
        animatedValue.flattenOffset()
        lastGestureDy.current += gesture.dy
        if (gesture.dy > 0) {
          if (gesture.dy <= DRAG_THRESHOLD) {
            springAnimation('up')
          } else {
            springAnimation('down')
          }
        } else {
          if (gesture.dy >= -DRAG_THRESHOLD) {
            springAnimation('down')
          } else {
            springAnimation('up')
          }
        }
      },
    }),
  ).current
  const springAnimation = (direction: 'up' | 'down') => {
    lastGestureDy.current = direction === 'down' ? MAX_DOWNWARD_TRANSLATE_Y : MAX_UPWARD_TRANSLATE_Y
    setIsHiddenBottom(direction === 'up')
    Animated.spring(animatedValue, {
      toValue: lastGestureDy.current,
      useNativeDriver: true,
    }).start()
  }
  return (
    <View style={isHiddenBottom ? styles.containerAbsolute : styles.containerRelative}>
      {isHiddenBottom && (
        <TouchableWithoutFeedback onPress={() => springAnimation('down')} style={styles.overlay}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>
      )}
      <Animated.View style={[styles.bottomSheet, bottomSheetAnimation]}>
        <View style={styles.draggableArea} {...panResponder.panHandlers}>
          <View style={styles.dragHandle} />
        </View>
        {children}
      </Animated.View>
    </View>
  )
}
export default DraggableBottomPanResponder
const styles = StyleSheet.create({
  containerRelative: {
    flex: 0,
    backgroundColor: 'transparent',
    position: 'relative',
  },
  containerAbsolute: {
    backgroundColor: 'transparent',
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  overlay: {
    backgroundColor: '#000',
    opacity: 0.5,
    position: 'absolute',
    top: 0,
    width: '100%',
    height: '100%',
  },
  bottomSheet: {
    position: 'absolute',
    width: '100%',
    height: BOTTOM_SHEET_MAX_HEIGHT,
    bottom: BOTTOM_SHEET_MIN_HEIGHT - BOTTOM_SHEET_MAX_HEIGHT,
    ...Platform.select({
      android: { elevation: 3 },
      ios: {
        shadowColor: '#a8bed2',
        shadowOpacity: 1,
        shadowRadius: 6,
        shadowOffset: {
          width: 2,
          height: 2,
        },
      },
    }),
    backgroundColor: 'white',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
  },
  draggableArea: {
    width: 132,
    height: 64,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: -16,
    right: WINDOW_WIDTH / 2 - 132 / 2,
    zIndex: 9000,
  },
  dragHandle: {
    width: 100,
    height: 6,
    backgroundColor: '#d3d3d3',
    borderRadius: 10,
  },
})
