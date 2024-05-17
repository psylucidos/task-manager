import { useState } from 'react';
import type { RootState } from '../app/store';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';

interface taskInterface {
  id: string;
  author: string;
  duedate: string;
  priority: number;
  dependencies: string[];
  subtasks: string[];
  status: number;
  title: string;
  description: string;
  doable: boolean;
}

function AddTask({ closeFunction }: { closeFunction: Function }) {
  const userToken = useSelector((state: RootState) => state.auth.token);
  const userID = useSelector((state: RootState) => state.auth.id);

  const [task, setTask] = useState({
    title: '',
    description: '',
    duedate: '',
    priority: 0,
    status: 0,
    dependencies: [],
    subtasks: [],
    doable: true,
  });

  const config = {
    headers: { Authorization: `Bearer ${userToken}` }
  };

  async function addTask() {
    // Call API to add task
    console.log('adding task:', task);
    axios
      .post(`http://localhost:3001/task/`, { ...task, author: userID }, config)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => console.error(err));
  }

  return (
    <div className="AddTask">
      <b>Add New Task</b>
      <button onClick={() => closeFunction()}>X</button>

      <div className="task-view-mode">
        <input
          type="text"
          value={task.title}
          onChange={(e) => setTask({...task, title: e.target.value})}
          placeholder="Task Title"
        ></input>

        <textarea
          value={task.description}
          onChange={(e) => setTask({...task, description: e.target.value})}
          placeholder="Task Description"
        ></textarea>

        <input
          type="date"
          value={task.duedate}
          onChange={(e) => setTask({...task, duedate: e.target.value})}
        ></input>

        <select
          value={task.priority}
          onChange={(e) => setTask({...task, priority: Number(e.target.value)})}
        >
          <option value="3">Priority High</option>
          <option value="2">Priority Medium</option>
          <option value="1">Priority Low</option>
          <option value="0">No Priority</option>
        </select>

        <select
          value={task.status}
          onChange={(e) => setTask({...task, status: Number(e.target.value)})}
        >
          <option value="2">Done</option>
          <option value="1">Doing</option>
          <option value="0">Incomplete</option>
        </select>
        
        <button onClick={addTask}>Add Task</button>
      </div>
    </div>
  );
}

export default AddTask;