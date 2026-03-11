import mongoose, { Schema, Document, Model, Types } from 'mongoose'
import type { Recommendation, HarmonyPrinciple } from '@sommeliere/types'

export interface RecommendationDocument
  extends Omit<Recommendation, '_id' | 'dish_id' | 'beer_id'>,
    Document {
  dish_id: Types.ObjectId
  beer_id: Types.ObjectId
}

const HARMONY_PRINCIPLES: HarmonyPrinciple[] = [
  'complemento',
  'contraste',
  'regionalidade',
  'intensidade',
  'limpeza_do_paladar',
]

const recommendationSchema = new Schema<RecommendationDocument>(
  {
    dish_id: {
      type: Schema.Types.ObjectId,
      ref: 'Dish',
      required: true,
    },
    beer_id: {
      type: Schema.Types.ObjectId,
      ref: 'Beer',
      required: true,
    },
    affinity_score: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    harmony_principle: {
      type: String,
      enum: HARMONY_PRINCIPLES,
      required: true,
    },
    recommendation_title: {
      type: String,
      required: true,
    },
    sensory_explanation: {
      type: String,
      required: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
)

recommendationSchema.index({ dish_id: 1, active: 1, affinity_score: -1 })
recommendationSchema.index({ beer_id: 1, active: 1, affinity_score: -1 })
recommendationSchema.index({ dish_id: 1, beer_id: 1 }, { unique: true })

export const RecommendationModel: Model<RecommendationDocument> =
  mongoose.models.Recommendation ||
  mongoose.model<RecommendationDocument>('Recommendation', recommendationSchema)
