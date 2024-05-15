import React from 'react';
import ReactFlowRenderer from 'react-flow-renderer';
import { Node, Edge } from 'react-flow-renderer';

interface CustomNode extends Node {
  data: {
    label: string;
  };
}

const nodes: CustomNode[] = [
  {
    id: '1',
    type: 'input',
    data: { label: 'Node 1' },
    position: { x: 250, y: 25 },
  },
  {
    id: '2',
    data: { label: 'Node 2' },
    position: { x: 100, y: 125 },
  },
  {
    id: '3',
    data: { label: 'Node 3' },
    position: { x: 400, y: 125 },
  },
];

const edges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2' },
  { id: 'e2-3', source: '2', target: '3' },
];

function TopologyGraph() {
  return (
    <div style={{ width: 800, height: 600 }}>
      <ReactFlowRenderer
        nodes={nodes}
        edges={edges}
        nodeTypes={{
          input: () => <div>Input Node</div>,
        }}
      />
    </div>
  );
}

export default TopologyGraph;