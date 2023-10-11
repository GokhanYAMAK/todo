import React, {useReducer} from "react";
import TodoList from "./components/TodoList";
import { TodosContext } from "./context/TodosContext";


const todosInitialState = {
  todos :[]
};

export default function App() {
  const [state, dispatch] = useReducer(todosReducer, todosInitialState)
  return(
    <TodosContext.Provider value={{state, dispatch}}>
      <TodoList/>
    </TodosContext.Provider>
  )
}

function todosReducer (state, action) {
  switch(action.type){
    case 'add':
      const addedToDos = [...state.todos, action.payload]
      return{...state, todos:addedToDos}
    case 'edit':
      const updatedToDo = {...action.payload}
      const updatedToDoIndex = state.todos.findIndex(t => t.id === action.payload.id)
      const updatedToDos = [
        ...state.todos.slice(0, updatedToDoIndex),
        updatedToDo,
        ...state.todos.slice(updatedToDoIndex + 1)
      ];
      return {...state, todos: updatedToDos}
    case 'delete':
      const filteredTodoState = state.todos.filter(todo => todo.id !== action.payload.id)
      return {...state, todos:filteredTodoState}
    default:
      return todosInitialState
  }
}