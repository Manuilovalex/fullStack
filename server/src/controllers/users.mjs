import { User } from '../models/user.mjs'

export const createUserOrUsers = async (req, res, next) => {
  try {
    if (Array.isArray(req.body)) {
      const result = await User.insertMany(req.body)
      const insertedIds = result.map((doc) => doc._id.toString())
      res.status(201).json({ message: 'Users created', ids: insertedIds })
    } else {
      const user = new User(req.body)
      const result = await user.save()
      res.status(201).json({ message: 'User created', id: result._id.toString() })
    }
  } catch (error) {
    next(error)
  }
}

export const getUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1
    const pageSize = parseInt(req.query.limit) || 50
    const skip = (page - 1) * pageSize

    const users = await User.find({}).skip(skip).limit(pageSize).select('username age email')

    res.status(200).json({ users, page, pageSize })
  } catch (error) {
    next(error)
  }
}

export const getUserStats = async (req, res, next) => {
  try {
    const stats = await User.aggregate([
      {
        $group: {
          _id: null,
          avgAge: { $avg: '$age' },
          totalUsers: { $sum: 1 },
          uniqueEmails: { $addToSet: '$email' }
        }
      },
      {
        $project: {
          avgAge: 1,
          totalUsers: 1,
          uniqueEmailCount: { $size: '$uniqueEmails' }
        }
      }
    ])

    if (stats.length > 0) {
      res.status(200).json({
        avgAge: stats[0].avgAge,
        totalUsers: stats[0].totalUsers,
        uniqueEmailCount: stats[0].uniqueEmailCount
      })
    } else {
      res.status(200).json({
        avgAge: 0,
        totalUsers: 0,
        uniqueEmailCount: 0
      })
    }
  } catch (error) {
    next(error)
  }
}

export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('username age email')

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    res.status(200).json(user)
  } catch (error) {
    next(error)
  }
}

export const deleteUserOrUsers = async (req, res, next) => {
  try {
    if (Array.isArray(req.body)) {
      const ids = req.body.map((id) => id)
      const result = await User.deleteMany({ _id: { $in: ids } })
      if (result.deletedCount === 0) {
        return res.status(404).json({ message: 'No users found to delete' })
      }
      res.status(200).json({ message: `Deleted ${result.deletedCount} users` })
    } else {
      const result = await User.findByIdAndDelete(req.params.id)
      if (!result) {
        return res.status(404).json({ message: 'User not found' })
      }
      res.status(200).json({ message: `User with id ${req.params.id} deleted` })
    }
  } catch (error) {
    next(error)
  }
}

export const updateUserOrUsers = async (req, res, next) => {
  try {
    if (Array.isArray(req.body)) {
      const operations = req.body.map((user) => ({
        updateOne: {
          filter: { _id: user._id },
          update: { username: user.username, age: user.age, email: user.email }
        }
      }))
      const result = await User.bulkWrite(operations)
      if (result.matchedCount === 0) {
        return res.status(404).json({ message: 'No users found to update' })
      }
      res.status(200).json({ message: `Updated ${result.modifiedCount} users` })
    } else {
      const result = await User.findByIdAndUpdate(req.params.id, req.body, { new: true })
      if (!result) {
        return res.status(404).json({ message: 'User not found' })
      }
      res.status(200).json({ message: `User with id ${req.params.id} updated` })
    }
  } catch (error) {
    next(error)
  }
}

export const replaceUser = async (req, res, next) => {
  try {
    const result = await User.findOneAndReplace({ _id: req.params.id }, req.body, { new: true })
    if (!result) {
      return res.status(404).json({ message: 'User not found' })
    }
    res.status(200).json({ message: `User with id ${req.params.id} replaced` })
  } catch (error) {
    next(error)
  }
}
