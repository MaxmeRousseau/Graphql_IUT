export const eventResolvers = {

  Mutation: {
    createEvent: async (_parent, { title, description, dateRange, location, organizerId }, { prisma }) => {
      return prisma.event.create({
        data: {
          title,
          description,
          date_debut: new Date(dateRange.debut),
          date_fin: new Date(dateRange.fin),
          location,
          organizer: { connect: { id: organizerId } },
        },
        include: { organizer: true, participants: true },
      })
    },

    updateEvent: async (_parent, { id, title, description, dateRange, location }, { prisma }) => {
      const data = {}
      if (title !== undefined) data.title = title
      if (description !== undefined) data.description = description
      if (dateRange !== undefined) {
        data.date_debut = new Date(dateRange.debut)
        data.date_fin = new Date(dateRange.fin)
      }
      if (location !== undefined) data.location = location
      return prisma.event.update({ where: { id }, data })
    },

    deleteEvent: async (_parent, { id }, { prisma }) => {
      return prisma.event.delete({ where: { id } })
    },
  },

  Event: {
    date: (parent) => {
      // parent may already include date_debut/date_fin or may be a Prisma model instance
      const debut = parent.date_debut || parent.dateDebut || parent.debut
      const fin = parent.date_fin || parent.dateFin || parent.fin
      return {
        debut: debut ? new Date(debut).toISOString() : null,
        fin: fin ? new Date(fin).toISOString() : null,
      }
    },
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