import { Post } from "../models/post.mjs"

export const validatePostData = (req, res, next) => {
  const validate = (post) => {
    const postInstance = new Post(post)
    const error = postInstance.validateSync()
    return !error
  }

  if (Array.isArray(req.body)) {
    const invalidPosts = req.body.filter((post) => !validate(post))
    if (invalidPosts.length > 0) {
      return res.status(400).send('Invalid data. Title and content are required for each post.')
    }
  } else {
    if (!validate(req.body)) {
      return res.status(400).send('Invalid data. Title and content are required.')
    }
  }

  next()
}
