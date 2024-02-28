import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import TodoList from './components/TodoList'
import CompletedTodos from './components/CompletedTodos'
import AddTodo from './components/AddTodo'
import './App.css'

function App() {
    let todos = [
    {
      id: 1,
      title: 'Pay cable bill',
      description: 'Pay the cable bill by the 15th of the month',
      due: '3/15/2023',
      completed: false
    },
    {
      id: 2,
      title: 'Feed Dog',
      description: 'Feed the dog some food so they are happy and healthy',
      due: '1/10/2024',
      completed: false
    },
    {
      id: 3,
      title: 'Water Plants',
      description: 'Water all plants every night',
      due: '4/19/2024',
      completed: false
    },
    {
      id: 4,
      title: 'CS554 Lab',
      description: 'Finish the labs by the due date',
      due: '8/06/2024',
      completed: false
    },
    {
      id: 5,
      title: 'Buy birthday gift',
      description: 'Buy gifts for your friends bday coming up',
      due: '3/21/2024',
      completed: false
    },
    {
      id: 6,
      title: 'Clean room',
      description: 'Clean your room every week',
      due: '9/29/2023',
      completed: false
    },
    {
      id: 7,
      title: 'Study',
      description: 'Study for midterms',
      due: '3/1/2024',
      completed: false
    },
    {
      id: 8,
      title: 'Play video games',
      description: 'Its also important to take some breaks!',
      due: '1/21/2023',
      completed: false
    },
    {
      id: 9,
      title: 'Drink water',
      description: 'Stay hydrated!!!!!!',
      due: '6/12/2023',
      completed: false
    },
    {
      id: 10,
      title: 'Go on run',
      description: 'Marathon training!',
      due: '2/19/2024',
      completed: false
    }
  ]
  const [todoList, setTodoList] = useState(todos);
  let count = 11

  const deleteTodo = (id) => {
    setTodoList((prevState) => prevState.filter(item => item.id !== id))
  }

  const toggleCompleted = (todo) => {
    //for each item if id = todo, updated completed, else leave as is
    setTodoList(prevState => 
      prevState.map(item =>
        item.id === todo.id ? { ...item, completed: !item.completed }: item
      )
    )
  }

  const addTodo = (todo) => {
    todo.id = count
    setTodoList((prevState) => [...prevState, todo])
    count ++
  }

  
  return (
    <>
    <h1>
      ADD TODO ITEM
    </h1>
      <AddTodo
        addTodo = {addTodo}
      />
    <h1>
      TODO LIST
    </h1>
      <TodoList
        items = {todoList}
        deleteTodo = {deleteTodo}
        toggleCompleted = {toggleCompleted}
      />

    <h1>
      COMPLETED TODO LIST
    </h1>
      <CompletedTodos
        items = {todoList}
        toggleCompleted = {toggleCompleted}
      />
    </>
  )
}

export default App
