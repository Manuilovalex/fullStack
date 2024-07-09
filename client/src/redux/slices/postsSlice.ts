import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { PostInterface } from '../../types/Post.interface'
import { AppDispatch } from '../store'

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

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    fetchAllPostsStart(state) {
      state.isLoading = true
      state.error = null
    },
    fetchAllPostsSuccess(state, action: PayloadAction<PostInterface[]>) {
      state.posts = action.payload
      state.isLoading = false
    },
    fetchAllPostsFailure(state, action: PayloadAction<string>) {
      state.isLoading = false
      state.error = action.payload
    },
    addPost(state, action: PayloadAction<Partial<PostInterface>>) {
      state.posts.push({ ...action.payload, id: Date.now() } as PostInterface)
    },
    deletePost(state, action: PayloadAction<number>) {
      state.posts = state.posts.filter((post) => post.id !== action.payload)
    },
    updatePost(state, action: PayloadAction<PostInterface>) {
      const index = state.posts.findIndex((post) => post.id === action.payload.id)
      if (index !== -1) {
        state.posts[index] = action.payload
      }
    }
  }
})

export const { fetchAllPostsStart, fetchAllPostsSuccess, fetchAllPostsFailure, addPost, deletePost, updatePost } =
  postsSlice.actions

export const fetchAllPosts = (url: string) => async (dispatch: AppDispatch) => {
  dispatch(fetchAllPostsStart())
  try {
    const response = await fetch(url)
    const data = await response.json()
    dispatch(fetchAllPostsSuccess(data))
  } catch (error) {
    dispatch(fetchAllPostsFailure((error as Error).toString()))
  }
}

export const selectPosts = (state: any) => state.posts.posts
export const selectPostsLoading = (state: any) => state.posts.isLoading
export const selectPostsError = (state: any) => state.posts.error

export default postsSlice.reducer
