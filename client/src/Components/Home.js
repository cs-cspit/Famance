import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Card from "./Card";
import { useEffect, useState } from "react";
import "./Home.css";
import axios from "axios";

function Home() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3001/allusers")
      .then((users) => setUsers(users.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <>
      <Navbar />
      <div className="both">
        <Sidebar />
        <div className="statncard">
          {users.map((users) => (
            <Card 
              key = {users._id}
              id = {users._id}
              username = {users.username}
              firstname = {users.firstname}
              lastname = {users.lastname}
              imageURL = {users.imageURL}
              cfi = {users.cfi}
              check = {users.check}
              ccm = {users.ccm}
              bio = {users.bio}
            />
          ))}
        </div>
      </div>
    </>
  );
}

export default Home;
