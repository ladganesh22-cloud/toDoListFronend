import { useState } from 'react'
import TaskItem from './components/TaskItem/TaskItem.jsx'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <TaskItem />
    </>
  )
}

export default App
