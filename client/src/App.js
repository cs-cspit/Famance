import "./App.css";
import Home from "./Components/Home";
import Myprofile from "./Components/Myprofile"
import Profile from "./Components/Profile"
import { Route, Routes } from "react-router-dom";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/myprofile" element={<Myprofile />} />
        <Route path="/:id" element={<Profile />} />
      </Routes>
    </>
  );
}

export default App;
