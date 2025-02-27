import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

interface Props {
  message: string
  subMessage?: string
}

export default function EmptyState({ message, subMessage }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.message}>{message}</Text>
      {subMessage && <Text style={styles.subMessage}>{subMessage}</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20
  },
  message: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8
  },
  subMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center'
  }
}) 