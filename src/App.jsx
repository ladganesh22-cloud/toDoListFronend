import { useState } from 'react'
import ToDoList from './components/ToDolist/ToDoList.jsx'



function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <ToDoList />
    </>
  )
}

export default App
