import { FormEvent, useEffect, useState } from 'react'
import { PostInterface } from '../../types/Post.interface'

interface PostFormProps {
  onSubmit: (newPostData: Partial<PostInterface>) => void
  postToEdit?: Partial<PostInterface> | null
}

const PostForm = ({ onSubmit, postToEdit }: PostFormProps) => {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [userId, setUserId] = useState<number>(0)

  useEffect(() => {
    if (postToEdit) {
      setTitle(postToEdit.title || '')
      setBody(postToEdit.body || '')
      setUserId(postToEdit.userId ?? 0)
    }
  }, [postToEdit])

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const newPostData: Partial<PostInterface> = { title, body, userId }
    onSubmit(newPostData)
    setTitle('')
    setBody('')
    setUserId(0)
  }

  return (
    <form onSubmit={handleSubmit} className="post-form">
      <h3>Add new post</h3>
      <div className="form-group">
        <label htmlFor="title">Title:</label>
        <input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter title..." required />
      </div>
      <div className="form-group">
        <label htmlFor="body">Body:</label>
        <textarea id="body" value={body} onChange={(e) => setBody(e.target.value)} placeholder="Enter body..." required />
      </div>
      <div className="form-group">
        <label htmlFor="userId">User ID:</label>
        <input
          id="userId"
          type="number"
          value={userId !== undefined ? userId : ''}
          onChange={(e) => setUserId(Number(e.target.value))}
          placeholder="Enter user ID..."
          required
        />
      </div>
      <button type="submit">{postToEdit ? 'Update Post' : 'Add Post'}</button>
    </form>
  )
}

export default PostForm
