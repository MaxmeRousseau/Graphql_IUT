import 'dotenv/config'
import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { resolvers } from './resolvers/index.js'
import { wrapResolvers } from '../utils/wrapResolvers.js'
import { verifyToken } from '../utils/auth.js'

import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const { PrismaClient } = require('../generated/prisma')
const prisma = new PrismaClient()

// Load merged SDL from schema.graphql
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const schemaPath = join(__dirname, 'schema.graphql')
const typeDefs = readFileSync(schemaPath, { encoding: 'utf8' })

const wrappedResolvers = wrapResolvers(resolvers)
// console.log('Wrapped Resolvers:', wrappedResolvers)

const server = new ApolloServer({
  typeDefs,
  resolvers: wrappedResolvers,
})

const { url } = await startStandaloneServer(server, {
  context: async ({req, res}) => {
    const auth = req.headers && (req.headers.authorization || req.headers.Authorization || '')
    let user = null
    if (auth && auth.startsWith('Bearer ')) {
      const token = auth.slice(7)
      try {
        const payload = verifyToken(token)
        user = await prisma.user.findUnique({ where: { id: payload.id } })
      } catch (error) {
        console.error('Error verifying token:', error)
      }
    }
    return { prisma, user }
  },
})

console.log(`🚀 Server ready at ${url}`)