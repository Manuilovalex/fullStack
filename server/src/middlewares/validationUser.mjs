import Joi from 'joi'

const userSchema = Joi.object({
  username: Joi.string()
    .pattern(/^[a-zA-Z0-9_]+$/)
    .required()
    .min(3)
    .max(20),
  age: Joi.number().required().min(1).max(120),
  email: Joi.string().email().required()
})

export const validateUserData = (req, res, next) => {
  const validate = (user) => {
    const { error } = userSchema.validate(user, { abortEarly: false })
    return { isValid: !error, error }
  }

  if (Array.isArray(req.body)) {
    const invalidUsers = req.body.filter((user) => !validate(user).isValid)
    if (invalidUsers.length > 0) {
      return res.status(400).json({
        message: 'Invalid data. Username, email, and age are required for each user.',
        details: invalidUsers.map((user) => validate(user).error.details)
      })
    }
  } else {
    const { isValid, error } = validate(req.body)
    if (!isValid) {
      return res.status(400).json({
        message: 'Invalid data. Username, email, and age are required.',
        details: error.details
      })
    }
  }

  next()
}
