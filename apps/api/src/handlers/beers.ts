import type { APIGatewayProxyHandlerV2 } from 'aws-lambda'
import { connectDB } from '../db/connection'
import { BeerModel } from '../models/Beer'
import { RecommendationModel } from '../models/Recommendation'
import { DishModel } from '../models/Dish'
import { ok, notFound, error } from '../utils/response'

export const list: APIGatewayProxyHandlerV2 = async () => {
  try {
    await connectDB()
    const beers = await BeerModel.find({ active: true }).sort({ display_order: 1 }).lean()
    return ok(beers)
  } catch (err) {
    console.error('Error fetching beers:', err)
    return error('Erro ao buscar cervejas')
  }
}

export const detail: APIGatewayProxyHandlerV2 = async (event) => {
  try {
    await connectDB()
    const { slug } = event.pathParameters ?? {}
    if (!slug) return notFound('Cerveja não encontrada')

    const beer = await BeerModel.findOne({ slug, active: true }).lean()
    if (!beer) return notFound('Cerveja não encontrada')

    return ok(beer)
  } catch (err) {
    console.error('Error fetching beer detail:', err)
    return error('Erro ao buscar cerveja')
  }
}

export const dishes: APIGatewayProxyHandlerV2 = async (event) => {
  try {
    await connectDB()
    const { slug } = event.pathParameters ?? {}
    if (!slug) return notFound('Cerveja não encontrada')

    const beer = await BeerModel.findOne({ slug, active: true }).lean()
    if (!beer) return notFound('Cerveja não encontrada')

    const recs = await RecommendationModel.find({ beer_id: beer._id, active: true })
      .sort({ affinity_score: -1 })
      .lean()

    const dishIds = recs.map((r) => r.dish_id)
    const dishList = await DishModel.find({ _id: { $in: dishIds }, active: true }).lean()

    return ok({ beer, dishes: dishList })
  } catch (err) {
    console.error('Error fetching beer dishes:', err)
    return error('Erro ao buscar pratos da cerveja')
  }
}
