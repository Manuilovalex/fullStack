import { ObjectId } from 'mongodb'

import { connectDB } from '../config/mongoConfig.mjs'

export const createArticleOrArticles = async (req, res, next) => {
  try {
    const db = await connectDB()
    const articles = db.collection('articles')
    if (Array.isArray(req.body)) {
      const result = await articles.insertMany(req.body)
      const insertedIds = Object.values(result.insertedIds).map((id) => id.toString())
      res.status(201).send(`Articles created with id's: ${insertedIds.join(', ')}`)
    } else {
      const result = await articles.insertOne(req.body)
      res.status(201).send(`Article created with id: ${result.insertedId.toString()}`)
    }
  } catch (error) {
    next(error)
  }
}

export const getArticles = async (req, res, next) => {
  try {
    const db = await connectDB()
    const articles = db.collection('articles')

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

    const cursor = articles.aggregate(pipeline)
    const articlesList = await cursor.toArray()

    res.status(200).render('articles/articles', {
      articles: articlesList,
      theme: res.locals.theme,
      page: page,
      pageSize: pageSize
    })
  } catch (error) {
    next(error)
  }
}

export const getArticleStats = async (req, res, next) => {
  try {
    const db = await connectDB()
    const articles = db.collection('articles')

    const pipeline = [
      {
        $group: {
          _id: null,
          avgContentLength: { $avg: { $strLenCP: '$content' } },
          count: { $sum: 1 }
        }
      }
    ]

    const cursor = articles.aggregate(pipeline)
    const result = await cursor.toArray()

    const stats = result[0]

    res.status(200).render('articles/stats', {
      avgContentLength: stats.avgContentLength,
      count: stats.count,
      theme: res.locals.theme
    })
  } catch (error) {
    next(error)
  }
}

export const getArticle = async (req, res, next) => {
  try {
    const db = await connectDB()
    const articles = db.collection('articles')

    const article = await articles.findOne(
      { _id: new ObjectId(req.params.id) },
      { projection: { title: 1, content: 1 } }
    )

    if (!article) {
      return res.status(404).send('Article not found')
    }

    res.status(200).render('articles/article', { article, theme: res.locals.theme })
  } catch (error) {
    next(error)
  }
}

export const deleteArticleOrArticles = async (req, res, next) => {
  try {
    const db = await connectDB()
    const articles = db.collection('articles')
    if (Array.isArray(req.body)) {
      const ids = req.body.map((id) => new ObjectId(id))
      const result = await articles.deleteMany({ _id: { $in: ids } })
      if (result.deletedCount === 0) {
        return res.status(404).send('No articles found to delete')
      }
      res.status(200).send(`Deleted ${result.deletedCount} articles`)
    } else {
      const result = await articles.deleteOne({ _id: new ObjectId(req.params.id) })
      if (result.deletedCount === 0) {
        return res.status(404).send('Article not found')
      }
      res.status(200).send(`Article with id ${req.params.id} deleted`)
    }
  } catch (error) {
    next(error)
  }
}

export const updateArticleOrArticles = async (req, res, next) => {
  try {
    const db = await connectDB()
    const articles = db.collection('articles')

    if (Array.isArray(req.body)) {
      const operations = req.body.map((article) => ({
        updateOne: {
          filter: { _id: new ObjectId(article._id) },
          update: { $set: { title: article.title, content: article.content } }
        }
      }))
      const result = await articles.bulkWrite(operations)
      if (result.matchedCount === 0) {
        return res.status(404).send('No articles found to update')
      }
      res.status(200).send(`Updated ${result.modifiedCount} articles`)
    } else {
      const result = await articles.updateOne({ _id: new ObjectId(req.params.id) }, { $set: req.body })
      if (result.matchedCount === 0) {
        return res.status(404).send('Article not found')
      }
      res.status(200).send(`Article with id ${req.params.id} updated`)
    }
  } catch (error) {
    next(error)
  }
}

export const replaceArticle = async (req, res, next) => {
  try {
    const db = await connectDB()
    const articles = db.collection('articles')

    const result = await articles.replaceOne({ _id: new ObjectId(req.params.id) }, req.body)
    if (result.matchedCount === 0) {
      return res.status(404).send('Article not found')
    }
    res.status(200).send(`Article with id ${req.params.id} replaced`)
  } catch (error) {
    next(error)
  }
}
