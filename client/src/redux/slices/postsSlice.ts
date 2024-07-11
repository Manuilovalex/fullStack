import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'
import { PostInterface } from '../../types/Post.interface'
import { AppDispatch, RootState } from '../store'

interface PostsState {
  posts: PostInterface[]
  isLoading: boolean
  error: string | null
}

const initialState: PostsState = {
  posts: [],
  isLoading: false,
  error: null
}

export const fetchAllPosts = createAsyncThunk('posts/fetchAll', async () => {
  const response = await fetch('http://localhost:3000/posts')
  if (!response.ok) {
    throw new Error('Failed to fetch posts')
  }
  const data = await response.json()
  return data.posts // Убедитесь, что данные возвращаются в виде массива постов
})

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    addPostSuccess(state, action: PayloadAction<PostInterface>) {
      state.posts.push(action.payload)
    },
    deletePostSuccess(state, action: PayloadAction<string>) {
      state.posts = state.posts.filter((post) => post._id !== action.payload)
    },
    updatePostSuccess(state, action: PayloadAction<PostInterface>) {
      const updatedPost = action.payload
      const index = state.posts.findIndex((post) => post._id === updatedPost._id)
      if (index !== -1) {
        state.posts[index] = {
          ...state.posts[index],
          title: updatedPost.title,
          content: updatedPost.content
        }
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllPosts.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchAllPosts.fulfilled, (state, action: PayloadAction<PostInterface[]>) => {
        state.posts = action.payload
        state.isLoading = false
      })
      .addCase(fetchAllPosts.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message || 'Failed to fetch posts'
      })
  }
})

export const { addPostSuccess, deletePostSuccess, updatePostSuccess } = postsSlice.actions

export const addPost = (newPostData: Partial<PostInterface>) => async (dispatch: AppDispatch) => {
  try {
    const response = await fetch('http://localhost:3000/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newPostData)
    })
    const data = await response.json()
    dispatch(addPostSuccess(data))
    dispatch(fetchAllPosts()) // Обновляем список постов после добавления нового поста
  } catch (error) {
    console.error('Failed to add post', error)
  }
}

export const deletePost = (postId: string) => async (dispatch: AppDispatch) => {
  try {
    await fetch(`http://localhost:3000/posts/${postId}`, {
      method: 'DELETE'
    })
    dispatch(deletePostSuccess(postId))
    dispatch(fetchAllPosts())
  } catch (error) {
    console.error('Failed to delete post', error)
  }
}

export const updatePost = (updatedPost: PostInterface) => async (dispatch: AppDispatch) => {
  try {
    const { _id, ...postData } = updatedPost 

    const response = await fetch(`http://localhost:3000/posts/${updatedPost._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(postData)
    })

    const data = await response.json()
    dispatch(updatePostSuccess(data))
    dispatch(fetchAllPosts())
  } catch (error) {
    console.error('Failed to update post', error)
  }
}

export const selectPosts = (state: RootState) => state.posts.posts
export const selectPostsLoading = (state: RootState) => state.posts.isLoading
export const selectPostsError = (state: RootState) => state.posts.error

export default postsSlice.reducer
