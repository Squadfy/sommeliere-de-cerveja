import mongoose from 'mongoose'

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: {
    conn: typeof mongoose | null
    promise: Promise<typeof mongoose> | null
  }
}

if (!global.mongooseCache) {
  global.mongooseCache = { conn: null, promise: null }
}

export async function connectDB(): Promise<typeof mongoose> {
  if (global.mongooseCache.conn) {
    return global.mongooseCache.conn
  }

  if (!global.mongooseCache.promise) {
    const uri = process.env.MONGODB_URI
    if (!uri) {
      throw new Error('MONGODB_URI environment variable is not set')
    }

    global.mongooseCache.promise = mongoose
      .connect(uri, { bufferCommands: false })
      .catch((err: unknown) => {
        // Limpa o cache para permitir retry na próxima invocação
        global.mongooseCache.promise = null
        throw err
      })
  }

  global.mongooseCache.conn = await global.mongooseCache.promise
  return global.mongooseCache.conn
}

export async function disconnectDB(): Promise<void> {
  if (global.mongooseCache.conn) {
    await mongoose.disconnect()
    global.mongooseCache.conn = null
    global.mongooseCache.promise = null
  }
}
