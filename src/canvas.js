import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import ReactFlow, {
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  getIncomers,
  getOutgoers,
  getConnectedEdges,
  ReactFlowProvider,
  Controls,
} from "reactflow";

import "reactflow/dist/style.css";
import Module from "./components/modules/module";
import Card from "./components/modules/Card";
import { v4 } from "uuid";
import { connect } from "react-redux";

let id = 0;
const getId = () => `dndnode_${id++}`;

function Canvas({ setEdgeList, connectedEdges, dispatch, inputType, id }) {
  console.log(inputType);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  const onConnect = useCallback(
    (params) => setEdges(addEdge(params, edges)),
    [edges]
  );
  const onNodesDelete = useCallback(
    (deleted) => {
      setEdges(
        deleted.reduce((acc, node) => {
          const incomers = getIncomers(node, nodes, edges);
          const outgoers = getOutgoers(node, nodes, edges);
          const connectedEdges = getConnectedEdges([node], edges);
          const remainingEdges = acc.filter(
            (edge) => !connectedEdges.includes(edge)
          );
          const createdEdges = incomers.flatMap(({ id: source }) =>
            outgoers.map(({ id: target }) => ({
              id: `${source}->${target}`,
              source,
              target,
            }))
          );

          return [...remainingEdges, ...createdEdges];
        }, edges)
      );
    },
    [nodes, edges]
  );
  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const { type, inputData } = JSON.parse(
        event.dataTransfer.getData("application/reactflow")
      );
      if (typeof type === "undefined" || !type) {
        return;
      }
      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });
      const newNode = {
        id: `${inputData.id}`,
        type,
        position,
        data: {
          input_type: `${inputData.input_type}`,
          name: `${inputData.name}`,
          output_type: `${inputData.output_type}`,
        },
      };
      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance]
  );
  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);
  const nodeTypes = useMemo(() => ({ myNode: Card }), []);
  useEffect(() => {
    dispatch({ type: "edge", value: [...edges] });
  }, [edges]);
  useEffect(() => {
    if (Boolean(inputType)) {
      const newNode = {
        id: "input",
        type: "myNode",
        position: {
          x: 100,
          y: 100,
        },
        data: { input_type:"(->)" , name: "input", output_type: `${inputType}` },
      };
      setNodes((nds) => nds.concat(newNode));
    }
  }, [inputType]);
  return (
    <div className="dndflow">
      <div className="reactflow-wrapper" ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodesDelete={onNodesDelete}
          onInit={setReactFlowInstance}
          onDrop={onDrop}
          nodeTypes={nodeTypes}
          onDragOver={onDragOver}
          fitView
        >
          <Background variant="dots" gap={12} size={1} />
          <Controls />
        </ReactFlow>
      </div>
      {/* <Module /> */}
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    connectedEdges: state.connectedEdges,
    workFlowName: state.workFlowName,
  };
};
export default connect(mapStateToProps)(Canvas);
