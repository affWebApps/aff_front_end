
'use client'
import  { useState } from 'react'

const page = () => {
const [task, setTask] = useState('no task added, type something')

function getInputValue(e) {
setTask(e.target.value)
}

function showState() {
    alert(task)
}

  return (
    <div className="p-10 border flex flex-col gap-5 items-center justify-center">
      <h1>Task Page</h1>
      <input type="text" className="border" onChange={getInputValue} />
      <button className="border bg-amber-200" onClick={showState}>
        alert task
      </button>
    </div>
  );
}

export default page