import React from 'react'
import { View, TextInput, StyleSheet } from 'react-native'

interface Props {
  ingredient: {
    name: string
    amount: string
  }
  onChange: (field: 'name' | 'amount', value: string) => void
}

export default function IngredientInput({ ingredient, onChange }: Props) {
  return (
    <View style={styles.container}>
      <TextInput
        style={[styles.input, styles.nameInput]}
        value={ingredient.name}
        onChangeText={(value) => onChange('name', value)}
        placeholder="Ingredient name"
      />
      <TextInput
        style={[styles.input, styles.amountInput]}
        value={ingredient.amount}
        onChangeText={(value) => onChange('amount', value)}
        placeholder="Amount"
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: 8
  },
  input: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    fontSize: 16
  },
  nameInput: {
    flex: 2,
    marginRight: 8
  },
  amountInput: {
    flex: 1
  }
}) 