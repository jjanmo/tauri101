import { dispatch, state } from '@/store'
import { changeToggleBtnStyle, renderToggleAllBtn } from './form'
import { changeFilterBtnStyle, renderActiveTodoCount, renderClearCompletedBtn, renderControlContainer } from './control'
import { Mode } from '@/types'

const $todoList = document.querySelector('.todo-list') as HTMLUListElement

export const renderList = () => {
  const { todos, filter } = state

  const filterd = filter === 'all' ? todos : todos.filter((todo) => todo.status === filter)
  const updated = filterd.map((todo) => {
    const { id, text, status } = todo
    return `
      <li key=${id} class="todo-item" id=${id}>
        <input class="todo-item-checkbox ${status}" type="checkbox"/>
        <div class="todo-content" data-mode="view">
          <div class="todo-text ${status}">${text}</div>
          <button class="todo-item-delete-btn">✕</button>
        </div>
        <div class="todo-content hidden" data-mode="edit">
          <form class="todo-item-edit-form">
            <input class="todo-item-edit-input" type="text" value="${text}" autofocus/>
          </form>
        </div>
      </li>
    `
  })

  $todoList.innerHTML = updated.join('')
}

const handleClick = (e: Event) => {
  const target = e.target as HTMLElement
  const className = target.className
  const id = target.closest('.todo-item')?.id

  if (!id) return

  if (className.includes('delete')) {
    dispatch({ type: 'DELETE_TODO', payload: { id } })
    if (state.todos.length === 0) {
      dispatch({ type: 'RESET_ALL' })
    }

    renderList()
    renderControlContainer()
    renderActiveTodoCount()
    renderToggleAllBtn()
    changeFilterBtnStyle()
    return
  }

  if (className.includes('checkbox')) {
    dispatch({ type: 'TOGGLE_TODO_ITEM', payload: { id, updatedAt: Date.now() } })

    renderList()
    renderControlContainer()
    renderActiveTodoCount()
    renderClearCompletedBtn()
    changeToggleBtnStyle()
    return
  }
}

const changeTodoItemMode = ($todoItem: Element, target: Mode) => {
  const $viewMode = $todoItem.querySelector('.todo-content[data-mode="view"]') as HTMLDivElement
  const $editMode = $todoItem.querySelector('.todo-content[data-mode="edit"]') as HTMLDivElement
  const $remove = target === 'view' ? $editMode : $viewMode
  const $add = target === 'view' ? $viewMode : $editMode
  $add.classList.remove('hidden')
  $remove.classList.add('hidden')
}

const handleDbClick = (e: Event) => {
  const target = e.target as HTMLElement
  const $todoItem = target.closest('.todo-item')

  if (!$todoItem) return

  const $todoItemForm = $todoItem.querySelector('.todo-item-edit-form') as HTMLFormElement
  const $todoItemEditInput = $todoItem.querySelector('.todo-item-edit-input') as HTMLInputElement
  changeTodoItemMode($todoItem, 'edit')
  $todoItemEditInput.focus()

  const updateTodoItemText = () => {
    const text = $todoItemEditInput.value
    dispatch({ type: 'EDIT_TODO', payload: { id: $todoItem.id, text, updatedAt: Date.now() } })

    changeTodoItemMode($todoItem, 'view')
    renderList()
  }

  $todoItemForm.addEventListener('submit', (e: Event) => {
    e.preventDefault()
    updateTodoItemText()
  })
  $todoItemEditInput.addEventListener('blur', updateTodoItemText)
}

const init = () => {
  $todoList.addEventListener('click', handleClick)
  $todoList.addEventListener('dblclick', handleDbClick)
}

init()
