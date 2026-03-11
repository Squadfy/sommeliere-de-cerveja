import type { APIGatewayProxyHandlerV2 } from 'aws-lambda'
import { connectDB } from '../db/connection'
import { DishModel } from '../models/Dish'
import { CategoryModel } from '../models/Category'
import { BeerModel } from '../models/Beer'
import { RecommendationModel } from '../models/Recommendation'
import { ok, notFound, error } from '../utils/response'

export const recommendations: APIGatewayProxyHandlerV2 = async (event) => {
  try {
    await connectDB()
    const { slug } = event.pathParameters ?? {}
    if (!slug) return notFound('Prato não encontrado')

    const dish = await DishModel.findOne({ slug, active: true }).lean()
    if (!dish) return notFound('Prato não encontrado')

    const category = await CategoryModel.findById(dish.category_id).lean()

    const recs = await RecommendationModel.find({ dish_id: dish._id, active: true })
      .sort({ affinity_score: -1 })
      .lean()

    const beerIds = recs.map((r) => r.beer_id)
    const beers = await BeerModel.find({ _id: { $in: beerIds }, active: true }).lean()
    const beerMap = new Map(beers.map((b) => [b._id.toString(), b]))

    const recommendations = recs
      .map((rec) => {
        const beer = beerMap.get(rec.beer_id.toString())
        if (!beer) return null
        return {
          beer,
          affinity_score: rec.affinity_score,
          harmony_principle: rec.harmony_principle,
          recommendation_title: rec.recommendation_title,
          sensory_explanation: rec.sensory_explanation,
        }
      })
      .filter((r): r is NonNullable<typeof r> => r !== null)

    return ok({
      dish: {
        slug: dish.slug,
        name: dish.name,
        category: category ? { slug: category.slug, name: category.name } : null,
      },
      recommendations,
    })
  } catch (err) {
    console.error('Error fetching dish recommendations:', err)
    return error('Erro ao buscar recomendações')
  }
}
