import type { APIGatewayProxyHandlerV2 } from 'aws-lambda'
import { connectDB } from '../db/connection'
import { DishModel } from '../models/Dish'
import { ok, badRequest, error } from '../utils/response'

export const search: APIGatewayProxyHandlerV2 = async (event) => {
  try {
    await connectDB()
    const q = event.queryStringParameters?.q?.trim()
    if (!q || q.length < 2) {
      return badRequest('Parâmetro de busca deve ter pelo menos 2 caracteres')
    }
    if (q.length > 100) {
      return badRequest('Parâmetro de busca deve ter no máximo 100 caracteres')
    }

    const dishes = await DishModel.find(
      { $text: { $search: q }, active: true },
      { score: { $meta: 'textScore' } }
    )
      .sort({ score: { $meta: 'textScore' } })
      .limit(20)
      .lean()

    return ok({ query: q, results: dishes, count: dishes.length })
  } catch (err) {
    console.error('Error searching dishes:', err)
    return error('Erro na busca')
  }
}
