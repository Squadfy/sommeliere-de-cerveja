import 'dotenv/config'
import mongoose from 'mongoose'
import { connectDB, disconnectDB } from '../apps/api/src/db/connection'
import { CategoryModel } from '../apps/api/src/models/Category'
import { DishModel } from '../apps/api/src/models/Dish'
import { BeerModel } from '../apps/api/src/models/Beer'
import { RecommendationModel } from '../apps/api/src/models/Recommendation'
import type { HarmonyPrinciple } from '@sommeliere/types'

if (process.env.NODE_ENV === 'production') {
  console.error('❌ seed.ts NÃO pode ser executado em produção!')
  process.exit(1)
}

// ─── Dados de Categorias ───────────────────────────────────────────────────

const CATEGORIES = [
  { slug: 'carnes', name: 'Carnes', icon: '🥩', order: 1 },
  { slug: 'frutos-do-mar', name: 'Frutos do Mar', icon: '🦐', order: 2 },
  { slug: 'massas', name: 'Massas', icon: '🍝', order: 3 },
  { slug: 'petiscos', name: 'Petiscos', icon: '🍟', order: 4 },
  { slug: 'vegetariano', name: 'Vegetariano', icon: '🥗', order: 5 },
  { slug: 'sushi-oriental', name: 'Sushi/Oriental', icon: '🍱', order: 6 },
  { slug: 'sobremesas', name: 'Sobremesas', icon: '🍮', order: 7 },
  { slug: 'outros', name: 'Outros', icon: '🍽️', order: 8 },
]

// ─── Dados de Cervejas (portfólio Heineken) ───────────────────────────────

const BEERS = [
  {
    slug: 'heineken-lager',
    name: 'Heineken',
    brand: 'Heineken',
    style: 'Lager Premium',
    sensory_profile: 'Leve, refrescante, levemente amarga com notas de lúpulo floral',
    general_pairings: ['carnes grelhadas', 'frutos do mar', 'queijos leves', 'petiscos'],
    image_url: '/placeholder-beer.jpg',
    serving_temp_min: 2,
    serving_temp_max: 4,
    glass_type: 'Cálice/Tulipa',
    display_order: 1,
  },
  {
    slug: 'amstel-puro-malte',
    name: 'Amstel Puro Malte',
    brand: 'Amstel',
    style: 'Puro Malte',
    sensory_profile: 'Encorpado, sabor de malte pronunciado, levemente adocicado',
    general_pairings: ['carnes', 'hambúrgueres', 'pizza', 'petiscos fritos'],
    image_url: '/placeholder-beer.jpg',
    serving_temp_min: 4,
    serving_temp_max: 6,
    glass_type: 'Copo long neck',
    display_order: 2,
  },
  {
    slug: 'eisenbahn-pilsen',
    name: 'Eisenbahn Pilsen',
    brand: 'Eisenbahn',
    style: 'Pilsen Artesanal',
    sensory_profile: 'Leve, lupulado, refrescante com final seco e amargo suave',
    general_pairings: ['frutos do mar', 'saladas', 'vegetariano', 'sushi'],
    image_url: '/placeholder-beer.jpg',
    serving_temp_min: 4,
    serving_temp_max: 6,
    glass_type: 'Copo americano',
    display_order: 3,
  },
  {
    slug: 'eisenbahn-weizenbier',
    name: 'Eisenbahn Weizenbier',
    brand: 'Eisenbahn',
    style: 'Weizen',
    sensory_profile: 'Frutado, notas de banana e cravo, corpo médio, espuma cremosa',
    general_pairings: ['massas', 'queijos', 'sobremesas de frutas', 'vegetariano'],
    image_url: '/placeholder-beer.jpg',
    serving_temp_min: 6,
    serving_temp_max: 8,
    glass_type: 'Copo de trigo',
    display_order: 4,
  },
  {
    slug: 'eisenbahn-ipa',
    name: 'Eisenbahn IPA',
    brand: 'Eisenbahn',
    style: 'IPA / Pale Ale',
    sensory_profile: 'Intensa, lupulada, amarga, notas cítricas e resinosas',
    general_pairings: ['carnes defumadas', 'queijos fortes', 'comida apimentada', 'hambúrgueres'],
    image_url: '/placeholder-beer.jpg',
    serving_temp_min: 8,
    serving_temp_max: 10,
    glass_type: 'Copo tulipa',
    display_order: 5,
  },
  {
    slug: 'baden-baden-premium',
    name: 'Baden Baden Premium',
    brand: 'Baden Baden',
    style: 'Linha Gourmet Premium',
    sensory_profile: 'Elegante, equilibrada, malte caramelado, levemente tostado',
    general_pairings: ['carnes nobres', 'massas cremosas', 'sobremesas de chocolate', 'queijos'],
    image_url: '/placeholder-beer.jpg',
    serving_temp_min: 4,
    serving_temp_max: 6,
    glass_type: 'Taça',
    display_order: 6,
  },
  {
    slug: 'sol-lager',
    name: 'Sol',
    brand: 'Sol',
    style: 'Lager Tropical',
    sensory_profile: 'Muito leve, refrescante, sabor suave, ideal para dias quentes',
    general_pairings: ['frutos do mar', 'sushi', 'petiscos leves', 'comida mexicana'],
    image_url: '/placeholder-beer.jpg',
    serving_temp_min: 2,
    serving_temp_max: 4,
    glass_type: 'Long neck',
    display_order: 7,
  },
  {
    slug: 'devassa-puro-malte',
    name: 'Devassa Puro Malte',
    brand: 'Devassa',
    style: 'Puro Malte',
    sensory_profile: 'Suave, malte pronunciado, levemente adocicado, refrescante',
    general_pairings: ['carnes', 'churrasco', 'petiscos', 'comida brasileira'],
    image_url: '/placeholder-beer.jpg',
    serving_temp_min: 4,
    serving_temp_max: 6,
    glass_type: 'Copo americano',
    display_order: 8,
  },
]

