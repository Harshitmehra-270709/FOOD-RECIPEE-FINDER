import React from 'react'
import { Text } from 'react-native'

interface IconProps {
  name: string
  size: number
  color: string
}

export default function Icon({ name, size, color }: IconProps) {
  // This is a placeholder. In a real app, you'd use a proper icon library
  // like @expo/vector-icons or react-native-vector-icons
  return <Text style={{ fontSize: size, color }}>●</Text>
} 