import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import Canvas from "../canvas";
import Module from "../components/modules/module";
import { ReactFlowProvider } from "reactflow";
import { useParams } from "react-router-dom";
import axios from "axios";
function WorkFlow(props) {
  const [data,setData] = useState("");
  const fetchData = async ()=>{
    try{
      const res = await axios.get(`https://64307b10d4518cfb0e50e555.mockapi.io/workflow/${id}`);
      setData(res.data);
    }catch(e){
      console.log(e);
    } 
  }
  const { id } = useParams();
  console.log(id);
  useEffect(()=>{
    fetchData();
  },[])
  return (
    <div className="App">
      <div className="navbar">Workflow name : {data.name}</div>
      <ReactFlowProvider>
        <div className="box" style={{ width: "100%", height: "100%" }}>
          <div className="moduleBox">
            <div className="modules">Modules</div>
            <Module />
          </div>
          <div className="canvasBox">
            <Canvas id={id} inputType = {data.input_type} />
          </div>
        </div>
      </ReactFlowProvider>
    </div>
  );
}
const mapStateToProps = (state) => {
  return {
    edges: state.edges,
  };
};
export default connect(mapStateToProps)(WorkFlow);
