import mongoose from 'mongoose'
import { connectDB, disconnectDB } from '../db/connection'
import { CategoryModel } from '../models/Category'
import { DishModel } from '../models/Dish'
import { BeerModel } from '../models/Beer'
import { RecommendationModel } from '../models/Recommendation'

describe('Mongoose Models', () => {
  beforeAll(async () => {
    await connectDB()
  })

  afterAll(async () => {
    await disconnectDB()
  })

  beforeEach(async () => {
    await Promise.all([
      CategoryModel.deleteMany({}),
      DishModel.deleteMany({}),
      BeerModel.deleteMany({}),
      RecommendationModel.deleteMany({}),
    ])
  })

  describe('CategoryModel', () => {
    it('cria uma categoria com campos obrigatórios', async () => {
      const category = await CategoryModel.create({
        slug: 'carnes',
        name: 'Carnes',
        icon: '🥩',
        order: 1,
      })
      expect(category.slug).toBe('carnes')
      expect(category.active).toBe(true)
    })

    it('rejeita slug duplicado', async () => {
      await CategoryModel.create({ slug: 'carnes', name: 'Carnes', icon: '🥩', order: 1 })
      await expect(
        CategoryModel.create({ slug: 'carnes', name: 'Carnes 2', icon: '🥩', order: 2 })
      ).rejects.toThrow()
    })

    it('tem active = true por padrão', async () => {
      const category = await CategoryModel.create({ slug: 'massas', name: 'Massas', icon: '🍝', order: 3 })
      expect(category.active).toBe(true)
    })
  })

  describe('DishModel', () => {
    let categoryId: mongoose.Types.ObjectId

    beforeEach(async () => {
      const cat = await CategoryModel.create({ slug: 'carnes', name: 'Carnes', icon: '🥩', order: 1 })
      categoryId = cat._id as mongoose.Types.ObjectId
    })

    it('cria um prato com campos obrigatórios', async () => {
      const dish = await DishModel.create({
        slug: 'picanha',
        name: 'Picanha',
        category_id: categoryId,
      })
      expect(dish.slug).toBe('picanha')
      expect(dish.active).toBe(true)
      expect(dish.search_tags).toEqual([])
    })

    it('rejeita slug duplicado', async () => {
      await DishModel.create({ slug: 'picanha', name: 'Picanha', category_id: categoryId })
      await expect(
        DishModel.create({ slug: 'picanha', name: 'Picanha 2', category_id: categoryId })
      ).rejects.toThrow()
    })
  })

  describe('BeerModel', () => {
    it('cria uma cerveja com campos obrigatórios', async () => {
      const beer = await BeerModel.create({
        slug: 'heineken-lager',
        name: 'Heineken',
        brand: 'Heineken',
        style: 'Lager Premium',
        sensory_profile: 'Leve, refrescante, levemente amarga',
        serving_temp_min: 2,
        serving_temp_max: 4,
        glass_type: 'Cálice/Tulipa',
      })
      expect(beer.slug).toBe('heineken-lager')
      expect(beer.active).toBe(true)
    })
  })

  describe('RecommendationModel', () => {
    it('cria uma recomendação com campos obrigatórios', async () => {
      const cat = await CategoryModel.create({ slug: 'carnes-2', name: 'Carnes', icon: '🥩', order: 1 })
      const dish = await DishModel.create({ slug: 'picanha-rec', name: 'Picanha', category_id: cat._id })
      const beer = await BeerModel.create({
        slug: 'heineken-rec',
        name: 'Heineken',
        brand: 'Heineken',
        style: 'Lager',
        sensory_profile: 'Leve',
        serving_temp_min: 2,
        serving_temp_max: 4,
        glass_type: 'Cálice',
      })

      const rec = await RecommendationModel.create({
        dish_id: dish._id,
        beer_id: beer._id,
        affinity_score: 90,
        harmony_principle: 'complemento',
        recommendation_title: 'Combinação perfeita',
        sensory_explanation: 'A Heineken complementa a gordura da picanha.',
      })

      expect(rec.affinity_score).toBe(90)
      expect(rec.active).toBe(true)
      expect(rec.harmony_principle).toBe('complemento')
    })

    it('rejeita harmony_principle inválido', async () => {
      const cat = await CategoryModel.create({ slug: 'petiscos-inv', name: 'Petiscos', icon: '🍟', order: 4 })
      const dish = await DishModel.create({ slug: 'batata-frita', name: 'Batata Frita', category_id: cat._id })
      const beer = await BeerModel.create({
        slug: 'amstel-inv',
        name: 'Amstel',
        brand: 'Amstel',
        style: 'Puro Malte',
        sensory_profile: 'Encorpado',
        serving_temp_min: 4,
        serving_temp_max: 6,
        glass_type: 'Long neck',
      })

      await expect(
        RecommendationModel.create({
          dish_id: dish._id,
          beer_id: beer._id,
          affinity_score: 75,
          harmony_principle: 'invalido',
          recommendation_title: 'Título',
          sensory_explanation: 'Explicação.',
        })
      ).rejects.toThrow()
    })
  })
})
