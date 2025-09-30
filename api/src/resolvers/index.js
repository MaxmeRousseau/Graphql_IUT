import { userResolvers } from './user.js'
import { eventResolvers } from './event.js'
import { queryResolvers } from './query.js'
import { authResolvers } from './authResolver.js'

// Merge resolvers - keep order: Query first, then type-specific and Mutation
export const resolvers = [queryResolvers, userResolvers, eventResolvers, authResolvers]
