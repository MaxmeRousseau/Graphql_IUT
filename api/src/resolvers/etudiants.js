import { gql } from 'graphql-tag'

// Resolvers pour le modèle Prisma `Etudiant`.
// Ils attendent que l'instance Prisma soit fournie via `context.prisma`.

export const etudiantTypeDefs = gql`
	type Etudiant {
		id: Int!
		nom: String!
		prenom: String!
		email: String!
		age: Int!
		createdAt: String!
		updatedAt: String!
	}

	input CreateEtudiantInput {
		nom: String!
		prenom: String!
		email: String!
		age: Int!
	}

	input UpdateEtudiantInput {
		nom: String
		prenom: String
		email: String
		age: Int
	}

	extend type Query {
		etudiants: [Etudiant!]!
		etudiant(id: Int!): Etudiant
	}

	extend type Mutation {
		createEtudiant(input: CreateEtudiantInput!): Etudiant!
		updateEtudiant(id: Int!, input: UpdateEtudiantInput!): Etudiant!
		deleteEtudiant(id: Int!): Etudiant!
	}
`

export const etudiantResolvers = {
	Query: {
		etudiants: async (_parent, _args, { prisma }) => {
			return await prisma.etudiant.findMany()
		},
		etudiant: async (_parent, { id }, { prisma }) => {
			return await prisma.etudiant.findUnique({ where: { id } })
		},
	},
	Mutation: {
		createEtudiant: async (_parent, { input }, { prisma }) => {
			return await prisma.etudiant.create({ data: input })
		},
		updateEtudiant: async (_parent, { id, input }, { prisma }) => {
			return await prisma.etudiant.update({ where: { id }, data: input })
		},
		deleteEtudiant: async (_parent, { id }, { prisma }) => {
			return await prisma.etudiant.delete({ where: { id } })
		},
	},
}

