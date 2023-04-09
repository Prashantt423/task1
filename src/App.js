import { connect } from "react-redux";
import Homepage from "./pages/Homepage";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Workflow from "./pages/workflow";
function App() {
  return (
    <Router>
      <Routes>
       
        <Route
          path="/:id"
          name="Product"
          exact
          element={<Workflow />}
        />
      
        <Route
          path="*"
          name="Home"
          element={<Homepage />}
        />
      
      </Routes>
  </Router>
  );
}
const mapStateToProps = (state) => {
  return {
    edges: state.edges
  };
};
export default connect(mapStateToProps)(App);
