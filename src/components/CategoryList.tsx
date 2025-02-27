import React, { useState, useEffect } from 'react'
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  StyleSheet,
  Animated 
} from 'react-native'
import { Category, categoryService } from '@/services/categoryService'

interface Props {
  onSelectCategory: (categoryId: string) => void
}

export default function CategoryList({ onSelectCategory }: Props) {
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const scaleAnim = new Animated.Value(1)

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    try {
      const data = await categoryService.getCategories()
      setCategories(data)
    } catch (error) {
      console.error('Error loading categories:', error)
    }
  }

  const handlePress = (categoryId: string) => {
    setSelectedId(categoryId)
    onSelectCategory(categoryId)
    
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true
      })
    ]).start()
  }

  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      style={styles.container}
    >
      {categories.map(category => (
        <Animated.View
          key={category.id}
          style={[
            styles.categoryContainer,
            { transform: [{ scale: scaleAnim }] }
          ]}
        >
          <TouchableOpacity
            style={[
              styles.category,
              selectedId === category.id && styles.selectedCategory
            ]}
            onPress={() => handlePress(category.id)}
          >
            <Image 
              source={{ uri: category.image_url }} 
              style={styles.categoryImage}
            />
            <Text style={styles.categoryName}>{category.name}</Text>
          </TouchableOpacity>
        </Animated.View>
      ))}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16
  },
  categoryContainer: {
    marginRight: 12
  },
  category: {
    alignItems: 'center',
    padding: 8,
    borderRadius: 12,
    backgroundColor: '#f5f5f5'
  },
  selectedCategory: {
    backgroundColor: '#FFE3E3'
  },
  categoryImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 8
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '500'
  }
}) 