import { useEffect, useState } from 'react';
import type { RootState } from '../app/store';
import { useSelector, useDispatch } from 'react-redux';
import { setID, setToken, setUsername } from '../app/authslice';
import { useNavigate } from 'react-router-dom';
import Task from '../components/Task';
import axios from 'axios';
import '../css/tasks.css';

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

function Tasks() {
  const userID = useSelector((state: RootState) => state.auth.id);
  const userToken = useSelector((state: RootState) => state.auth.token);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);

  const config = {
    headers: { Authorization: `Bearer ${userToken}` }
  };

  useEffect(() => {
    axios
    .get(`http://localhost:3001/task/author/${userID}`, config)
    .then((res) => {
      console.log(res);
      const { data } = res;
      if (data.length > 0) {
        setTasks(data);
        setTasks(data.map((task: taskInterface) =>
          <Task key={task.id} taskData={task} />
        ));
      }
    })
    .catch((err) => {
      if (err.response.status === 401) {
        dispatch(setID(''));
        dispatch(setUsername(''));
        dispatch(setToken(''));
        navigate('/auth');
      }
      console.error(err);
    });
  }, []);

  return (
    <div className="Tasks">
      <div className="tasks-container">
        <h3>Tasks for {userID}</h3>
        <ul className="tasks-list">
          {tasks}
        </ul>
      </div>
    </div>
  );
}

export default Tasks;
