import { dispatch, state } from '@/store'
import { Filter } from '@/types'
import { renderList } from './list'
import { changeToggleBtnStyle, renderToggleAllBtn } from './form'

const $controlContainer = document.querySelector('.control-container') as HTMLDivElement
const $filterContainer = document.querySelector('.filter-container') as HTMLDivElement
const $todoCount = document.querySelector('.todo-count') as HTMLDivElement
const $clearCompletedBtn = document.querySelector('.clear-completed-btn') as HTMLButtonElement
const $filterBtns = $filterContainer.querySelectorAll('button') as NodeListOf<HTMLButtonElement>

export const renderControlContainer = () => {
  const todoCount = state.todos.length
  if (todoCount === 0) $controlContainer.classList.add('hidden')
  else $controlContainer.classList.remove('hidden')
}

export const renderActiveTodoCount = () => {
  const activeTodoCount = state.todos.filter((todo) => todo.status === 'active').length
  $todoCount.textContent = `${activeTodoCount} items left`
}

export const renderClearCompletedBtn = () => {
  const completedCount = state.todos.filter((todo) => todo.status === 'completed').length
  const $btnText = $clearCompletedBtn.querySelector('& > span') as HTMLSpanElement
  if (completedCount > 0) $btnText.classList.remove('hidden')
  else $btnText.classList.add('hidden')
}

export const changeFilterBtnStyle = () => {
  const filter = state.filter
  $filterBtns.forEach((btn) => {
    if (btn.dataset.filter === filter) btn.classList.add('selected')
    else btn.classList.remove('selected')
  })
}

const handleFilterClick = (e: Event) => {
  const target = e.target as HTMLElement
  if (target.tagName !== 'BUTTON') return

  const filter = target.dataset.filter as Filter
  dispatch({ type: 'CHANGE_FILTER', payload: { filter } })

  changeFilterBtnStyle()
  renderList()
}

const handleClearCompletedBtnClick = () => {
  dispatch({ type: 'CLEAR_COMPLETED_ITEMS' })
  if (state.todos.length === 0) {
    dispatch({ type: 'RESET_ALL' })
  }

  renderList()
  renderToggleAllBtn()
  renderControlContainer()
  renderClearCompletedBtn()
  changeToggleBtnStyle()
  changeFilterBtnStyle()
  $clearCompletedBtn.blur()
}

const init = () => {
  $filterContainer.addEventListener('click', handleFilterClick)
  $clearCompletedBtn.addEventListener('click', handleClearCompletedBtnClick)
}

init()
