import { Article } from '../models/article.mjs'

export const checkArticlesEmpty = async (req, res, next) => {
  try {
    const count = await Article.countDocuments()
    if (count === 0) {
      return res.status(200).send('No articles found.')
    }
    next()
  } catch (error) {
    next(error)
  }
}
