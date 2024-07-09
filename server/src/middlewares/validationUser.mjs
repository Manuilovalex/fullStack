import Joi from 'joi'

const userSchema = Joi.object({
  username: Joi.string().required().min(3).max(20),
  age: Joi.number().required().min(1).max(120),
  email: Joi.string().email().required()
})

export const validateUserData = (req, res, next) => {
  const validate = (user) => {
    const { error } = userSchema.validate(user)
    return !error
  }

  if (Array.isArray(req.body)) {
    const invalidUsers = req.body.filter((user) => !validate(user))
    if (invalidUsers.length > 0) {
      return res.status(400).send('Invalid data. Username, email, and age are required for each user.')
    }
  } else {
    if (!validate(req.body)) {
      return res.status(400).send('Invalid data. Username, email, and age are required.')
    }
  }

  next()
}
