import React, { useState } from 'react'
import { View, Text, Modal, TouchableOpacity, StyleSheet, Slider } from 'react-native'
import { RecipeFilters } from '@/services/recipeService'

interface Props {
  visible: boolean
  onClose: () => void
  onApply: (filters: RecipeFilters) => void
}

export default function FilterModal({ visible, onClose, onApply }: Props) {
  const [cookingTime, setCookingTime] = useState<number>(60)
  const [servings, setServings] = useState<number>(4)

  const handleApply = () => {
    onApply({
      cookingTime,
      servings
    })
    onClose()
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Filter Recipes</Text>

          <View style={styles.filterSection}>
            <Text style={styles.label}>Cooking Time (minutes)</Text>
            <Slider
              value={cookingTime}
              onValueChange={setCookingTime}
              minimumValue={0}
              maximumValue={180}
              step={15}
            />
            <Text style={styles.value}>{cookingTime} minutes</Text>
          </View>

          <View style={styles.filterSection}>
            <Text style={styles.label}>Servings</Text>
            <Slider
              value={servings}
              onValueChange={setServings}
              minimumValue={1}
              maximumValue={12}
              step={1}
            />
            <Text style={styles.value}>{servings} servings</Text>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[styles.button, styles.cancelButton]} 
              onPress={onClose}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.button, styles.applyButton]} 
              onPress={handleApply}
            >
              <Text style={[styles.buttonText, styles.applyButtonText]}>Apply</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20
  },
  filterSection: {
    marginBottom: 20
  },
  label: {
    fontSize: 16,
    marginBottom: 8
  },
  value: {
    textAlign: 'center',
    color: '#666'
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20
  },
  button: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center'
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
    marginRight: 8
  },
  applyButton: {
    backgroundColor: '#FF6B6B',
    marginLeft: 8
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  applyButtonText: {
    color: '#fff'
  }
}) 