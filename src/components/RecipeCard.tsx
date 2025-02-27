import React from 'react'
import { 
  View, 
  Text, 
  Image, 
  TouchableOpacity, 
  StyleSheet, 
  Dimensions,
  Platform,
} from 'react-native'
import { Recipe } from '@/types/recipe'
import { Ionicons } from '@expo/vector-icons'
import { typography, colors, spacing } from '@/theme'
import { LinearGradient } from 'expo-linear-gradient'
import Animated, {
  FadeIn,
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated'

const { width } = Dimensions.get('window')
const CARD_WIDTH = width * 0.9

interface RecipeCardProps {
  recipe: Recipe
  onPress: () => void
  isFavorite?: boolean
  onFavoritePress?: () => void
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity)

export function RecipeCard({
  recipe,
  onPress,
  isFavorite,
  onFavoritePress,
}: RecipeCardProps) {
  const scale = useSharedValue(1)

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }]
  }))

  const handlePressIn = () => {
    scale.value = withSpring(0.98)
  }

  const handlePressOut = () => {
    scale.value = withSpring(1)
  }

  return (
    <AnimatedTouchable
      entering={FadeInDown.springify().damping(15)}
      style={[styles.container, animatedStyle]}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={1}
    >
      <Image
        source={{ uri: recipe.strMealThumb }}
        style={styles.image}
        contentFit="cover"
        transition={200}
      />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.8)']}
        style={styles.gradient}
      />
      <View style={styles.content}>
        <View style={styles.header}>
          <Animated.Text 
            entering={FadeIn.delay(200)}
            style={styles.title} 
            numberOfLines={2}
          >
            {recipe.strMeal}
          </Animated.Text>
          {onFavoritePress && (
            <TouchableOpacity
              style={styles.favoriteButton}
              onPress={onFavoritePress}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons
                name={isFavorite ? 'heart' : 'heart-outline'}
                size={24}
                color={isFavorite ? colors.primary : colors.white}
              />
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.details}>
          {recipe.strArea && (
            <View style={styles.badge}>
              <Ionicons name="location" size={16} color={colors.white} />
              <Text style={styles.badgeText}>{recipe.strArea}</Text>
            </View>
          )}
          {recipe.cookingTime && (
            <View style={styles.badge}>
              <Ionicons name="time" size={16} color={colors.white} />
              <Text style={styles.badgeText}>{recipe.cookingTime}</Text>
            </View>
          )}
          {recipe.calories && (
            <View style={styles.badge}>
              <Ionicons name="flame" size={16} color={colors.warning} />
              <Text style={styles.badgeText}>{recipe.calories} cal</Text>
            </View>
          )}
          {recipe.isVegetarian && (
            <View style={[styles.badge, styles.vegBadge]}>
              <Ionicons name="leaf" size={16} color={colors.success} />
              <Text style={[styles.badgeText, { color: colors.success }]}>Veg</Text>
            </View>
          )}
        </View>
      </View>
    </AnimatedTouchable>
  )
}

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    height: 250,
    marginVertical: spacing.sm,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: colors.gray[100],
    ...Platform.select({
      ios: {
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  image: {
    width: '100%',
    height: '100%',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '70%',
  },
  content: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.white,
    flex: 1,
    marginRight: spacing.sm,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  favoriteButton: {
    padding: spacing.xs,
  },
  details: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 12,
    gap: spacing.xs,
  },
  badgeText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.white,
  },
  vegBadge: {
    backgroundColor: colors.success + '20',
  },
}) 