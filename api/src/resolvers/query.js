export const queryResolvers = {
  Query: {
    users: async (_parent, _args, { prisma }) => {
      return prisma.user.findMany()
    },
    user: async (_parent, { id }, { prisma }) => {
      return prisma.user.findUnique({ where: { id } })
    },
    events: async (_parent, _args, { prisma }) => {
      return prisma.event.findMany()
    },
    event: async (_parent, { id }, { prisma }) => {
      return prisma.event.findUnique({ where: { id } })
    },
  },
}
