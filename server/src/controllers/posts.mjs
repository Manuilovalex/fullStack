import { ObjectId } from 'mongodb'

import { connectDB } from '../config/mongoConfig.mjs'

export const createPostOrPosts = async (req, res, next) => {
  try {
    const db = await connectDB()
    const posts = db.collection('posts')
    if (Array.isArray(req.body)) {
      const result = await posts.insertMany(req.body)
      const insertedIds = Object.values(result.insertedIds).map((id) => id.toString())
      res.status(201).send(`Posts created with id's: ${insertedIds.join(', ')}`)
    } else {
      const result = await posts.insertOne(req.body)
      res.status(201).send(`Post created with id: ${result.insertedId.toString()}`)
    }
  } catch (error) {
    next(error)
  }
}

export const getPosts = async (req, res, next) => {
  try {
    const db = await connectDB()
    const posts = db.collection('posts')

    const page = parseInt(req.query.page) || 1
    const pageSize = parseInt(req.query.limit) || 5
    const skip = (page - 1) * pageSize

    const pipeline = [
      {
        $addFields: {
          contentLength: { $strLenCP: '$content' }
        }
      },
      {
        $sort: { contentLength: -1 }
      },
      {
        $skip: skip
      },
      {
        $limit: pageSize
      },
      {
        $project: {
          title: 1,
          content: 1
        }
      }
    ]

    const cursor = posts.aggregate(pipeline)
    const postsList = await cursor.toArray()

    res.status(200).render('posts/posts', {
      posts: postsList,
      theme: res.locals.theme,
      page: page,
      pageSize: pageSize
    })
  } catch (error) {
    next(error)
  }
}

export const getPostStats = async (req, res, next) => {
  try {
    const db = await connectDB()
    const posts = db.collection('posts')

    const pipeline = [
      {
        $group: {
          _id: null,
          avgContentLength: { $avg: { $strLenCP: '$content' } },
          count: { $sum: 1 }
        }
      }
    ]

    const cursor = posts.aggregate(pipeline)
    const result = await cursor.toArray()

    const stats = result[0]

    res.status(200).render('posts/stats', {
      avgContentLength: stats.avgContentLength,
      count: stats.count,
      theme: res.locals.theme
    })
  } catch (error) {
    next(error)
  }
}

export const getPost = async (req, res, next) => {
  try {
    const db = await connectDB()
    const posts = db.collection('posts')

    const post = await posts.findOne(
      { _id: new ObjectId(req.params.id) },
      { projection: { title: 1, content: 1 } }
    )

    if (!post) {
      return res.status(404).send('Post not found')
    }

    res.status(200).render('posts/post', { post, theme: res.locals.theme })
  } catch (error) {
    next(error)
  }
}

export const deletePostOrPosts = async (req, res, next) => {
  try {
    const db = await connectDB()
    const posts = db.collection('posts')
    if (Array.isArray(req.body)) {
      const ids = req.body.map((id) => new ObjectId(id))
      const result = await posts.deleteMany({ _id: { $in: ids } })
      if (result.deletedCount === 0) {
        return res.status(404).send('No posts found to delete')
      }
      res.status(200).send(`Deleted ${result.deletedCount} posts`)
    } else {
      const result = await posts.deleteOne({ _id: new ObjectId(req.params.id) })
      if (result.deletedCount === 0) {
        return res.status(404).send('Post not found')
      }
      res.status(200).send(`Post with id ${req.params.id} deleted`)
    }
  } catch (error) {
    next(error)
  }
}

export const updatePostOrPosts = async (req, res, next) => {
  try {
    const db = await connectDB()
    const posts = db.collection('posts')

    if (Array.isArray(req.body)) {
      const operations = req.body.map((post) => ({
        updateOne: {
          filter: { _id: new ObjectId(post._id) },
          update: { $set: { title: post.title, content: post.content } }
        }
      }))
      const result = await posts.bulkWrite(operations)
      if (result.matchedCount === 0) {
        return res.status(404).send('No posts found to update')
      }
      res.status(200).send(`Updated ${result.modifiedCount} posts`)
    } else {
      const result = await posts.updateOne({ _id: new ObjectId(req.params.id) }, { $set: req.body })
      if (result.matchedCount === 0) {
        return res.status(404).send('Post not found')
      }
      res.status(200).send(`Post with id ${req.params.id} updated`)
    }
  } catch (error) {
    next(error)
  }
}

export const replacePost = async (req, res, next) => {
  try {
    const db = await connectDB()
    const posts = db.collection('posts')

    const result = await posts.replaceOne({ _id: new ObjectId(req.params.id) }, req.body)
    if (result.matchedCount === 0) {
      return res.status(404).send('Post not found')
    }
    res.status(200).send(`Post with id ${req.params.id} replaced`)
  } catch (error) {
    next(error)
  }
}
