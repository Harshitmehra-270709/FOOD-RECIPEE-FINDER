import React, { useState } from 'react'
import { View, Text, ScrollView, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useApp } from '@/context/AppContext'
import IngredientInput from '@/components/IngredientInput'
import ImagePicker from '@/components/ImagePicker'
import { supabase } from '@/lib/supabase'
import { colors, spacing, typography } from '@/styles/theme'
import { Platform } from 'react-native'

interface Ingredient {
  name: string
  amount: string
}

export default function CreateRecipeScreen() {
  const navigation = useNavigation()
  const { user } = useApp()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [instructions, setInstructions] = useState('')
  const [ingredients, setIngredients] = useState<Ingredient[]>([{ name: '', amount: '' }])
  const [cookingTime, setCookingTime] = useState('')
  const [servings, setServings] = useState('')
  const [imageUri, setImageUri] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleAddIngredient = () => {
    setIngredients([...ingredients, { name: '', amount: '' }])
  }

  const handleIngredientChange = (index: number, field: keyof Ingredient, value: string) => {
    const newIngredients = [...ingredients]
    newIngredients[index][field] = value
    setIngredients(newIngredients)
  }

  const handleSubmit = async () => {
    if (!title || !description || !instructions || ingredients.length === 0) {
      Alert.alert('Error', 'Please fill in all required fields')
      return
    }

    setLoading(true)
    try {
      let imageUrl = null
      if (imageUri) {
        const file = await fetch(imageUri)
        const blob = await file.blob()
        const fileName = `recipe-${Date.now()}`
        const { data, error } = await supabase.storage
          .from('recipe-images')
          .upload(fileName, blob)
        
        if (error) throw error
        imageUrl = data.path
      }

      const { data, error } = await supabase
        .from('recipes')
        .insert({
          user_id: user!.id,
          title,
          description,
          instructions,
          ingredients,
          cooking_time: parseInt(cookingTime),
          servings: parseInt(servings),
          image_url: imageUrl
        })
        .select()
        .single()

      if (error) throw error

      Alert.alert('Success', 'Recipe created successfully')
      navigation.goBack()
    } catch (error) {
      console.error('Error creating recipe:', error)
      Alert.alert('Error', 'Failed to create recipe')
    } finally {
      setLoading(false)
    }
  }

  return (
    <ScrollView style={styles.container}>
      <ImagePicker onImageSelected={setImageUri} />
      
      <View style={styles.header}>
        <Text style={styles.title}>Create Recipe</Text>
      </View>

      <View style={styles.formSection}>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="Recipe Title"
        />

        <TextInput
          style={styles.input}
          value={description}
          onChangeText={setDescription}
          placeholder="Description"
          multiline
        />

        <Text style={styles.sectionTitle}>Ingredients</Text>
        {ingredients.map((ingredient, index) => (
          <IngredientInput
            key={index}
            ingredient={ingredient}
            onChange={(field, value) => handleIngredientChange(index, field, value)}
          />
        ))}
        <TouchableOpacity style={styles.addButton} onPress={handleAddIngredient}>
          <Text style={styles.addButtonText}>Add Ingredient</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.formSection}>
        <TextInput
          style={[styles.input, styles.instructionsInput]}
          value={instructions}
          onChangeText={setInstructions}
          placeholder="Instructions"
          multiline
        />
      </View>

      <View style={styles.row}>
        <TextInput
          style={[styles.input, styles.halfInput]}
          value={cookingTime}
          onChangeText={setCookingTime}
          placeholder="Cooking Time (mins)"
          keyboardType="numeric"
        />
        <TextInput
          style={[styles.input, styles.halfInput]}
          value={servings}
          onChangeText={setServings}
          placeholder="Servings"
          keyboardType="numeric"
        />
      </View>

      <TouchableOpacity 
        style={[styles.submitButton, loading && styles.disabledButton]}
        onPress={handleSubmit}
        disabled={loading}
      >
        <Text style={styles.submitButtonText}>
          {loading ? 'Creating...' : 'Create Recipe'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.large,
  },
  header: {
    marginBottom: spacing.large,
  },
  title: {
    fontSize: typography.h1,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.medium,
  },
  formSection: {
    marginBottom: spacing.large,
  },
  sectionTitle: {
    fontSize: typography.h3,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.medium,
  },
  input: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: spacing.medium,
    fontSize: typography.body,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.gray[200],
    marginBottom: spacing.medium,
  },
  instructionsInput: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    gap: spacing.medium,
    marginBottom: spacing.medium,
  },
  halfInput: {
    flex: 1,
  },
  addButton: {
    backgroundColor: colors.primary + '15',
    borderRadius: 12,
    padding: spacing.medium,
    alignItems: 'center',
    marginBottom: spacing.large,
    borderWidth: 1,
    borderColor: colors.primary,
    borderStyle: 'dashed',
  },
  addButtonText: {
    color: colors.primary,
    fontSize: typography.body,
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: spacing.medium,
    alignItems: 'center',
    marginTop: spacing.large,
    ...Platform.select({
      ios: {
        shadowColor: colors.text,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  disabledButton: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: colors.white,
    fontSize: typography.body,
    fontWeight: '600',
  },
  ingredientsList: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: spacing.medium,
    marginBottom: spacing.medium,
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.medium,
    gap: spacing.medium,
  },
  ingredientInput: {
    flex: 1,
    backgroundColor: colors.gray[100],
    borderRadius: 8,
    padding: spacing.small,
    fontSize: typography.body,
    color: colors.text,
  },
  removeIngredientButton: {
    padding: spacing.small,
    backgroundColor: colors.error + '15',
    borderRadius: 8,
  },
  removeIngredientText: {
    color: colors.error,
    fontSize: typography.body,
    fontWeight: '600',
  },
}) 