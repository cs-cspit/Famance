import "./App.css";
import Home from "./Components/Home";
import Signup from './Components/Signup'
import Login from './Components/Login'
import { Route, Routes } from "react-router-dom";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Signup />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </>
  );
}

export default App;
