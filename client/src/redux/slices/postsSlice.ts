import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'
import { PostInterface } from '../../types/Post.interface'
import { AppDispatch, RootState } from '../store'
import axiosInstance from '../../utils/axiosInstance'

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
  const response = await axiosInstance.get('/posts')
  if (response.status !== 200) {
    throw new Error('Failed to fetch posts')
  }
  return response.data.posts
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
    const response = await axiosInstance.post('/posts', newPostData)
    if (response.status !== 200) {
      throw new Error('Failed to add post')
    }
    await dispatch(addPostSuccess(response.data))
    await dispatch(fetchAllPosts())
  } catch (error) {
    console.error('Failed to add post', error)
  }
}

export const deletePost = (postId: string) => async (dispatch: AppDispatch) => {
  try {
    await axiosInstance.delete(`/posts/${postId}`)
    dispatch(deletePostSuccess(postId))
    dispatch(fetchAllPosts())
  } catch (error) {
    console.error('Failed to delete post', error)
  }
}

export const updatePost = (updatedPost: PostInterface) => async (dispatch: AppDispatch) => {
  try {
    const { _id, ...postData } = updatedPost

    const response = await axiosInstance.put(`/posts/${updatedPost._id}`, postData)
    if (response.status !== 200) {
      throw new Error('Failed to update post')
    }
    dispatch(updatePostSuccess(response.data))
    dispatch(fetchAllPosts())
  } catch (error) {
    console.error('Failed to update post', error)
  }
}

export const selectPosts = (state: RootState) => state.posts.posts
export const selectPostsLoading = (state: RootState) => state.posts.isLoading
export const selectPostsError = (state: RootState) => state.posts.error

export default postsSlice.reducer