// ─── Dados de Pratos (por categoria, com search_tags) ──────────────────────

type DishData = {
  slug: string
  name: string
  category_slug: string
  image_url: string
  search_tags: string[]
}

const DISHES: DishData[] = [
  // CARNES
  { slug: 'picanha', name: 'Picanha', category_slug: 'carnes', image_url: '/placeholder-dish.jpg', search_tags: ['picanha', 'churrasco', 'boi', 'carne bovina', 'grelhado'] },
  { slug: 'costela-bovina', name: 'Costela Bovina', category_slug: 'carnes', image_url: '/placeholder-dish.jpg', search_tags: ['costela', 'churrasco', 'boi', 'carne assada', 'lento'] },
  { slug: 'frango-grelhado', name: 'Frango Grelhado', category_slug: 'carnes', image_url: '/placeholder-dish.jpg', search_tags: ['frango', 'grelhado', 'ave', 'proteína', 'light'] },
  { slug: 'hamburguer-artesanal', name: 'Hambúrguer Artesanal', category_slug: 'carnes', image_url: '/placeholder-dish.jpg', search_tags: ['hamburguer', 'burger', 'lanche', 'bife', 'queijo'] },
  { slug: 'churrasco-misto', name: 'Churrasco Misto', category_slug: 'carnes', image_url: '/placeholder-dish.jpg', search_tags: ['churrasco', 'espetinho', 'assado', 'carne mista', 'churrasqueira'] },
  { slug: 'cordeiro-assado', name: 'Cordeiro Assado', category_slug: 'carnes', image_url: '/placeholder-dish.jpg', search_tags: ['cordeiro', 'carneiro', 'assado', 'carne ovina'] },
  { slug: 'linguica-defumada', name: 'Linguiça Defumada', category_slug: 'carnes', image_url: '/placeholder-dish.jpg', search_tags: ['linguica', 'defumado', 'embutido', 'churrasco', 'defumada'] },
  // FRUTOS DO MAR
  { slug: 'camarao-na-moranga', name: 'Camarão na Moranga', category_slug: 'frutos-do-mar', image_url: '/placeholder-dish.jpg', search_tags: ['camarao', 'moranga', 'frutos do mar', 'crustáceo', 'cremoso'] },
  { slug: 'salmao-grelhado', name: 'Salmão Grelhado', category_slug: 'frutos-do-mar', image_url: '/placeholder-dish.jpg', search_tags: ['salmao', 'peixe', 'grelhado', 'omega 3', 'frutos do mar'] },
  { slug: 'moqueca-de-peixe', name: 'Moqueca de Peixe', category_slug: 'frutos-do-mar', image_url: '/placeholder-dish.jpg', search_tags: ['moqueca', 'peixe', 'dendê', 'baiano', 'frutos do mar', 'coco'] },
  { slug: 'lula-frita', name: 'Lula Frita', category_slug: 'frutos-do-mar', image_url: '/placeholder-dish.jpg', search_tags: ['lula', 'frito', 'frutos do mar', 'anéis', 'petisco'] },
  { slug: 'tilapia-ao-molho', name: 'Tilápia ao Molho', category_slug: 'frutos-do-mar', image_url: '/placeholder-dish.jpg', search_tags: ['tilapia', 'peixe', 'molho', 'assado', 'frutos do mar'] },
  { slug: 'mariscos-ao-vinho', name: 'Mariscos ao Vinho Branco', category_slug: 'frutos-do-mar', image_url: '/placeholder-dish.jpg', search_tags: ['marisco', 'mexilhao', 'vinho', 'frutos do mar'] },
  // MASSAS
  { slug: 'carbonara', name: 'Carbonara', category_slug: 'massas', image_url: '/placeholder-dish.jpg', search_tags: ['carbonara', 'massa', 'italiano', 'ovo', 'pancetta', 'esparguete'] },
  { slug: 'lasanha-bolonhesa', name: 'Lasanha à Bolonhesa', category_slug: 'massas', image_url: '/placeholder-dish.jpg', search_tags: ['lasanha', 'bolonhesa', 'massa', 'carne moida', 'bechamel'] },
  { slug: 'risoto-de-funghi', name: 'Risoto de Funghi', category_slug: 'massas', image_url: '/placeholder-dish.jpg', search_tags: ['risoto', 'funghi', 'cogumelo', 'arroz', 'italiano', 'cremoso'] },
  { slug: 'nhoque-ao-pesto', name: 'Nhoque ao Pesto', category_slug: 'massas', image_url: '/placeholder-dish.jpg', search_tags: ['nhoque', 'pesto', 'manjericao', 'massa', 'italiano'] },
  { slug: 'fettuccine-alfredo', name: 'Fettuccine Alfredo', category_slug: 'massas', image_url: '/placeholder-dish.jpg', search_tags: ['fettuccine', 'alfredo', 'massa', 'cremoso', 'manteiga', 'parmesao'] },
  { slug: 'pizza-margherita', name: 'Pizza Margherita', category_slug: 'massas', image_url: '/placeholder-dish.jpg', search_tags: ['pizza', 'margherita', 'tomate', 'muçarela', 'manjericao', 'italiano'] },
  // PETISCOS
  { slug: 'batata-frita', name: 'Batata Frita', category_slug: 'petiscos', image_url: '/placeholder-dish.jpg', search_tags: ['batata', 'frita', 'petisco', 'lanche', 'crocante'] },
  { slug: 'coxinha', name: 'Coxinha', category_slug: 'petiscos', image_url: '/placeholder-dish.jpg', search_tags: ['coxinha', 'salgado', 'frango', 'petisco', 'brasileiro'] },
  { slug: 'asa-de-frango', name: 'Asa de Frango (Wings)', category_slug: 'petiscos', image_url: '/placeholder-dish.jpg', search_tags: ['asa', 'frango', 'wings', 'petisco', 'defumado', 'molho'] },
  { slug: 'onion-rings', name: 'Onion Rings', category_slug: 'petiscos', image_url: '/placeholder-dish.jpg', search_tags: ['onion rings', 'cebola', 'frito', 'petisco', 'empanado'] },
  { slug: 'tábua-de-frios', name: 'Tábua de Frios', category_slug: 'petiscos', image_url: '/placeholder-dish.jpg', search_tags: ['tábua', 'frios', 'queijo', 'embutidos', 'petisco', 'charcutaria'] },
  { slug: 'pasteis-salgados', name: 'Pastéis Salgados', category_slug: 'petiscos', image_url: '/placeholder-dish.jpg', search_tags: ['pastel', 'frito', 'salgado', 'petisco', 'brasileiro'] },
  // VEGETARIANO
  { slug: 'salada-caprese', name: 'Salada Caprese', category_slug: 'vegetariano', image_url: '/placeholder-dish.jpg', search_tags: ['caprese', 'tomate', 'muçarela', 'manjericao', 'salada', 'vegetariano'] },
  { slug: 'risoto-de-legumes', name: 'Risoto de Legumes', category_slug: 'vegetariano', image_url: '/placeholder-dish.jpg', search_tags: ['risoto', 'legumes', 'vegetariano', 'cremoso', 'arroz'] },
  { slug: 'hamburguer-vegano', name: 'Hambúrguer Vegano', category_slug: 'vegetariano', image_url: '/placeholder-dish.jpg', search_tags: ['hamburguer', 'vegano', 'vegetariano', 'grão de bico', 'lanche'] },
  { slug: 'pizza-de-cogumelos', name: 'Pizza de Cogumelos', category_slug: 'vegetariano', image_url: '/placeholder-dish.jpg', search_tags: ['pizza', 'cogumelo', 'funghi', 'vegetariano', 'italiano'] },
  { slug: 'wrap-vegetal', name: 'Wrap Vegetal', category_slug: 'vegetariano', image_url: '/placeholder-dish.jpg', search_tags: ['wrap', 'vegetal', 'vegetariano', 'lanche', 'fresco'] },
  // SUSHI/ORIENTAL
  { slug: 'sashimi-salmao', name: 'Sashimi de Salmão', category_slug: 'sushi-oriental', image_url: '/placeholder-dish.jpg', search_tags: ['sashimi', 'salmao', 'japones', 'peixe cru', 'oriental'] },
  { slug: 'uramaki-califórnia', name: 'Uramaki Califórnia', category_slug: 'sushi-oriental', image_url: '/placeholder-dish.jpg', search_tags: ['uramaki', 'califórnia', 'sushi', 'kani', 'pepino', 'oriental'] },
  { slug: 'temaki-de-salmao', name: 'Temaki de Salmão', category_slug: 'sushi-oriental', image_url: '/placeholder-dish.jpg', search_tags: ['temaki', 'salmao', 'sushi', 'cone', 'oriental', 'japones'] },
  { slug: 'pad-thai', name: 'Pad Thai', category_slug: 'sushi-oriental', image_url: '/placeholder-dish.jpg', search_tags: ['pad thai', 'tailandês', 'oriental', 'macarrão', 'camarao'] },
  { slug: 'gyoza', name: 'Gyoza', category_slug: 'sushi-oriental', image_url: '/placeholder-dish.jpg', search_tags: ['gyoza', 'bolinho', 'japones', 'oriental', 'frito', 'carne'] },
  { slug: 'ramen', name: 'Ramen', category_slug: 'sushi-oriental', image_url: '/placeholder-dish.jpg', search_tags: ['ramen', 'sopa', 'japones', 'macarrão', 'oriental', 'caldo'] },
  // SOBREMESAS
  { slug: 'brownie-de-chocolate', name: 'Brownie de Chocolate', category_slug: 'sobremesas', image_url: '/placeholder-dish.jpg', search_tags: ['brownie', 'chocolate', 'sobremesa', 'doce', 'cacau'] },
  { slug: 'cheesecake', name: 'Cheesecake', category_slug: 'sobremesas', image_url: '/placeholder-dish.jpg', search_tags: ['cheesecake', 'cream cheese', 'sobremesa', 'doce', 'americano'] },
  { slug: 'crepe-de-nutella', name: 'Crepe de Nutella', category_slug: 'sobremesas', image_url: '/placeholder-dish.jpg', search_tags: ['crepe', 'nutella', 'chocolate', 'sobremesa', 'avelã'] },
  { slug: 'pudim-de-leite', name: 'Pudim de Leite', category_slug: 'sobremesas', image_url: '/placeholder-dish.jpg', search_tags: ['pudim', 'leite', 'sobremesa', 'caramelo', 'brasileiro', 'doce'] },
  // OUTROS
  { slug: 'tacos-mexicanos', name: 'Tacos Mexicanos', category_slug: 'outros', image_url: '/placeholder-dish.jpg', search_tags: ['taco', 'mexicano', 'tortilha', 'carne', 'pimenta', 'molho'] },
  { slug: 'nachos-com-guacamole', name: 'Nachos com Guacamole', category_slug: 'outros', image_url: '/placeholder-dish.jpg', search_tags: ['nachos', 'guacamole', 'mexicano', 'abacate', 'petisco'] },
  { slug: 'frango-ao-curry', name: 'Frango ao Curry', category_slug: 'outros', image_url: '/placeholder-dish.jpg', search_tags: ['curry', 'frango', 'indiano', 'especiarias', 'picante'] },
]

