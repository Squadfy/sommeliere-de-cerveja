import mongoose, { Schema, Document, Model } from 'mongoose'
import type { Category } from '@sommeliere/types'

export interface CategoryDocument extends Omit<Category, '_id'>, Document {}

const categorySchema = new Schema<CategoryDocument>(
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
    icon: {
      type: String,
      required: true,
    },
    order: {
      type: Number,
      required: true,
      default: 0,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
)

categorySchema.index({ active: 1, order: 1 })

export const CategoryModel: Model<CategoryDocument> =
  mongoose.models.Category ||
  mongoose.model<CategoryDocument>('Category', categorySchema)
