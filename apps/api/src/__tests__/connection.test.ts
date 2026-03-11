import { connectDB, disconnectDB } from '../db/connection'

describe('connectDB', () => {
  afterAll(async () => {
    await disconnectDB()
  })

  it('retorna uma conexão mongoose válida', async () => {
    const conn = await connectDB()
    expect(conn).toBeDefined()
    expect(conn.connection.readyState).toBe(1)
  })

  it('retorna a mesma conexão em chamadas subsequentes (cache)', async () => {
    const conn1 = await connectDB()
    const conn2 = await connectDB()
    expect(conn1).toBe(conn2)
  })

  it('lança erro se MONGODB_URI não estiver definido', async () => {
    const originalUri = process.env.MONGODB_URI
    // Limpar cache para forçar nova tentativa de conexão
    if (global.mongooseCache) {
      global.mongooseCache.conn = null
      global.mongooseCache.promise = null
    }
    delete process.env.MONGODB_URI

    await expect(connectDB()).rejects.toThrow('MONGODB_URI environment variable is not set')

    // Restaurar
    process.env.MONGODB_URI = originalUri
    if (global.mongooseCache) {
      global.mongooseCache.conn = null
      global.mongooseCache.promise = null
    }
  })
})
