import { v4 as uuidv4 } from 'uuid';
import { state, dispatch } from '@/store';
import { Todo } from '@/types';
import { renderList } from '@/components/list';
import { renderActiveTodoCount, renderClearCompletedBtn, renderControlContainer } from './control';

const $todoForm = document.querySelector('.todo-form') as HTMLFormElement;
const $todoInput = document.querySelector('.todo-input') as HTMLInputElement;
const $allToggleBtn = document.querySelector('.all-toggle-btn') as HTMLButtonElement;

const handleSubmit = (e: Event) => {
  e.preventDefault();
  const text = $todoInput.value;
  if (!text) return;

  const todo: Todo = {
    id: uuidv4(),
    text,
    status: 'active',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  dispatch({ type: 'ADD_TODO', payload: todo });

  renderList();
  renderToggleAllBtn();
  renderControlContainer();
  renderActiveTodoCount();
  changeToggleBtnStyle();
  $todoInput.value = '';
};

export const renderToggleAllBtn = () => {
  const todoCount = state.todos.length;
  if (todoCount === 0) $allToggleBtn.classList.add('hidden');
  else $allToggleBtn.classList.remove('hidden');
};

export const changeToggleBtnStyle = () => {
  const isAllCompleted = state.todos.every((todo) => todo.status === 'completed');
  if (isAllCompleted) $allToggleBtn.classList.add('all-completed');
  else $allToggleBtn.classList.remove('all-completed');
};

const handleToggleAllBtnClick = () => {
  const isAllCompleted = state.todos.every((todo) => todo.status === 'completed');
  dispatch({
    type: 'TOGGLE_ALL_TODO_ITEMS',
    payload: { updatedAt: Date.now(), status: isAllCompleted ? 'active' : 'completed' },
  });

  changeToggleBtnStyle();
  renderClearCompletedBtn();
  renderControlContainer();
  renderActiveTodoCount();
  renderList();
};

const init = () => {
  $todoForm.addEventListener('submit', handleSubmit);
  $todoInput.addEventListener('blur', handleSubmit);
  $allToggleBtn.addEventListener('click', handleToggleAllBtnClick);
};

init();
