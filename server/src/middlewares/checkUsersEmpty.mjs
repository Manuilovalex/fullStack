import { User } from '../models/user.mjs'

export const checkUsersEmpty = async (req, res, next) => {
  try {
    const count = await User.countDocuments()
    if (count === 0) {
      return res.status(200).send('No users found.')
    }
    next()
  } catch (error) {
    next(error)
  }
}
