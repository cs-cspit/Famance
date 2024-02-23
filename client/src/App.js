import "./App.css";
import Home from "./Components/Home";
import Myprofile from "./Components/Myprofile"
import Profile from "./Components/Profile"
import Settings from "./Components/Settings"
import { Route, Routes } from "react-router-dom";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/myprofile" element={<Myprofile />} />
        <Route path="/:id" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </>
  );
}

export default App;
