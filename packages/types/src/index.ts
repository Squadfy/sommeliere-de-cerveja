export interface Category {
  _id?: string
  slug: string
  name: string
  icon: string
  order: number
  active: boolean
}

export interface Dish {
  _id?: string
  slug: string
  name: string
  category_id: string
  image_url: string
  search_tags: string[]
  active: boolean
}

export interface Beer {
  _id?: string
  slug: string
  name: string
  brand: string
  style: string
  sensory_profile: string
  general_pairings: string[]
  image_url: string
  serving_temp_min: number
  serving_temp_max: number
  glass_type: string
  display_order: number
  active: boolean
}

export interface Recommendation {
  _id?: string
  dish_id: string
  beer_id: string
  affinity_score: number
  harmony_principle: HarmonyPrinciple
  recommendation_title: string
  sensory_explanation: string
  active: boolean
}

export type HarmonyPrinciple =
  | 'complemento'
  | 'contraste'
  | 'regionalidade'
  | 'intensidade'
  | 'limpeza_do_paladar'

export interface DishRecommendationResponse {
  dish: {
    slug: string
    name: string
    category: {
      slug: string
      name: string
    }
  }
  recommendations: Array<{
    beer: Beer
    affinity_score: number
    harmony_principle: HarmonyPrinciple
    recommendation_title: string
    sensory_explanation: string
  }>
}
