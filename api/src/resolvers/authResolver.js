import bcrypt from 'bcryptjs'
import { signToken } from '../../utils/auth.js'

export const authResolvers = {
  Mutation: {
    login: async (_parent, { nom, password }, { prisma }) => {
      // nom is not declared unique in the Prisma schema, so use findFirst
      const user = await prisma.user.findFirst({
        where: { nom },
        select: { id: true, nom: true, age: true, password: true, role: true, createdAt: true, updatedAt: true },
      })

      if (!user) {
        throw new Error('User not found')
      }

      const valid = await bcrypt.compare(password, user.password)
      if (!valid) {
        throw new Error('Invalid password')
      }

      const token = signToken({ id: user.id, nom: user.nom, role: user.role }) // payload du token

      // exclude password from the returned user object
      const { password: _pw, ...publicUser } = user

      return {
        token,
        user: publicUser,
        role: publicUser.role || 'USER',
      }
    },
  },
};