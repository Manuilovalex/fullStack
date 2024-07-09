export const validateArticleData = (req, res, next) => {
  const validate = (article) => {
    return article.title && article.content
  }

  if (Array.isArray(req.body)) {

    const invalidArticles = req.body.filter((article) => !validate(article))
    if (invalidArticles.length > 0) {
      return res.status(400).send('Invalid data. Title and content are required for each article.')
    }
  } else {

    if (!validate(req.body)) {
      return res.status(400).send('Invalid data. Title and content are required.')
    }
  }

  next()
}
