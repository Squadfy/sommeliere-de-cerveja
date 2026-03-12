import type { APIGatewayProxyHandlerV2 } from 'aws-lambda'
import { connectDB } from '../db/connection'
import { CategoryModel } from '../models/Category'
import { DishModel } from '../models/Dish'
import { ok, notFound, error } from '../utils/response'

export const list: APIGatewayProxyHandlerV2 = async () => {
  try {
    await connectDB()
    const categories = await CategoryModel.find({ active: true }).sort({ order: 1 }).lean()
    return ok(categories)
  } catch (err) {
    console.error('Error fetching categories:', err)
    return error('Erro ao buscar categorias')
  }
}

export const dishes: APIGatewayProxyHandlerV2 = async (event) => {
  try {
    await connectDB()
    const { slug } = event.pathParameters ?? {}
    if (!slug) return notFound('Categoria não encontrada')

    const category = await CategoryModel.findOne({ slug, active: true }).lean()
    if (!category) return notFound('Categoria não encontrada')

    const dishList = await DishModel.find({ category_id: category._id, active: true })
      .sort({ name: 1 })
      .lean()

    return ok({ category, dishes: dishList })
  } catch (err) {
    console.error('Error fetching category dishes:', err)
    return error('Erro ao buscar pratos da categoria')
  }
}
