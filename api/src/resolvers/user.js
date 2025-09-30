import bcrypt from 'bcryptjs'

export const userResolvers = {

	Mutation: {
		createUser: async (_parent, { nom, age, password }, { prisma }) => {
			const hashed = await bcrypt.hash(password, 10)
			const created = await prisma.user.create({ data: { nom, age, password: hashed } })
      delete created.password // ne pas retourner le mot de passe
			return created
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
