import { createContext } from 'react'
import { TodoContextInterface } from '../types/todo/TodoContext.interface'
import { initialState } from './initialState.ts'

export const TodoContext = createContext<TodoContextInterface>(initialState)