// ─── Dados de Recomendações ────────────────────────────────────────────────

type RecData = {
  dish_slug: string
  beer_slug: string
  affinity_score: number
  harmony_principle: HarmonyPrinciple
  recommendation_title: string
  sensory_explanation: string
}

const RECOMMENDATIONS: RecData[] = [
  // Picanha (5 recomendações - atende critério F06)
  {
    dish_slug: 'picanha',
    beer_slug: 'heineken-lager',
    affinity_score: 88,
    harmony_principle: 'limpeza_do_paladar',
    recommendation_title: 'Heineken refresca o paladar da picanha',
    sensory_explanation: 'A leveza da Heineken Lager contrasta com a gordura da picanha, limpando o paladar a cada gole e preparando para a próxima garfada.',
  },
  {
    dish_slug: 'picanha',
    beer_slug: 'eisenbahn-ipa',
    affinity_score: 82,
    harmony_principle: 'contraste',
    recommendation_title: 'IPA corta a gordura com amargura',
    sensory_explanation: 'O amargor intenso da IPA contrasta com a suculência da picanha, criando um equilíbrio entre riqueza e frescor.',
  },
  {
    dish_slug: 'picanha',
    beer_slug: 'amstel-puro-malte',
    affinity_score: 85,
    harmony_principle: 'complemento',
    recommendation_title: 'Malte e carne: um clássico brasileiro',
    sensory_explanation: 'O sabor maltado da Amstel complementa as notas caramelizadas da picanha grelhada, criando uma harmonia natural.',
  },
  {
    dish_slug: 'picanha',
    beer_slug: 'devassa-puro-malte',
    affinity_score: 78,
    harmony_principle: 'regionalidade',
    recommendation_title: 'Churrasco brasileiro com cerveja nacional',
    sensory_explanation: 'A Devassa Puro Malte traz a essência do churrasco brasileiro, com seu sabor suave que respeita a carne.',
  },
  {
    dish_slug: 'picanha',
    beer_slug: 'eisenbahn-pilsen',
    affinity_score: 75,
    harmony_principle: 'limpeza_do_paladar',
    recommendation_title: 'Pilsen artesanal para o churrasco',
    sensory_explanation: 'A Eisenbahn Pilsen, com seu final seco, limpa a gordura da picanha e realça o sabor defumado da grelha.',
  },
  // Hambúrguer Artesanal (4 recomendações)
  {
    dish_slug: 'hamburguer-artesanal',
    beer_slug: 'amstel-puro-malte',
    affinity_score: 90,
    harmony_principle: 'complemento',
    recommendation_title: 'Dupla clássica: burger e Amstel',
    sensory_explanation: 'O malte encorpado da Amstel combina perfeitamente com a carne suculenta e o queijo derretido do hambúrguer artesanal.',
  },
  {
    dish_slug: 'hamburguer-artesanal',
    beer_slug: 'eisenbahn-ipa',
    affinity_score: 85,
    harmony_principle: 'contraste',
    recommendation_title: 'IPA rompe com o cremoso do burger',
    sensory_explanation: 'O lupulado intenso da IPA corta a riqueza do queijo e da carne, criando um contraste delicioso.',
  },
  {
    dish_slug: 'hamburguer-artesanal',
    beer_slug: 'heineken-lager',
    affinity_score: 80,
    harmony_principle: 'limpeza_do_paladar',
    recommendation_title: 'Heineken refresca entre mordidas',
    sensory_explanation: 'A carbonatação da Heineken limpa o paladar entre mordidas do burger, mantendo cada sabor nítido.',
  },
  {
    dish_slug: 'hamburguer-artesanal',
    beer_slug: 'devassa-puro-malte',
    affinity_score: 77,
    harmony_principle: 'complemento',
    recommendation_title: 'Puro malte para o lanche favorito',
    sensory_explanation: 'A Devassa Puro Malte, com seu sabor suave de malte, é o par perfeito para um hambúrguer bem temperado.',
  },
  // Salmão Grelhado (4 recomendações)
  {
    dish_slug: 'salmao-grelhado',
    beer_slug: 'eisenbahn-pilsen',
    affinity_score: 92,
    harmony_principle: 'complemento',
    recommendation_title: 'Pilsen delicada para o salmão',
    sensory_explanation: 'A sutileza da Eisenbahn Pilsen não interfere no sabor delicado do salmão, enquanto complementa sua textura.',
  },
  {
    dish_slug: 'salmao-grelhado',
    beer_slug: 'heineken-lager',
    affinity_score: 87,
    harmony_principle: 'complemento',
    recommendation_title: 'Heineken e salmão: leveza e elegância',
    sensory_explanation: 'A Heineken Lager realça as notas defumadas do salmão grelhado sem sobrepor seu sabor natural.',
  },
  {
    dish_slug: 'salmao-grelhado',
    beer_slug: 'eisenbahn-weizenbier',
    affinity_score: 83,
    harmony_principle: 'complemento',
    recommendation_title: 'Weizen frutado com salmão',
    sensory_explanation: 'As notas de banana e cravo da Weizenbier criam uma harmonia inesperada com o salmão grelhado.',
  },
  {
    dish_slug: 'salmao-grelhado',
    beer_slug: 'sol-lager',
    affinity_score: 78,
    harmony_principle: 'limpeza_do_paladar',
    recommendation_title: 'Sol refresca com frutos do mar',
    sensory_explanation: 'A leveza tropical da Sol complementa os sabores marinhos do salmão grelhado.',
  },
  // Carbonara (4 recomendações)
  {
    dish_slug: 'carbonara',
    beer_slug: 'eisenbahn-weizenbier',
    affinity_score: 89,
    harmony_principle: 'complemento',
    recommendation_title: 'Weizen e Carbonara: cremosidade em harmonia',
    sensory_explanation: 'As notas frutadas da Weizenbier complementam a riqueza cremosa da Carbonara, criando um equilíbrio entre leveza e sabor.',
  },
  {
    dish_slug: 'carbonara',
    beer_slug: 'heineken-lager',
    affinity_score: 82,
    harmony_principle: 'limpeza_do_paladar',
    recommendation_title: 'Heineken alivia a cremosidade',
    sensory_explanation: 'A Heineken Lager limpa a gordura do queijo e do ovo da carbonara, refrescando o paladar.',
  },
  {
    dish_slug: 'carbonara',
    beer_slug: 'eisenbahn-pilsen',
    affinity_score: 78,
    harmony_principle: 'contraste',
    recommendation_title: 'Pilsen contrasta com o cremoso',
    sensory_explanation: 'A Pilsen leve e seca contrasta com a riqueza da carbonara, criando um equilíbrio de texturas.',
  },
  {
    dish_slug: 'carbonara',
    beer_slug: 'amstel-puro-malte',
    affinity_score: 75,
    harmony_principle: 'intensidade',
    recommendation_title: 'Malte encorpado para massa robusta',
    sensory_explanation: 'A Amstel Puro Malte tem intensidade suficiente para acompanhar a riqueza da carbonara.',
  },
  // Sushi (Uramaki Califórnia) (4 recomendações)
  {
    dish_slug: 'uramaki-califórnia',
    beer_slug: 'sol-lager',
    affinity_score: 91,
    harmony_principle: 'regionalidade',
    recommendation_title: 'Sol: a escolha tropical para o sushi',
    sensory_explanation: 'A leveza refrescante da Sol Lager respeita os sabores delicados do uramaki, sem competir com o peixe.',
  },
  {
    dish_slug: 'uramaki-califórnia',
    beer_slug: 'eisenbahn-pilsen',
    affinity_score: 86,
    harmony_principle: 'limpeza_do_paladar',
    recommendation_title: 'Pilsen prepara para o próximo niguiri',
    sensory_explanation: 'A Eisenbahn Pilsen limpa o paladar entre as peças de sushi, realçando cada sabor individualmente.',
  },
  {
    dish_slug: 'uramaki-califórnia',
    beer_slug: 'heineken-lager',
    affinity_score: 84,
    harmony_principle: 'complemento',
    recommendation_title: 'Heineken e sushi: leveza que combina',
    sensory_explanation: 'A Heineken complementa a suavidade do uramaki sem sobrepor seus sabores delicados.',
  },
  {
    dish_slug: 'uramaki-califórnia',
    beer_slug: 'eisenbahn-weizenbier',
    affinity_score: 79,
    harmony_principle: 'contraste',
    recommendation_title: 'Weizen frutado surpreende no sushi',
    sensory_explanation: 'As notas de banana da Weizenbier criam um contraste inusitado e agradável com o kani e pepino.',
  },
  // Brownie (3 recomendações)
  {
    dish_slug: 'brownie-de-chocolate',
    beer_slug: 'eisenbahn-weizenbier',
    affinity_score: 87,
    harmony_principle: 'complemento',
    recommendation_title: 'Weizen com o chocolate: doçura encontra doçura',
    sensory_explanation: 'As notas adocicadas da Weizenbier complementam o chocolate amargo do brownie, criando uma sobremesa completa.',
  },
  {
    dish_slug: 'brownie-de-chocolate',
    beer_slug: 'eisenbahn-ipa',
    affinity_score: 80,
    harmony_principle: 'contraste',
    recommendation_title: 'IPA amarga equilibra o doce do brownie',
    sensory_explanation: 'O amargor pronunciado da IPA contrasta com a doçura intensa do brownie de chocolate.',
  },
  {
    dish_slug: 'brownie-de-chocolate',
    beer_slug: 'baden-baden-premium',
    affinity_score: 85,
    harmony_principle: 'complemento',
    recommendation_title: 'Baden Baden eleva a sobremesa',
    sensory_explanation: 'O malte caramelado da Baden Baden Premium cria uma harmonia elegante com o chocolate rico do brownie.',
  },
  // Churrasco Misto (3 recomendações)
  {
    dish_slug: 'churrasco-misto',
    beer_slug: 'heineken-lager',
    affinity_score: 86,
    harmony_principle: 'limpeza_do_paladar',
    recommendation_title: 'Heineken para o churrasco completo',
    sensory_explanation: 'A refrescância da Heineken limpa o paladar entre as diferentes carnes do churrasco misto.',
  },
  {
    dish_slug: 'churrasco-misto',
    beer_slug: 'devassa-puro-malte',
    affinity_score: 83,
    harmony_principle: 'regionalidade',
    recommendation_title: 'Churrasco brasileiro com Devassa',
    sensory_explanation: 'A Devassa Puro Malte é a escolha regional perfeita para o churrasco misto, respeitando as tradições brasileiras.',
  },
  {
    dish_slug: 'churrasco-misto',
    beer_slug: 'eisenbahn-ipa',
    affinity_score: 80,
    harmony_principle: 'contraste',
    recommendation_title: 'IPA corta a gordura do churrasco',
    sensory_explanation: 'O amargor da IPA contrasta com a gordura e defumação das carnes, criando equilíbrio.',
  },
  // Batata Frita (3 recomendações)
  {
    dish_slug: 'batata-frita',
    beer_slug: 'heineken-lager',
    affinity_score: 90,
    harmony_principle: 'limpeza_do_paladar',
    recommendation_title: 'Heineken: o par clássico da batata frita',
    sensory_explanation: 'A carbonatação da Heineken limpa a gordura da fritura, tornando cada batata frita mais crocante.',
  },
  {
    dish_slug: 'batata-frita',
    beer_slug: 'amstel-puro-malte',
    affinity_score: 84,
    harmony_principle: 'complemento',
    recommendation_title: 'Amstel e batata: conforto total',
    sensory_explanation: 'O corpo encorpado da Amstel combina com a riqueza salgada das batatas fritas.',
  },
  {
    dish_slug: 'batata-frita',
    beer_slug: 'eisenbahn-pilsen',
    affinity_score: 79,
    harmony_principle: 'limpeza_do_paladar',
    recommendation_title: 'Pilsen refresca entre as batatas',
    sensory_explanation: 'A Eisenbahn Pilsen, com seu final seco, limpa o óleo das batatas e deixa o paladar pronto para mais.',
  },
  // Moqueca de Peixe (3 recomendações)
  {
    dish_slug: 'moqueca-de-peixe',
    beer_slug: 'sol-lager',
    affinity_score: 88,
    harmony_principle: 'regionalidade',
    recommendation_title: 'Sol e moqueca: sabores do Brasil',
    sensory_explanation: 'A leveza tropical da Sol combina com os sabores marcantes do dendê e coco da moqueca baiana.',
  },
  {
    dish_slug: 'moqueca-de-peixe',
    beer_slug: 'heineken-lager',
    affinity_score: 83,
    harmony_principle: 'contraste',
    recommendation_title: 'Heineken equilibra o dendê',
    sensory_explanation: 'A leveza da Heineken contrasta com a intensidade do dendê, equilibrando os sabores robustos da moqueca.',
  },
  {
    dish_slug: 'moqueca-de-peixe',
    beer_slug: 'eisenbahn-weizenbier',
    affinity_score: 78,
    harmony_principle: 'complemento',
    recommendation_title: 'Weizen tropical encontra a moqueca',
    sensory_explanation: 'As notas frutadas da Weizenbier complementam o coco e as especiarias da moqueca.',
  },
  // Camarão na Moranga (2 recomendações)
  {
    dish_slug: 'camarao-na-moranga',
    beer_slug: 'eisenbahn-pilsen',
    affinity_score: 85,
    harmony_principle: 'limpeza_do_paladar',
    recommendation_title: 'Pilsen refresca o cremoso da moranga',
    sensory_explanation: 'A Eisenbahn Pilsen limpa a riqueza do creme da moranga, realçando o sabor do camarão.',
  },
  {
    dish_slug: 'camarao-na-moranga',
    beer_slug: 'eisenbahn-weizenbier',
    affinity_score: 80,
    harmony_principle: 'complemento',
    recommendation_title: 'Weizen e cremosidade: harmonia suave',
    sensory_explanation: 'A Weizenbier, com sua espuma cremosa, complementa a textura aveludada do camarão na moranga.',
  },
]

