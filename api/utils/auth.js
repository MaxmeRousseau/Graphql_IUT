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
  try {
    return jwt.verify(token, SECRET)
  } catch (err) {
    return null
  }
}