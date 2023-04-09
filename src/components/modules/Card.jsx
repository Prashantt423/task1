import React, { useEffect, useState } from "react";
import "./module.css";
import { Handle, Position } from "reactflow";
import { connect } from "react-redux";
 function Card({
  input_type,
  name,
  output_type,
  id,
  data,
  isConnectable,
  connectedEdges,
  dispatch
}) {
    const [isThisNodeConnected ,setIsThisConnected] = useState(false);
  const inputData = {
    input_type: input_type,
    name: name,
    output_type: output_type,
    id:id
  };
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData(
      "application/reactflow",
      JSON.stringify({ type: "myNode", inputData: inputData })
    );
    event.dataTransfer.effectAllowed = "move";
  };
  let isCanvasCard = !Boolean(data);
  useEffect(()=>{
    setIsThisConnected(connectedEdges?.find((el)=>el.target===id ));
},[connectedEdges])
  return (
    <div
      className="moduleCard"
      onDragStart={(event) => onDragStart(event, "myNode")}
      draggable={isCanvasCard}
      style={{
        border:
          !isCanvasCard && (name === "input" || data.name !== "input") && !isThisNodeConnected
            ? "1px solid red"
            : "1px solid blue",
      }}
    >
      {!isCanvasCard && id !== "input" && (
        <Handle
          type="target"
          position={Position.Top}
          id="a"
          isConnectable={isConnectable}
        />
      )}
      <div className="in">{Boolean(data) ? data.input_type : input_type}</div>
      <div
        className="name"
        style={{
          border:
            !isCanvasCard && (name === "input" || data.name != "input") && !isThisNodeConnected
              ? "1px solid red"
              : "1px solid blue",
        }}
      >
        {Boolean(data) ? data.name : name}
      </div>
      <div className="out">
        {Boolean(data) ? data.output_type : output_type}
      </div>
      {!isCanvasCard && (
        <Handle
          type="source"
          position={Position.Bottom}
          id="b"
          isConnectable={isConnectable}
        />
      )}
    </div>
  );
}
const mapStateToProps = (state) => {
    return {
        connectedEdges: state.connectedEdges,
    };
  };
  export default connect(mapStateToProps)(Card);
  