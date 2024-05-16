import React, { MouseEvent } from 'react';
import ReactFlowRenderer from 'react-flow-renderer';
import { Node, Edge } from 'react-flow-renderer';

interface CustomNode extends Node {
  data: {
    label: string;
    description: string;
  };
}

const tasks = [
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
    doable: true
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
    doable: false
  },
  {
    id: '3',
    author: '2fd7b3dc-44c4-4a8c-ac1d-8ede1ea509cc',
    duedate: '2024-05-05',
    priority: 0,
    dependencies: [ '2' ],
    subtasks: [],
    status: 0,
    title: 'Second task',
    description: 'description.',
    doable: false
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
    doable: false
  }
]

const nodes: CustomNode[] = [];

tasks.map((task) => {
  nodes.push({
    id: task.id,
    // type: 'custom',
    data: { 
      label: task.title, 
      description: task.description 
    },
    position: { x: Math.random()*500, y: Math.random()*500 }
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