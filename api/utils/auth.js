import jwt from 'jsonwebtoken'

const SECRET = process.env.JWT_SECRET

if (!SECRET) {
  // Fail fast with a clear message when JWT secret is missing
  throw new Error('JWT_SECRET environment variable is not set. Set it in .env or your environment.')
}

export function signToken(payload, expiresIn = '1h') {
  return jwt.sign(payload, SECRET, { expiresIn })
}

export function verifyToken(token) {
  if (!token) {
    throw new Error('No token provided')
  }
  if (!SECRET) {
    throw new Error('JWT_SECRET environment variable is not set')
  }
  try {
    return jwt.verify(token, SECRET)
  } catch (err) {
    throw new Error('Invalid or expired token')
  }
}

export const requireAuth = (resolver) => (parent, args, ctx, info) => {
  if (!ctx.user) {
    throw new Error('Unauthorized')
  }
  return resolver(parent, args, ctx, info)
}