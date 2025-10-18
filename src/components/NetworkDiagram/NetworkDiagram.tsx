import { useCallback, useMemo } from 'react';
import ReactFlow, {
  Controls,
  Background,
  BackgroundVariant,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
  NodeTypes,
  EdgeTypes,
} from 'reactflow';
import 'reactflow/dist/style.css';

import DeviceNode from '../DeviceNode/DeviceNode';
import ConnectionEdge from '../ConnectionEdge/ConnectionEdge';
import { PeplinkDevice } from '@/types/network.types';
import { devicesToNodes, generateEdges } from '@/utils/layoutHelpers';
import styles from './NetworkDiagram.module.css';

interface NetworkDiagramProps {
  devices: PeplinkDevice[];
}

const nodeTypes: NodeTypes = {
  deviceNode: DeviceNode,
};

const edgeTypes: EdgeTypes = {
  connectionEdge: ConnectionEdge,
};

function NetworkDiagram({ devices }: NetworkDiagramProps) {
  const initialNodes = useMemo(() => devicesToNodes(devices), [devices]);
  const initialEdges = useMemo(() => generateEdges(devices), [devices]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Update nodes and edges when devices change
  useMemo(() => {
    setNodes(devicesToNodes(devices));
    setEdges(generateEdges(devices));
  }, [devices, setNodes, setEdges]);

  const onInit = useCallback((reactFlowInstance: any) => {
    // Fit view on mount with some padding
    setTimeout(() => {
      reactFlowInstance.fitView({ padding: 0.2 });
    }, 100);
  }, []);

  return (
    <div className={styles.container}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onInit={onInit}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.1}
        maxZoom={1.5}
        defaultEdgeOptions={{
          animated: true,
        }}
      >
        <Background variant={BackgroundVariant.Dots} gap={16} size={1} />
        <Controls />
      </ReactFlow>
    </div>
  );
}

export default NetworkDiagram;
