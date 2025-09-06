import Joi from 'joi'
import { Request, Response, NextFunction } from 'express'

export const signupSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  phone: Joi.string().optional(),
  roles: Joi.array().items(Joi.string().valid('admin', 'student', 'teacher')).default(['student']),
})

export const validateSignup = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { error, value } = signupSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    })

    if (error) {
      res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.details.map((err) => err.message),
      })
      return
    }

    // Replace request body with validated data
    req.body = value
    next()
  } catch (error) {
    next(error)
  }
}
