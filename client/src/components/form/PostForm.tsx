import { FormEvent, useEffect, useState } from 'react'
import { PostInterface } from '../../types/Post.interface'

interface PostFormProps {
  onSubmit: (newPostData: Partial<PostInterface>) => void
  postToEdit?: Partial<PostInterface> | null
}

const PostForm = ({ onSubmit, postToEdit }: PostFormProps) => {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  useEffect(() => {
    if (postToEdit) {
      setTitle(postToEdit.title || '')
      setContent(postToEdit.content || '')
    }
  }, [postToEdit])

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const newPostData: Partial<PostInterface> = { title, content }
    onSubmit(newPostData)
    setTitle('')
    setContent('')
  }

  return (
    <form onSubmit={handleSubmit} className="post-form">
      <h3>{postToEdit ? 'Update Post' : 'Add new post'}</h3>
      <div className="form-group">
        <label htmlFor="title">Title:</label>
        <input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter title..."
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="body">Content:</label>
        <textarea
          id="body"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Enter content..."
          required
        />
      </div>
      <button type="submit">{postToEdit ? 'Update Post' : 'Add Post'}</button>
    </form>
  )
}

export default PostForm
