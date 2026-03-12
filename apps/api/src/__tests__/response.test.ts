import { ok, notFound, badRequest, error } from '../utils/response'

const EXPECTED_HEADERS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
}

describe('response helpers', () => {
  describe('ok', () => {
    it('retorna status 200 com data envolvido', () => {
      const res = ok({ id: 1, name: 'Picanha' })
      expect(res.statusCode).toBe(200)
      expect(JSON.parse(res.body)).toEqual({ data: { id: 1, name: 'Picanha' } })
    })

    it('serializa array corretamente', () => {
      const res = ok([1, 2, 3])
      expect(res.statusCode).toBe(200)
      expect(JSON.parse(res.body)).toEqual({ data: [1, 2, 3] })
    })

    it('serializa null corretamente', () => {
      const res = ok(null)
      expect(res.statusCode).toBe(200)
      expect(JSON.parse(res.body)).toEqual({ data: null })
    })

    it('inclui os headers CORS corretos', () => {
      const res = ok({})
      expect(res.headers).toEqual(EXPECTED_HEADERS)
    })
  })

  describe('notFound', () => {
    it('retorna status 404 com a mensagem de erro', () => {
      const res = notFound('Categoria não encontrada')
      expect(res.statusCode).toBe(404)
      expect(JSON.parse(res.body)).toEqual({ error: 'Categoria não encontrada' })
    })

    it('inclui os headers CORS corretos', () => {
      const res = notFound('não encontrado')
      expect(res.headers).toEqual(EXPECTED_HEADERS)
    })
  })

  describe('badRequest', () => {
    it('retorna status 400 com a mensagem de erro', () => {
      const res = badRequest('Parâmetro de busca deve ter pelo menos 2 caracteres')
      expect(res.statusCode).toBe(400)
      expect(JSON.parse(res.body)).toEqual({
        error: 'Parâmetro de busca deve ter pelo menos 2 caracteres',
      })
    })

    it('inclui os headers CORS corretos', () => {
      const res = badRequest('requisição inválida')
      expect(res.headers).toEqual(EXPECTED_HEADERS)
    })
  })

  describe('error', () => {
    it('retorna status 500 com a mensagem de erro', () => {
      const res = error('Erro ao buscar categorias')
      expect(res.statusCode).toBe(500)
      expect(JSON.parse(res.body)).toEqual({ error: 'Erro ao buscar categorias' })
    })

    it('inclui os headers CORS corretos', () => {
      const res = error('erro interno')
      expect(res.headers).toEqual(EXPECTED_HEADERS)
    })
  })

  describe('formato do body', () => {
    it('ok serializa body como JSON string válida', () => {
      const res = ok({ a: 1 })
      expect(typeof res.body).toBe('string')
      expect(() => JSON.parse(res.body)).not.toThrow()
    })

    it('error serializa body como JSON string válida', () => {
      const res = error('falha')
      expect(typeof res.body).toBe('string')
      expect(() => JSON.parse(res.body)).not.toThrow()
    })

    it('ok não expõe chave error no body de sucesso', () => {
      const res = ok({ value: 42 })
      const body = JSON.parse(res.body)
      expect(body).not.toHaveProperty('error')
    })

    it('error não expõe chave data no body de falha', () => {
      const res = error('falha')
      const body = JSON.parse(res.body)
      expect(body).not.toHaveProperty('data')
    })
  })
})
