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
        // Create an object to accumulate graph data
        let accumulatedGraphData = {};
        // Create an array of promises for fetching graph data
        const graphDataPromises = response.data.map((user) => {
          return axios.get(`http://localhost:3001/specificgraphdatum/${user.username}`)
            .then((res) => {
              accumulatedGraphData[user.username] = res.data;
            })
            .catch((err) => console.error("Error fetching graph data:", err));
        });
        // Wait for all promises to resolve
        Promise.all(graphDataPromises)
          .then(() => {
            // Once all promises are resolved, update the state with the accumulated graph data
            setGraphData(accumulatedGraphData);
          });
      })
      .catch((err) => console.error("Error fetching users:", err));
  }, []);

  // console.log(users.id)
  console.log("Users", users)
  console.log("Graph Data",graphData)
  

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
              graphData={graphData[user.username]}
               // Pass graph data for specific user
            />
          ))}
        </div>
      </div>
    </>
  );
}

export default Home;