// ─── Função principal ────────────────────────────────────────────────────────

async function seed(): Promise<void> {
  console.log('🌱 Iniciando seed do banco de dados...')
  console.log(`📍 MongoDB URI: ${process.env.MONGODB_URI ?? 'não definido'}`)

  await connectDB()
  console.log('✅ Conectado ao MongoDB')

  // Limpar collections (ordem inversa de dependências)
  console.log('\n🗑️  Limpando collections...')
  await RecommendationModel.deleteMany({})
  await DishModel.deleteMany({})
  await BeerModel.deleteMany({})
  await CategoryModel.deleteMany({})
  console.log('✅ Collections limpas')

  // Inserir categorias
  console.log('\n📂 Inserindo categorias...')
  const categories = await CategoryModel.insertMany(CATEGORIES)
  console.log(`✅ ${categories.length} categorias inseridas`)

  // Criar mapa de slug → _id para as categorias
  const categoryMap = new Map(categories.map((c) => [c.slug, c._id]))

  // Inserir cervejas
  console.log('\n🍺 Inserindo cervejas...')
  const beers = await BeerModel.insertMany(BEERS)
  console.log(`✅ ${beers.length} cervejas inseridas`)

  // Criar mapa de slug → _id para as cervejas
  const beerMap = new Map(beers.map((b) => [b.slug, b._id]))

  // Resolver category_id antes de inserir pratos
  const dishesWithIds = DISHES.map((d) => {
    const categoryId = categoryMap.get(d.category_slug)
    if (!categoryId) throw new Error(`Categoria não encontrada: ${d.category_slug}`)
    const { category_slug: _, ...rest } = d
    return { ...rest, category_id: categoryId }
  })

  // Inserir pratos
  console.log('\n🍽️  Inserindo pratos...')
  const dishes = await DishModel.insertMany(dishesWithIds)
  console.log(`✅ ${dishes.length} pratos inseridos`)

  // Criar mapa de slug → _id para os pratos
  const dishMap = new Map(dishes.map((d) => [d.slug, d._id]))

  // Resolver dish_id e beer_id antes de inserir recomendações
  const recsWithIds = RECOMMENDATIONS.map((r) => {
    const dishId = dishMap.get(r.dish_slug)
    const beerId = beerMap.get(r.beer_slug)
    if (!dishId) throw new Error(`Prato não encontrado: ${r.dish_slug}`)
    if (!beerId) throw new Error(`Cerveja não encontrada: ${r.beer_slug}`)
    const { dish_slug: _d, beer_slug: _b, ...rest } = r
    return { ...rest, dish_id: dishId, beer_id: beerId }
  })

  // Inserir recomendações
  console.log('\n🔗 Inserindo recomendações...')
  const recs = await RecommendationModel.insertMany(recsWithIds)
  console.log(`✅ ${recs.length} recomendações inseridas`)

  // Relatório final
  console.log('\n✅ Seed concluído com sucesso!')
  console.log('─'.repeat(40))
  console.log(`📂 Categorias: ${categories.length}`)
  console.log(`🍺 Cervejas:   ${beers.length}`)
  console.log(`🍽️  Pratos:     ${dishes.length}`)
  console.log(`🔗 Recom.:     ${recs.length}`)
  console.log('─'.repeat(40))

  // Verificar critério F06: pratos com 3+ recomendações
  const dishRecsCount = new Map<string, number>()
  for (const r of RECOMMENDATIONS) {
    dishRecsCount.set(r.dish_slug, (dishRecsCount.get(r.dish_slug) ?? 0) + 1)
  }
  const dishesWithMultipleRecs = [...dishRecsCount.entries()].filter(([, count]) => count >= 3)
  console.log(`\n🎯 Critério F06: ${dishesWithMultipleRecs.length} pratos com 3+ recomendações (mínimo: 5)`)
  if (dishesWithMultipleRecs.length < 5) {
    console.error('❌ ATENÇÃO: Critério F06 não atendido!')
  } else {
    console.log('✅ Critério F06 atendido')
  }
}

seed()
  .catch((err: unknown) => {
    console.error('❌ Erro no seed:', err)
    process.exit(1)
  })
  .finally(() => {
    void disconnectDB()
  })
