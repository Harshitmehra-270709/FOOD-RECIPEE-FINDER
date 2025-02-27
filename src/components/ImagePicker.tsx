import React from 'react'
import { View, Image, TouchableOpacity, Text, StyleSheet } from 'react-native'
import * as ImagePickerExpo from 'expo-image-picker'

interface Props {
  onImageSelected: (uri: string | null) => void
}

export default function ImagePicker({ onImageSelected }: Props) {
  const pickImage = async () => {
    const result = await ImagePickerExpo.launchImageLibraryAsync({
      mediaTypes: ImagePickerExpo.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8
    })

    if (!result.canceled) {
      onImageSelected(result.assets[0].uri)
    }
  }

  return (
    <TouchableOpacity style={styles.container} onPress={pickImage}>
      <View style={styles.placeholder}>
        <Text style={styles.placeholderText}>Tap to add recipe photo</Text>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16
  },
  placeholder: {
    backgroundColor: '#f5f5f5',
    height: 200,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center'
  },
  placeholderText: {
    color: '#666',
    fontSize: 16
  }
}) 