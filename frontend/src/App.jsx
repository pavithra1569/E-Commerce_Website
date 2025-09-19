import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Products from "./pages/Products";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/products" element={<Products />} />
          {/* Add other routes here */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;