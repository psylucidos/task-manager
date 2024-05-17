import React, { MouseEvent } from 'react';
import ReactFlowRenderer from 'react-flow-renderer';
import { Node, Edge } from 'react-flow-renderer';

interface CustomNode extends Node {
  data: {
    label: string;
    description: string;
  };
}

const tasks: Task[] = [
  {
    id: '1',
    author: '2fd7b3dc-44c4-4a8c-ac1d-8ede1ea509cc',
    duedate: '2024-05-05',
    priority: 0,
    dependencies: [],
    subtasks: [],
    status: 0,
    title: 'First task',
    description: 'description.',
    doable: true,
    x: 0,
    y: 0
  },
  {
    id: '2',
    author: '2fd7b3dc-44c4-4a8c-ac1d-8ede1ea509cc',
    duedate: '2024-05-05',
    priority: 0,
    dependencies: [ '1' ],
    subtasks: [],
    status: 0,
    title: 'Second task',
    description: 'description.',
    doable: false,
    x: 0,
    y: 0
  },
  {
    id: '3',
    author: '2fd7b3dc-44c4-4a8c-ac1d-8ede1ea509cc',
    duedate: '2024-05-05',
    priority: 0,
    dependencies: [],
    subtasks: [],
    status: 0,
    title: 'Second task',
    description: 'description.',
    doable: false,
    x: 0,
    y: 0
  },
  {
    id: '4',
    author: '2fd7b3dc-44c4-4a8c-ac1d-8ede1ea509cc',
    duedate: '2024-05-05',
    priority: 0,
    dependencies: [ '1' ],
    subtasks: [],
    status: 0,
    title: 'Second task',
    description: 'description.',
    doable: false,
    x: 0,
    y: 0
  }
]

interface Task {
  x: number;
  y: number;
  id: string
  author: string
  duedate: string
  priority: number
  dependencies: string[]
  subtasks: string[]
  status: number
  title: string
  description: string
  doable: boolean
}

function placeTasksInGrid(tasks: Task[]): Task[] {
  const grid: Task[][] = [];
  const margin: number = 100;
  const taskWidth: number = 200;
  const taskHeight: number = 100;

  // Create a map of tasks for easy access
  const taskMap: { [title: string]: Task } = {};
  tasks.forEach(task => {
      taskMap[task.id] = task;
  });

  // Function to place a task in the grid
  function placeTask(task: Task, x: number, y: number): Task {
      if (!grid[x]) {
          grid[x] = [];
      }
      grid[x][y] = task;
      task.x = x * (taskWidth + margin);
      task.y = y * (taskHeight + margin);

      // Place dependencies below this task
      task.dependencies.forEach((dependency, index) => {
          const dependentTask: Task = taskMap[dependency];
          placeTask(dependentTask, x, y + index + 1);
      });

      return task;
  }

  // Find tasks with no dependencies and place them in the grid
  let x: number = 0;
  tasks.forEach((task, index) => {
      tasks[index] = placeTask(task, x, 0);
      x++;
  });

  return tasks;
}

// Function to order tasks based on their dependencies
function orderTasks(tasks: Task[]): Task[] {
  const taskMap: { [name: string]: Task } = {};
  tasks.forEach(task => {
      taskMap[task.id] = task;
  });

  const orderedTasks: Task[] = [];
  const visited: { [id: string]: boolean } = {};

  function visitTask(task: Task) {
      if (visited[task.id]) {
          return;
      }
      visited[task.id] = true;

      task.dependencies.forEach(dependency => {
          visitTask(taskMap[dependency]);
      });

      orderedTasks.push(task);
  }

  tasks.forEach(task => {
      visitTask(task);
  });

  return orderedTasks;
}

// Test the functions
// const tasks: Task[] = [
//   { name: 'A', dependencies: [] },
//   { name: 'B', dependencies: ['A'] },
//   { name: 'C', dependencies: ['A'] },
//   { name: 'D', dependencies: ['B', 'C'] },
//   { name: 'E', dependencies: [] },
//   { name: 'F', dependencies: ['E'] },
// ];

const orderedTasks: Task[] = orderTasks(tasks);
const placedTasks: Task[] = placeTasksInGrid(orderedTasks);

console.log('placed tasks');
console.log(placedTasks);

const nodes: CustomNode[] = [];

tasks.map((task) => {
  nodes.push({
    id: task.id,
    // type: 'custom',
    data: { 
      label: task.title, 
      description: task.description 
    },
    position: { x: task.x, y: task.y }
  })
})

const edges: Edge[] = [];

let i = 0;
tasks.map((item) => {
  if (item.dependencies) {
    for (let dependency in item.dependencies) {
      let source = item.dependencies[dependency];
      i += 1;
      edges.push({ id: `${i}`, source: source, target: item.id })
    }
  }
});

const nodeTypes = {
  custom: ({ data }: { data: { label: string; description: string } }) => (
    <div>
      <div style={{ fontSize: '16px', fontWeight: 'bold' }}>{data.label}</div>
      <div style={{ fontSize: '12px' }}>{data.description}</div>
    </div>
  ),
};

const edgeTypes = {
  default: ({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    style = {},
  }: {
    id: string;
    sourceX: number;
    sourceY: number;
    targetX: number;
    targetY: number;
    style?: React.CSSProperties;
  }) => (
    <g>
      <defs>
        <marker
          id="arrow"
          markerWidth="10"
          markerHeight="10"
          refX="8"
          refY="3"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <path d="M0,0 L0,6 L9,3 z" fill="#000" />
        </marker>
      </defs>
      <path
        id={id}
        style={style}
        d={`M${sourceX},${sourceY} C ${sourceX} ${targetY} ${sourceX} ${targetY} ${targetX},${targetY}`}
        markerEnd="url(#arrow)"
        strokeWidth={1.5}
        stroke="#000"
        fill="none"
      />
    </g>
  ),
};

function TopologyGraph({ openTask }: { openTask: Function }) {
  const onNodeClick = (event: MouseEvent, node: Node) => {
    console.log('Node clicked:', node);
    // You can also emit an event here, or call a function passed as a prop
    openTask(node);
  };

  return (
    <div style={{ width: 800, height: 600 }}>
      <ReactFlowRenderer
        nodes={nodes}
        edges={edges}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
      />
    </div>
  );
}

export default TopologyGraph;