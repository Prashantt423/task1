import React, { useEffect, useState } from "react";
import "./styles.css";
import { connect } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Homepage() {
  const [data, setData] = useState([]);
  const navigate = useNavigate()
  const fetchData = async () => {
    try {
      const res = await axios.get(
        "https://64307b10d4518cfb0e50e555.mockapi.io/workflow"
      );
      setData(res.data);
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  return (
    <>
    <div className="nav">Workflows</div>
    <div className="home">
        
      <table>
        <tr>
          <th>Name</th>
          <th>Input Type</th>
          <th>Created At</th>
        </tr>
        {data?.map((el) => (
          <tr  onClick={()=>navigate(`/${el.id}`)} key={el.id}>
            <td>{el.name}</td>
            <td>{el.input_type}</td>
            <td>{el.createdAt.split("T")[0]}</td>
          </tr>
        ))}
      </table>
    </div>
    </>
  );
}

const mapStateToProps = (state) => {
  return {
    edges: state.edges,
  };
};
export default connect(mapStateToProps)(Homepage);
