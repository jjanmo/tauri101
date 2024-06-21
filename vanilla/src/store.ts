import { State, ActionTypes } from '@/types'

const state: State = {
  todos: [],
  filter: 'all',
}

const dispatch = (action: ActionTypes) => {
  const updated = reducer(action)
  Object.assign(state, updated)
}

const reducer = (action: ActionTypes): State => {
  const type = action.type
  switch (type) {
    case 'ADD_TODO': {
      return {
        ...state,
        todos: [...state.todos, action.payload],
      }
    }
    case 'EDIT_TODO': {
      const { id, text, updatedAt } = action.payload
      return {
        ...state,
        todos: state.todos.map((todo) => (todo.id === id ? { ...todo, text, updatedAt } : todo)),
      }
    }
    case 'DELETE_TODO': {
      const { id } = action.payload
      return {
        ...state,
        todos: state.todos.filter((todo) => todo.id !== id),
      }
    }
    case 'TOGGLE_TODO_ITEM': {
      const { id, updatedAt } = action.payload
      return {
        ...state,
        todos: state.todos.map((todo) =>
          todo.id === id ? { ...todo, status: todo.status === 'active' ? 'completed' : 'active', updatedAt } : todo
        ),
      }
    }
    case 'TOGGLE_ALL_TODO_ITEMS': {
      const { status, updatedAt } = action.payload
      return {
        ...state,
        todos: state.todos.map((todo) => ({
          ...todo,
          status,
          updatedAt,
        })),
      }
    }
    case 'CLEAR_COMPLETED_ITEMS': {
      return {
        ...state,
        todos: state.todos.filter((todo) => todo.status === 'active'),
      }
    }
    case 'CHANGE_FILTER': {
      const { filter } = action.payload
      return {
        ...state,
        filter,
      }
    }
    case 'RESET_ALL': {
      return {
        todos: [],
        filter: 'all',
      }
    }
    default:
      return state
  }
}

export { state, dispatch }
