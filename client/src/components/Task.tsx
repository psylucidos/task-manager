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

function Task({ taskData }: { taskData: taskInterface }) {
  const userID = useSelector((state: RootState) => state.auth.id)
  const userToken = useSelector((state: RootState) => state.auth.token)
  const dispatch = useDispatch();

  const config = {
    headers: { Authorization: `Bearer ${userToken}` }
  };

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <li className="Task">
      <b>#{taskData.id} by #{taskData.author}</b>
      <h3 style={{color: taskData.doable ? 'black' : 'grey'}}>{taskData.title} - {taskData.status}</h3>
      <h4>{taskData.description}</h4>
      <p>Due: {taskData.duedate}</p>
      <p>Dependencies: {taskData.dependencies}</p>
      <p>Subtasks: {taskData.subtasks}</p>
    </li>
  );
}

export default Task;
