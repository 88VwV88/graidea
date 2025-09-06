import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken'

const jwtSecret = process.env.JWT_SECRET || 'your-default-secret-key-change-this-in-production'
const defaultExpiry = '60d' as const

export const getJwtToken = (payload: object, expiry: SignOptions['expiresIn'] = defaultExpiry) => {
  if (!jwtSecret || jwtSecret === 'your-default-secret-key-change-this-in-production') {
    throw new Error('JWT_SECRET environment variable is not set')
  }
  
  const options: SignOptions = { expiresIn: expiry }
  return jwt.sign(payload, jwtSecret, options)
}

export const verifyJwtToken = (token: string) => {
  try {
    if (!jwtSecret || jwtSecret === 'your-default-secret-key-change-this-in-production') {
      throw new Error('JWT_SECRET environment variable is not set')
    }
    
    return jwt.verify(token, jwtSecret) as JwtPayload
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      throw new Error('Token expired')
    } else {
      throw new Error('Invalid token')
    }
  }
}
