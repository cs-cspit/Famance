import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Myprofile.css";
import Navbar from "./Navbar";
import Chart from "chart.js/auto";
import { Link, useNavigate } from "react-router-dom";


function MyProfile() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null);
  const [graphData, setGraphData] = useState([]);
  const [file, setFile] = useState(null);

  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const [username, setUsername] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [password, setPassword] = useState("");
  const [identifier, setIdentifier] = useState("");

  const isUserSignedIn = !!localStorage.getItem("token");

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get("http://localhost:3001/myprofile", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        setUser(response.data.user);

        axios
          .get(
            `http://localhost:3001/specificgraphdatum/${response.data.user.username}`
          )
          .then((res) => {
            setGraphData(res.data);
            drawChart(res.data);
          })
          .catch((err) => console.error("Error fetching graph data:", err));
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, []);

  const handleSignup = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:3001/signup", {
        username,
        firstname,
        lastname,
        email,
        bio,
        password,
      })
      .then(() => {
        setUsername("");
        setFirstname("");
        setLastname("");
        setEmail("");
        setBio("");
        setPassword("");
        window.location.reload();
      })
      .catch((err) => console.log(err));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3001/login", {
        identifier,
        password,
      });
      const token = response.data.token;
      console.log(response.data);
      const userName = response.data.user.username;

      setIdentifier("");
      setPassword("");

      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      navigate("/", { state: { id: userName } });
      window.location.reload();
      localStorage.setItem("token", token);
    } catch (err) {
      console.log(err);
    }
  };

  const drawChart = (data) => {
    const ctx = document.getElementById("myChart");

    // Check if a chart instance already exists
    if (window.myChart instanceof Chart) {
      window.myChart.destroy(); // Destroy the existing chart instance
    }

    window.myChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: data.map((entry) => entry.timestamp), // Use timestamps as labels
        datasets: [
          {
            label: "Price",
            data: data.map((entry) => entry.price), // Use prices as data points
            borderColor: "#63F31E",
            borderWidth: 2,
            fill: false,
            pointRadius: 0, // Remove dot-type circles on every point
          },
        ],
      },
      options: {
        scales: {
          x: {
            display: false, // Hide x axis
          },
          y: {
            display: false, // Hide y axis
          },
        },
        plugins: {
          legend: {
            display: false,
          },
        },
      },
    });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    try {
      const formData = new FormData();
      formData.append("image", file);

      await axios.post("http://localhost:3001/changepropic", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });
      // Fetch updated profile data
      const response = await axios.get("http://localhost:3001/myprofile", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setUser(response.data.user);
    } catch (error) {
      console.error("Error uploading profile picture:", error);
    }
  };

  const openSignupModal = () => {
    setIsSignupModalOpen(true);
  };

  const closeSignupModal = () => {
    setIsSignupModalOpen(false);
  };

  const openLoginModal = () => {
    setIsLoginModalOpen(true);
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  return (
    <>
      <Navbar />
      <div className="wholemyprofile">
        {!user ? (
          <>
            <h3>
              Please <button onClick={openSignupModal}>Signup</button>{" "}
              <button className="loginbutton" onClick={openLoginModal}>
                LogIn
              </button>
            </h3>
            {isSignupModalOpen && (
              <div onClick={closeSignupModal} className="modal">
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="modal-content"
                >
                  <span className="close" onClick={closeSignupModal}>
                    &times;
                  </span>
                  <h3>Signup</h3>
                  <br></br>
                  <form onSubmit={handleSignup}>
                    <input
                      className="signupusername"
                      type="text"
                      name="username"
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Enter username"
                    />
                    <input
                      className="signupfirstname"
                      type="text"
                      name="firstname"
                      onChange={(e) => setFirstname(e.target.value)}
                      placeholder="Enter firstname"
                    />
                    <input
                      className="signuplastname"
                      type="text"
                      name="lastname"
                      onChange={(e) => setLastname(e.target.value)}
                      placeholder="Enter lastname"
                    />
                    <input
                      className="signupemail"
                      type="text"
                      name="email"
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter email"
                    />
                    <input
                      className="signupbio"
                      type="text"
                      name="bio"
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Enter bio"
                    />
                    <input
                      className="signuppassword"
                      type="text"
                      name="password"
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter password"
                    />
                    <button className="signupbutton">Signup</button>
                  </form>
                </div>
              </div>
            )}

{isLoginModalOpen && (
            <div onClick={closeLoginModal} className="modal">
              <div
                onClick={(e) => e.stopPropagation()}
                className="modal-content"
              >
                <span className="close" onClick={closeLoginModal}>
                  &times;
                </span>
                <h3>Login</h3>
                <br></br>
                <form onSubmit={handleLogin}>
                  <input
                    className="loginidentifier"
                    type="text"
                    name="identifier"
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="Enter username or email"
                  />
                  <input
                    className="signuppassword"
                    type="text"
                    name="password"
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                  />
                  <button className="signupbutton">Login</button>
                </form>
              </div>
            </div>
          )}
          </>
        ) : (
          <>
            <img
              className="profilepic"
              src={`http://localhost:3001/${user.imageURL}`}
              alt="Profile pic"
            />
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload</button>
            <div className="info">
              <h3 className="fullname">
                {user.firstname} {user.lastname}
              </h3>
              <h3 className="username">${user.username}</h3>
              <h3 className="bio">{user.bio}</h3>
            </div>

            <div className="ccmcfiprice">
              <div className="ccm">
                <h3>Coins in circulation</h3>
                <h3>{user.ccm}</h3>
              </div>
              <div className="cfi">
                <h3>Market Cap</h3>
                <h3>{user.cfi}</h3>
              </div>
              <div className="price">
                <h3>Current Price</h3>
                <h3>
                  {" "}
                  {(
                    (user.ccm + 1) * (user.ccm + 1) * 0.003 -
                    user.ccm * user.ccm * 0.003
                  ).toFixed(2)}
                </h3>
              </div>
            </div>
            <div className="graph">
              <canvas id="myChart" width="1000" height="500"></canvas>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default MyProfile;
