import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashAlt, faEdit } from '@fortawesome/free-solid-svg-icons'
import Modal from '../modal/Modal'
import PostForm from '../components/form/PostForm'
import {
  fetchAllPosts,
  selectPosts,
  selectPostsError,
  selectPostsLoading,
  deletePost,
  updatePost,
  addPost
} from '../redux/slices/postsSlice'
import { PostInterface } from '../types/Post.interface'

const PostsPage = () => {
  const dispatch = useDispatch()
  const posts = useSelector(selectPosts)
  const isLoading = useSelector(selectPostsLoading)
  const error = useSelector(selectPostsError)
  const [editingPost, setEditingPost] = useState<Partial<PostInterface> | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    dispatch(fetchAllPosts('https://jsonplaceholder.typicode.com/posts?_limit=5') as any)
  }, [dispatch])

  const handleAddPost = () => {
    setIsModalOpen(true)
    setEditingPost(null)
  }

  const handleEditPostClick = (post: PostInterface) => {
    setIsModalOpen(true)
    setEditingPost(post)
  }

  const handleDeletePost = (postId: number) => {
    dispatch(deletePost(postId))
  }

  const handleUpdatePost = (updatedPost: Partial<PostInterface>) => {
    if (editingPost && editingPost.id !== undefined) {
      const updatedPostData: PostInterface = {
        id: editingPost.id,
        userId: updatedPost.userId ?? editingPost.userId ?? 0,
        title: updatedPost.title || editingPost.title || '',
        body: updatedPost.body || editingPost.body || ''
      }
      dispatch(updatePost(updatedPostData))
      setEditingPost(null)
      setIsModalOpen(false)
    }
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    setEditingPost(null)
  }

  const handleAddOrUpdatePost = (newPostData: Partial<PostInterface>) => {
    if (editingPost) {
      handleUpdatePost(newPostData)
    } else {
      dispatch(addPost(newPostData))
      setIsModalOpen(false)
    }
  }

  return (
    <div className="posts-page">
      <h1>Posts Page</h1>
      <div className="centered">
        <button className="button-post" onClick={handleAddPost}>
          Add new Post
        </button>
      </div>
      {isLoading && <p className="loading">Loading...</p>}
      {error && <h2 className="error">{error}</h2>}
      {!isLoading && !error && (
        <ul className="posts-list">
          {posts.map((post: PostInterface) => (
            <li key={post.id}>
              <div>
                <strong>{post.title}</strong>
                <p>{post.body}</p>
              </div>
              <div className="button-icons">
                <button onClick={() => handleEditPostClick(post)}>
                  <FontAwesomeIcon icon={faEdit} />
                </button>
                <button onClick={() => handleDeletePost(post.id)}>
                  <FontAwesomeIcon icon={faTrashAlt} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      {isModalOpen && (
        <Modal onClose={handleModalClose}>
          <PostForm onSubmit={handleAddOrUpdatePost} postToEdit={editingPost} />
        </Modal>
      )}
    </div>
  )
}

export default PostsPage
