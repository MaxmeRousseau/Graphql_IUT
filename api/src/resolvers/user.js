import { gql } from 'graphql-tag'

// GraphQL schema for User related queries/mutations. These extend the root
// Query/Mutation types defined in the server entrypoint.
export const userTypeDefs = gql`
	extend type Query {
		users: [User!]!
		user(id: Int!): User
	}

	extend type Mutation {
		createUser(nom: String!, age: Int): User!
		updateUser(id: Int!, nom: String, age: Int): User!
		deleteUser(id: Int!): User!
		addUserToEvent(userId: Int!, eventId: Int!): Event!
	}

  type Event {
    id: Int!
    title: String!
    description: String
    date: String!
    location: String
    createdAt: String!
    updatedAt: String!
  }

	type User {
		id: Int!
		nom: String!
		age: Int
		createdAt: String!
		updatedAt: String!
		organizedEvents: [Event!]!
		eventsParticipated: [Event!]!
	}
`

export const userResolvers = {
	Query: {
		users: async (_parent, _args, { prisma }) => {
			return prisma.user.findMany()
		},
		user: async (_parent, { id }, { prisma }) => {
			return prisma.user.findUnique({ where: { id } })
		},
	},

	Mutation: {
		createUser: async (_parent, { nom, age }, { prisma }) => {
			return prisma.user.create({ data: { nom, age } })
		},

		updateUser: async (_parent, { id, nom, age }, { prisma }) => {
			const data = {}
			if (nom !== undefined) data.nom = nom
			if (age !== undefined) data.age = age
			return prisma.user.update({ where: { id }, data })
		},

		deleteUser: async (_parent, { id }, { prisma }) => {
			return prisma.user.delete({ where: { id } })
		},

		addUserToEvent: async (_parent, { userId, eventId }, { prisma }) => {
			return prisma.event.update({
				where: { id: eventId },
				data: { participants: { connect: { id: userId } } },
			})
		},
	},

	User: {
		organizedEvents: async (parent, _args, { prisma }) => {
			return prisma.event.findMany({ where: { organizerId: parent.id } })
		},

		eventsParticipated: async (parent, _args, { prisma }) => {
			return prisma.event.findMany({ where: { participants: { some: { id: parent.id } } } })
		},
	},
}
