import mongoose, { Schema, Document, Model } from 'mongoose'
import type { Beer } from '@sommeliere/types'

export interface BeerDocument extends Omit<Beer, '_id'>, Document {}

const beerSchema = new Schema<BeerDocument>(
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
    brand: {
      type: String,
      required: true,
      trim: true,
    },
    style: {
      type: String,
      required: true,
    },
    sensory_profile: {
      type: String,
      required: true,
    },
    general_pairings: {
      type: [String],
      default: [],
    },
    image_url: {
      type: String,
      default: '/placeholder-beer.jpg',
    },
    serving_temp_min: {
      type: Number,
      required: true,
    },
    serving_temp_max: {
      type: Number,
      required: true,
    },
    glass_type: {
      type: String,
      required: true,
    },
    display_order: {
      type: Number,
      default: 0,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
)

beerSchema.index({ active: 1, display_order: 1 })

export const BeerModel: Model<BeerDocument> =
  mongoose.models.Beer ||
  mongoose.model<BeerDocument>('Beer', beerSchema)
