import { Post } from '../models/post.mjs'

export const createPostOrPosts = async (req, res, next) => {
  try {
    if (Array.isArray(req.body)) {
      const result = await Post.insertMany(req.body)
      const insertedIds = result.map((doc) => doc._id.toString())
      res.status(201).json({ message: 'Posts created', ids: insertedIds })
    } else {
      const post = new Post(req.body)
      const result = await post.save()
      res.status(201).json({ message: 'Post created', id: result._id.toString() })
    }
  } catch (error) {
    next(error)
  }
}

export const getPosts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1
    const pageSize = parseInt(req.query.limit) || 50
    const skip = (page - 1) * pageSize

    const posts = await Post.find({}).sort({ content: -1 }).skip(skip).limit(pageSize).select('title content')

    res.status(200).json({ posts, page, pageSize })
  } catch (error) {
    next(error)
  }
}

export const getPostStats = async (req, res, next) => {
  try {
    const stats = await Post.aggregate([
      {
        $group: {
          _id: null,
          avgContentLength: { $avg: { $strLenCP: '$content' } },
          count: { $sum: 1 }
        }
      }
    ])

    if (stats.length > 0) {
      res.status(200).json({ avgContentLength: stats[0].avgContentLength, count: stats[0].count })
    } else {
      res.status(200).json({ avgContentLength: 0, count: 0 })
    }
  } catch (error) {
    next(error)
  }
}

export const getPost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id).select('title content')

    if (!post) {
      return res.status(404).json({ message: 'Post not found' })
    }

    res.status(200).json(post)
  } catch (error) {
    next(error)
  }
}

export const deletePostOrPosts = async (req, res, next) => {
  try {
    if (Array.isArray(req.body)) {
      const ids = req.body.map((id) => id)
      const result = await Post.deleteMany({ _id: { $in: ids } })
      if (result.deletedCount === 0) {
        return res.status(404).json({ message: 'No posts found to delete' })
      }
      res.status(200).json({ message: `Deleted ${result.deletedCount} posts` })
    } else {
      const result = await Post.findByIdAndDelete(req.params.id)
      if (!result) {
        return res.status(404).json({ message: 'Post not found' })
      }
      res.status(200).json({ message: `Post with id ${req.params.id} deleted` })
    }
  } catch (error) {
    next(error)
  }
}

export const updatePostOrPosts = async (req, res, next) => {
  try {
    if (Array.isArray(req.body)) {
      const operations = req.body.map((post) => ({
        updateOne: {
          filter: { _id: post._id },
          update: { title: post.title, content: post.content }
        }
      }))
      const result = await Post.bulkWrite(operations)
      if (result.matchedCount === 0) {
        return res.status(404).json({ message: 'No posts found to update' })
      }
      res.status(200).json({ message: `Updated ${result.modifiedCount} posts` })
    } else {
      const result = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true })
      if (!result) {
        return res.status(404).json({ message: 'Post not found' })
      }
      res.status(200).json({ message: `Post with id ${req.params.id} updated` })
    }
  } catch (error) {
    next(error)
  }
}

export const replacePost = async (req, res, next) => {
  try {
    const result = await Post.findOneAndReplace({ _id: req.params.id }, req.body, { new: true })
    if (!result) {
      return res.status(404).json({ message: 'Post not found' })
    }
    res.status(200).json({ message: `Post with id ${req.params.id} replaced` })
  } catch (error) {
    next(error)
  }
}
