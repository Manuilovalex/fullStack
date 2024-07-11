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
  const [editingPost, setEditingPost] = useState<PostInterface | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    dispatch(fetchAllPosts() as any)
  }, [dispatch])

  const handleAddPost = () => {
    setIsModalOpen(true)
    setEditingPost(null)
  }

  const handleEditPostClick = (post: PostInterface) => {
    setIsModalOpen(true)
    setEditingPost(post)
  }

  const handleDeletePost = (postId: string) => {
    dispatch(deletePost(postId) as any)
  }

  const handleUpdatePost = (updatedPost: Partial<PostInterface>) => {
    if (editingPost && editingPost._id !== undefined) {
      const { _id, ...updatedData } = updatedPost

      const updatedPostData: PostInterface = {
        _id: editingPost._id,
        title: updatedData.title || editingPost.title || '',
        content: updatedData.content || editingPost.content || ''
      }

      dispatch(updatePost(updatedPostData) as any)
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
      handleUpdatePost(newPostData as PostInterface)
    } else {
      dispatch(addPost(newPostData as Partial<PostInterface>) as any)
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
            <li key={post._id}>
              <div>
                <strong>{post.title}</strong>
                <p>{post.content}</p>
              </div>
              <div className="button-icons">
                <button onClick={() => handleEditPostClick(post)}>
                  <FontAwesomeIcon icon={faEdit} />
                </button>
                <button onClick={() => handleDeletePost(post._id)}>
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
