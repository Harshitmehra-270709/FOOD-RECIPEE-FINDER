import React from 'react'
import { Animated, StyleSheet, View, TouchableOpacity } from 'react-native'
import Icon from '@/components/Icon'
import { useNavigation } from '@react-navigation/native'

interface Props {
  scrollY: Animated.Value
  title: string
  showBackButton?: boolean
}

export default function AnimatedHeader({ scrollY, title, showBackButton }: Props) {
  const navigation = useNavigation()
  const headerHeight = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [120, 70],
    extrapolate: 'clamp'
  })

  const titleOpacity = scrollY.interpolate({
    inputRange: [0, 50, 100],
    outputRange: [0, 0.5, 1],
    extrapolate: 'clamp'
  })

  return (
    <Animated.View style={[styles.header, { height: headerHeight }]}>
      <View style={styles.headerContent}>
        {showBackButton && (
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
        )}
        <Animated.Text style={[styles.title, { opacity: titleOpacity }]}>
          {title}
        </Animated.Text>
      </View>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#fff',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  headerContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 16,
    paddingBottom: 12
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: showBackButton ? 16 : 0
  }
}) 