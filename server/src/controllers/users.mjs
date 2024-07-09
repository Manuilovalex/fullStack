import { ObjectId } from 'mongodb'
import { connectDB } from '../config/mongoConfig.mjs'

export const createUserOrUsers = async (req, res, next) => {
  try {
    const db = await connectDB()
    const users = db.collection('users')
    if (Array.isArray(req.body)) {
      const result = await users.insertMany(req.body)
      const insertedIds = Object.values(result.insertedIds).map((id) => id.toString())
      res.status(201).send(`Users created with id's: ${insertedIds.join(', ')}`)
    } else {
      const result = await users.insertOne(req.body)
      res.status(201).send(`User created with id: ${result.insertedId.toString()}`)
    }
  } catch (error) {
    next(error)
  }
}

export const getUsers = async (req, res, next) => {
  try {
    const db = await connectDB()
    const users = db.collection('users')

    const page = parseInt(req.query.page) || 1
    const pageSize = parseInt(req.query.limit) || 5
    const skip = (page - 1) * pageSize

    const cursor = users
      .find({}, { projection: { username: 1, age: 1, email: 1 } })
      .skip(skip)
      .limit(pageSize)

    const usersList = await cursor.toArray()

    res.status(200).render('users/users.pug', {
      users: usersList,
      theme: res.locals.theme,
      page: page,
      pageSize: pageSize
    })
  } catch (error) {
    next(error)
  }
}

export const getUserStats = async (req, res, next) => {
  try {
    const db = await connectDB()
    const users = db.collection('users')

    const pipeline = [
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
    ]

    const cursor = users.aggregate(pipeline)
    const result = await cursor.toArray()

    const stats = result[0]

    res.status(200).render('users/stats.pug', {
      avgAge: stats.avgAge,
      totalUsers: stats.totalUsers,
      uniqueEmailCount: stats.uniqueEmailCount,
      theme: res.locals.theme
    })
  } catch (error) {
    next(error)
  }
}

export const getUser = async (req, res, next) => {
  try {
    const db = await connectDB()
    const users = db.collection('users')
    const user = await users.findOne(
      { _id: new ObjectId(req.params.id) },
      { projection: { username: 1, age: 1, email: 1 } }
    )
    if (!user) {
      return res.status(404).send('User not found')
    }
    res.status(200).render('users/user.pug', { user, theme: res.locals.theme })
  } catch (error) {
    next(error)
  }
}

export const deleteUserOrUsers = async (req, res, next) => {
  try {
    const db = await connectDB()
    const users = db.collection('users')
    if (Array.isArray(req.body)) {
      const ids = req.body.map((id) => new ObjectId(id))
      const result = await users.deleteMany({ _id: { $in: ids } })
      if (result.deletedCount === 0) {
        return res.status(404).send('No users found to delete')
      }
      res.status(200).send(`Deleted ${result.deletedCount} users`)
    } else {
      const result = await users.deleteOne({ _id: new ObjectId(req.params.id) })
      if (result.deletedCount === 0) {
        return res.status(404).send('User not found')
      }
      res.status(200).send(`User with id ${req.params.id} deleted`)
    }
  } catch (error) {
    next(error)
  }
}

export const updateUserOrUsers = async (req, res, next) => {
  try {
    const db = await connectDB()
    const users = db.collection('users')
    if (Array.isArray(req.body)) {
      const operations = req.body.map((user) => ({
        updateOne: {
          filter: { _id: new ObjectId(user._id) },
          update: { $set: { username: user.username, email: user.email } }
        }
      }))
      const result = await users.bulkWrite(operations)
      if (result.matchedCount === 0) {
        return res.status(404).send('No users found to update')
      }
      res.status(200).send(`Updated ${result.modifiedCount} users`)
    } else {
      const result = await users.updateOne({ _id: new ObjectId(req.params.id) }, { $set: req.body })
      if (result.matchedCount === 0) {
        return res.status(404).send('User not found')
      }
      res.status(200).send(`User with id ${req.params.id} updated`)
    }
  } catch (error) {
    next(error)
  }
}

export const replaceUser = async (req, res, next) => {
  try {
    const db = await connectDB()
    const users = db.collection('users')

    const result = await users.replaceOne({ _id: new ObjectId(req.params.id) }, req.body)
    if (result.matchedCount === 0) {
      return res.status(404).send('User not found')
    }
    res.status(200).send(`User with id ${req.params.id} replaced`)
  } catch (error) {
    next(error)
  }
}
