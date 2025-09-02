import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'
import { etudiantTypeDefs, etudiantResolvers } from './resolvers/etudiants.js'
import { gql } from 'graphql-tag'

import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const { PrismaClient } = require('../generated/prisma')
const prisma = new PrismaClient()

// Root schema that other modules extend
const rootTypeDefs = gql`
  type Query {
    _empty: String
  }

  type Mutation {
    _empty: String
  }
`

const server = new ApolloServer({
  typeDefs: [rootTypeDefs, etudiantTypeDefs],
  resolvers: [etudiantResolvers],
})

const { url } = await startStandaloneServer(server, {
  context: async () => ({ prisma }),
})

console.log(`🚀 Server ready at ${url}`)