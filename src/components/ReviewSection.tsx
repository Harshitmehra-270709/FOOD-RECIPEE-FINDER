import React, { useState } from 'react'
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  FlatList, 
  StyleSheet,
  Alert 
} from 'react-native'
import { useApp } from '@/context/AppContext'
import { supabase } from '@/lib/supabase'
import StarRating from '@/components/StarRating'

interface Review {
  id: string
  user_id: string
  recipe_id: string
  rating: number
  comment: string
  created_at: string
  user: {
    email: string
  }
}

interface Props {
  recipeId: string
  reviews: Review[]
  onReviewAdded: () => void
}

export default function ReviewSection({ recipeId, reviews, onReviewAdded }: Props) {
  const { user } = useApp()
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmitReview = async () => {
    if (!user) {
      Alert.alert('Error', 'Please sign in to leave a review')
      return
    }

    if (!comment.trim()) {
      Alert.alert('Error', 'Please enter a comment')
      return
    }

    setSubmitting(true)
    try {
      const { error } = await supabase
        .from('reviews')
        .insert({
          recipe_id: recipeId,
          user_id: user.id,
          rating,
          comment
        })

      if (error) throw error

      setComment('')
      setRating(5)
      onReviewAdded()
      Alert.alert('Success', 'Review submitted successfully')
    } catch (error) {
      console.error('Error submitting review:', error)
      Alert.alert('Error', 'Failed to submit review')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reviews</Text>

      <View style={styles.addReview}>
        <StarRating
          rating={rating}
          onRatingChange={setRating}
          size={24}
        />
        <TextInput
          style={styles.input}
          value={comment}
          onChangeText={setComment}
          placeholder="Write your review..."
          multiline
        />
        <TouchableOpacity 
          style={[styles.submitButton, submitting && styles.disabledButton]}
          onPress={handleSubmitReview}
          disabled={submitting}
        >
          <Text style={styles.submitButtonText}>
            {submitting ? 'Submitting...' : 'Submit Review'}
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={reviews}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.review}>
            <View style={styles.reviewHeader}>
              <StarRating rating={item.rating} size={16} readonly />
              <Text style={styles.reviewEmail}>{item.user.email}</Text>
            </View>
            <Text style={styles.reviewComment}>{item.comment}</Text>
          </View>
        )}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 16
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16
  },
  addReview: {
    marginBottom: 24
  },
  input: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    marginVertical: 12,
    minHeight: 80,
    textAlignVertical: 'top'
  },
  submitButton: {
    backgroundColor: '#FF6B6B',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center'
  },
  disabledButton: {
    opacity: 0.7
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
  },
  review: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8
  },
  reviewEmail: {
    marginLeft: 8,
    color: '#666'
  },
  reviewComment: {
    fontSize: 16
  }
}) 