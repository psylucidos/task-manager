import { useEffect, useRef, useState } from 'react';
import type { RootState } from '../app/store';
import { useSelector, useDispatch } from 'react-redux';
import { setID, setToken, setUsername } from '../app/authslice';
import { useNavigate } from 'react-router-dom';
import Task from '../components/Task';
import EditTask from '../components/EditTask';
import AddTask from '../components/AddTask'; // import the AddTask component
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
  const tasksDataRef = useRef([]);
  const [tasksData, setTasksData] = useState([]);
  const [displayEditableTask, setDisplayEditableTask] = useState(false);
  const [editableTask, setEditableTask] = useState(<div></div>);
  const [displayAddTask, setDisplayAddTask] = useState(false); // state for displaying the add task popup

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
    console.log('here are task ids:', tasksDataRef.current);
    setEditableTask(
      <EditTask
        key={task.id}
        allTasks={tasksDataRef.current}
        taskData={task}
        closeFunction={closeEditTask}
      />
    );
  }

  function closeAddTask() {
    console.log('close add task');
    setDisplayAddTask(false);
  }

  function openAddTask() {
    console.log('open add task');
    setDisplayAddTask(true);
  }

  useEffect(() => {
    axios
      .get(`http://localhost:3001/task/author/${userID}`, config)
      .then((res) => {
        console.log(res);
        const { data } = res;
        if (data.length > 0) {
          console.log('setting task data', data);
          setTasksData(data);
        }
        setTasks(data.map((task: taskInterface) =>
          <Task key={task.id} taskData={task} openTask={openTaskInEdit} />
        ));
        // setEditableTask(<EditTask key={data[0].id} taskData={data[0]} />)
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

  useEffect(() => {
    tasksDataRef.current = tasksData;
  }, [tasksData]);

  return (
    <div className="Tasks">
      {displayEditableTask && (
        <div className="edit-task-container">
          {editableTask}
        </div>
      )}
      {displayAddTask && (
        <div className="add-task-container">
          <AddTask closeFunction={closeAddTask} />
        </div>
      )}
      <div className="tasks-container">
        <h3>Tasks for {userID}</h3>
        <button onClick={openAddTask}>Add Task</button> // button to add a new task
        <ul className="tasks-list">
          {tasks}
        </ul>
      </div>
      <Graph tasks={tasksData} openTask={openTaskInEdit}/>
    </div>
  );
}

export default Tasks;