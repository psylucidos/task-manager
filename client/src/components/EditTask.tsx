import { useEffect, useState } from 'react';
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

function EditTask({ taskData, closeFunction, allTasks }: { taskData: taskInterface, closeFunction: Function, allTasks: taskInterface[] }) {
  const userToken = useSelector((state: RootState) => state.auth.token);

  const [task, setTask] = useState(taskData);
  const [previousDescription, setPreviousDescription] = useState(taskData.description);

  const [titleInEditMode, setTitleEditMode] = useState(false);
  const [descriptionInEditMode, setDescriptionEditMode] = useState(false);

  const config = {
    headers: { Authorization: `Bearer ${userToken}` }
  };

  const processedTasks: {id: string, name: string}[] =
    allTasks.filter((task) => task.id !== taskData.id)
    .map((task) => ({ id: task.id, name: task.title }));

  const [possibleDependencies, setPossibleDependencies] = useState(processedTasks);

  function submitTitle(e: { key: string; }) {
    if (e.key === 'Enter') {
      setTitleEditMode(false);
      console.log('saving title:', task.title);
      saveTask();
    }
  }

  function unfocusTitle() {
    setTitleEditMode(false);
    console.log('saving title:', task.title);
    saveTask();
  }

  function submitDescription() {
    setDescriptionEditMode(false);
    console.log('saving description:', task.description);
    saveTask();
  }

  function cancelDescription() {
    setTask({...task, description: previousDescription});
    setDescriptionEditMode(false);
    console.log('cancelled desc');
  }

  function editDescription() {
    setPreviousDescription(task.description);
    setDescriptionEditMode(true);
  }

  function submitDuedate() {
    console.log('update to date', task.duedate);
    saveTask();
  }

  function submitStatus() {
    console.log('update to status', task.status);
    saveTask();
  }

  function submitPriority() {
    console.log('update to priority', task.priority);
    saveTask();
  }

  async function saveTask() {
    console.log('saving task:', task);
  }

  useEffect(submitDuedate, [task.duedate]);
  useEffect(submitStatus, [task.status]);
  useEffect(submitPriority, [task.priority]);

  function addDependency(dependencyId: string) {
    if (!task.dependencies.includes(dependencyId)) {
      axios
        .post(`http://localhost:3001/task/${task.id}/dependency`, { dependencyId }, config)
        .then((res) => {
          setTask({
            ...task,
            dependencies: [...task.dependencies, dependencyId],
          });
        })
        .catch((err) => console.error(err));
    }
  }
  
  function removeDependency(dependencyId: string) {
    axios
      .delete(`http://localhost:3001/task/${task.id}/dependency/${dependencyId}`, config)
      .then((res) => {
        setTask({
          ...task,
          dependencies: task.dependencies.filter((id) => id !== dependencyId),
        });
      })
      .catch((err) => console.error(err));
  }

  return (
    <div className="EditTask">
      <b>#{task.id} by #{task.author}</b>
      <button onClick={() => closeFunction()}>X</button>

      <div className="task-view-mode">
        {titleInEditMode ? (
          <input
            type="text"
            value={task.title}
            onKeyDown={submitTitle}
            autoFocus
            onBlur={() => unfocusTitle()}
            onChange={(e) => setTask({...task, title: e.target.value})}
          ></input>
        ) : (
          <h3
            onClick={() => setTitleEditMode(true)}
            style={{color: task.doable ? 'black' : 'white'}}
          >{task.title}</h3>
        )}

        {descriptionInEditMode ? (
          <div className="edit-description">
            <textarea
              value={task.description}
              autoFocus
              onChange={(e) => setTask({...task, description: e.target.value})}
            ></textarea>
            <button onClick={cancelDescription}>Close</button><button onClick={submitDescription}>Save</button>
          </div>
        ) : (
          <h3
            onClick={() => editDescription()}
          >{task.description}</h3>
        )}

        <input
          type="date"
          value={task.duedate}
          onChange={(e) => setTask({...task, duedate: e.target.value})}
        ></input> {/* has listener for change */}

        <select
          value={task.priority}
          onChange={(e) => setTask({...task, priority: Number(e.target.value)})}
        > {/* has listener for change */}
          <option value="3">Priority High</option>
          <option value="2">Priority Medium</option>
          <option value="1">Priority Low</option>
          <option value="0">No Priority</option>
        </select>

        <select
          value={task.status}
          onChange={(e) => setTask({...task, status: Number(e.target.value)})}
        > {/* has listener for change */}
          <option value="2">Done</option>
          <option value="1">Doing</option>
          <option value="0">Incomplete</option>
        </select>
        
        <p>Dependencies:</p>
        <ul>
          {task.dependencies.map((dependencyId) => (
            <li key={dependencyId}>
              {dependencyId}
              <button onClick={() => removeDependency(dependencyId)}>X</button>
            </li>
          ))}
        </ul>

        <select
          value=""
          onChange={(e) => addDependency(e.target.value)}
        >
          <option value="">Add dependency</option>
          {possibleDependencies.map((dependency) => (
            <option key={dependency.id} value={dependency.id}>
              {dependency.name}
            </option>
          ))}
        </select>

        <p>Subtasks: {task.subtasks}</p>
        <p>Doable: {String(task.doable)}</p>
      </div>
    </div>
  );
}

export default EditTask;