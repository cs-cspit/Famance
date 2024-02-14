import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Card from "./Card";
import { useEffect, useState } from "react";
import "./Home.css";
import axios from "axios";

function Home() {
  const [users, setUsers] = useState([]);
  const [graphData, setGraphData] = useState([]);
  

  useEffect(() => {
    axios
      .get("http://localhost:3001/allusers")
      .then((response) => {
        setUsers(response.data);
        response.data.forEach((user) => {
          axios
            .get(`http://localhost:3001/graphdata/${user.username}`)
            .then((res) => {
              setGraphData((prevGraphData) => ({
                ...prevGraphData,
                [user.username]: res.data,
              }));
            })
            .catch((err) => console.error("Error fetching graph data:", err));
        });
      })
      .catch((err) => console.log(err));
  }, []);

  console.log(users)
  // console.log(graphData[0])

  return (
    <>
      <Navbar />
      <div className="both">
        <Sidebar />
        <div className="statncard">
        {users.map((user) => (
            <Card
              key={user._id}
              id={user._id}
              username={user.username}
              firstname={user.firstname}
              lastname={user.lastname}
              imageURL={user.imageURL}
              cfi={user.cfi}
              check={user.check}
              ccm={user.ccm}
              bio={user.bio}
              graphData={graphData[user.username]} // Pass graph data for specific user
            />
          ))}
        </div>
      </div>
    </>
  );
}

export default Home;
