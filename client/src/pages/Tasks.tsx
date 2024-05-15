import { useEffect, useState } from 'react';
import type { RootState } from '../app/store';
import { useSelector, useDispatch } from 'react-redux';
import { setID, setToken, setUsername } from '../app/authslice';
import { useNavigate } from 'react-router-dom';
import Task from '../components/Task';
import EditTask from '../components/EditTask';
import Graph from '../components/test/Graph';
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
  const [displayEditableTask, setDisplayEditableTask] = useState(false);
  const [editableTask, setEditableTask] = useState(<div></div>);

  const config = {
    headers: { Authorization: `Bearer ${userToken}` }
  };

  function closeEditTask() {
    console.log('close edit task');
    setDisplayEditableTask(false);
  }

  function openTaskInEdit(task: taskInterface) {
    console.log('open task in edit', task.id);
    setDisplayEditableTask(true);
    setEditableTask(<EditTask key={task.id} taskData={task} closeFunction={closeEditTask} />)
  }

  useEffect(() => {
    axios
    .get(`http://localhost:3001/task/author/${userID}`, config)
    .then((res) => {
      console.log(res);
      const { data } = res;
      if (data.length > 0) {
        setTasks(data.map((task: taskInterface) =>
          <Task key={task.id} taskData={task} openTask={openTaskInEdit} />
        ));
        // setEditableTask(<EditTask key={data[0].id} taskData={data[0]} />)
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
      {displayEditableTask && (
        <div className="edit-task-container">
          {editableTask}
        </div>
      )}
      <div className="tasks-container">
        <h3>Tasks for {userID}</h3>
        <ul className="tasks-list">
          {tasks}
        </ul>
      </div>
      <Graph />
    </div>
  );
}

export default Tasks;
