import { gql } from 'graphql-tag'

export const eventTypeDefs = gql`
extend type Query {
  events: [Event!]!
  event(id: Int!): Event
}

extend type Mutation {
  createEvent(title: String!, description: String, date: String!, location: String!, organizerId: Int!): Event!
  updateEvent(id: Int!, title: String, description: String, date: String, location: String): Event!
  deleteEvent(id: Int!): Event!
}

type Event {
  id: Int!
  title: String!
  description: String
  date: String!
  location: String
  createdAt: String!
  updatedAt: String!
  participants: [User!]!
  organizer: User!
}

type User {
  id: Int!
}
`

export const eventResolvers = {
  Query: {
    events: async (_parent, _args, { prisma }) => {
      return prisma.event.findMany()
    },
    event: async (_parent, { id }, { prisma }) => {
      return prisma.event.findUnique({ where: { id } })
    },
  },

  Mutation: {
    createEvent: async (_parent, { title, description, date, location, organizerId }, { prisma }) => {
      return prisma.event.create({
        data: { title, description, date: new Date(date), location, organizer: { connect: { id: organizerId } } },
        include: { organizer: true, participants: true },
      })
    },

    updateEvent: async (_parent, { id, title, description, date, location }, { prisma }) => {
      const data = {}
      if (title !== undefined) data.title = title
      if (description !== undefined) data.description = description
      if (date !== undefined) data.date = new Date(date)
      if (location !== undefined) data.location = location
      return prisma.event.update({ where: { id }, data })
    },

    deleteEvent: async (_parent, { id }, { prisma }) => {
      return prisma.event.delete({ where: { id } })
    },
  },

  Event: {
    organizer: async (parent, _args, { prisma }) => {
      if (parent.organizer) return parent.organizer
      if (parent.organizerId) return prisma.user.findUnique({ where: { id: parent.organizerId } })
      return prisma.event.findUnique({ where: { id: parent.id } }).organizer()
    },

    participants: async (parent, _args, { prisma }) => {
      if (parent.participants) return parent.participants
      return prisma.event.findUnique({ where: { id: parent.id } }).participants()
    },
  },
} 