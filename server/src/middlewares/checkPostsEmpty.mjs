import { Post } from '../models/post.mjs'

export const checkPostsEmpty = async (req, res, next) => {
  try {
    const count = await Post.countDocuments()
    if (count === 0) {
      return res.status(200).send('No posts found.')
    }
    next()
  } catch (error) {
    next(error)
  }
}
