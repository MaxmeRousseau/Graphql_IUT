import 'dotenv/config'
import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { resolvers } from './resolvers/index.js'

import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const { PrismaClient } = require('../generated/prisma')
const prisma = new PrismaClient()

// Load merged SDL from schema.graphql
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const schemaPath = join(__dirname, 'schema.graphql')
const typeDefs = readFileSync(schemaPath, { encoding: 'utf8' })

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

const { url } = await startStandaloneServer(server, {
  context: async () => ({ prisma }),
})

console.log(`🚀 Server ready at ${url}`)