import mongoose, { Schema, Document, Model, Types } from 'mongoose'
import type { Dish } from '@sommeliere/types'

export interface DishDocument extends Omit<Dish, '_id' | 'category_id'>, Document {
  category_id: Types.ObjectId
}

const dishSchema = new Schema<DishDocument>(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category_id: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    image_url: {
      type: String,
      default: '/placeholder-dish.jpg',
    },
    search_tags: {
      type: [String],
      default: [],
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
)

dishSchema.index({ category_id: 1, active: 1 })
dishSchema.index(
  { name: 'text', search_tags: 'text' },
  { default_language: 'portuguese', name: 'dish_text_search' }
)

export const DishModel: Model<DishDocument> =
  mongoose.models.Dish ||
  mongoose.model<DishDocument>('Dish', dishSchema)
