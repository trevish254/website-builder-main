'use client'
import React, { useRef, useCallback } from 'react';
import {
    ReactFlow,
    ReactFlowProvider,
    addEdge,
    useNodesState,
    useEdgesState,
    Controls,
    useReactFlow,
    Background,
    Connection,
    Edge,
    Node,
    MiniMap
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';
import './index.css';

import Sidebar from './sidebar';
import { DnDProvider, useDnD } from './dnd-context';

import AnnotationNode from './annotation-node';
import ToolbarNode from './toolbar-node';
import ResizerNode from './resizer-node';
import CircleNode from './circle-node';
import TextInputNode from './text-input-node';
import ButtonEdge from './button-edge';
import DebugNode from './debug-node';

import {
    nodes as initialNodes,
    edges as initialEdges,
} from './initial-elements';

const nodeTypes = {
    annotation: AnnotationNode,
    tools: ToolbarNode,
    resizer: ResizerNode,
    circle: CircleNode,
    textinput: TextInputNode,
    debug: DebugNode,
};

const edgeTypes = {
    button: ButtonEdge,
};

const nodeClassName = (node: Node) => node.type || '';

let id = 0;
const getId = () => `dndnode_${id++}`;

const DnDFlow = () => {
    const reactFlowWrapper = useRef(null);
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const { screenToFlowPosition } = useReactFlow();
    const [type] = useDnD();

    const onConnect = useCallback((params: Connection) => setEdges((eds) => addEdge(params, eds)), []);

    const onDragOver = useCallback((event: React.DragEvent) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
        console.log('Flowboard: Drag Over');
    }, []);

    const onDrop = useCallback(
        (event: React.DragEvent) => {
            event.preventDefault();
            console.log('Flowboard: Drop event', { type, x: event.clientX, y: event.clientY });

            // check if the dropped element is valid
            if (!type) {
                console.warn('Flowboard: No type in DragContext');
                return;
            }

            const position = screenToFlowPosition({
                x: event.clientX,
                y: event.clientY,
            });
            console.log('Flowboard: Position', position);

            const newNode: Node = {
                id: getId(),
                type,
                position,
                data: { label: `${type} node` },
            };

            setNodes((nds) => nds.concat(newNode));
        },
        [screenToFlowPosition, type],
    );

    return (
        <div className="dndflow">
            <div className="reactflow-wrapper" ref={reactFlowWrapper}>
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    onDrop={onDrop}
                    onDragOver={onDragOver}
                    fitView
                    attributionPosition="top-right"
                    nodeTypes={nodeTypes}
                    edgeTypes={edgeTypes}
                >
                    <MiniMap zoomable pannable nodeClassName={nodeClassName} />
                    <Controls />
                    <Background />
                </ReactFlow>
            </div>
            <Sidebar />
        </div>
    );
};

export default () => (
    <ReactFlowProvider>
        <DnDProvider>
            <DnDFlow />
        </DnDProvider>
    </ReactFlowProvider>
);
