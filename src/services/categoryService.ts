import { supabase } from '@/lib/supabase'

export interface Category {
  id: string
  name: string
  image_url: string
}

export const categoryService = {
  async getCategories(): Promise<Category[]> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name')

    if (error) throw error
    return data
  },

  async getRecipesByCategory(categoryId: string) {
    const { data, error } = await supabase
      .from('recipes')
      .select('*')
      .eq('category_id', categoryId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  }
} 