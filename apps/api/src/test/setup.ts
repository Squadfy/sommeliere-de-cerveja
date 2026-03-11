import { MongoMemoryServer } from 'mongodb-memory-server'

let mongod: MongoMemoryServer

export default async function setup(): Promise<void> {
  mongod = await MongoMemoryServer.create()
  const uri = mongod.getUri()
  process.env.MONGODB_URI = uri
  ;(global as Record<string, unknown>).__MONGOD__ = mongod
}
