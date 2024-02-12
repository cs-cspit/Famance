import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar";
import Chart from "chart.js/auto";
import "./Profile.css";

function Profile() {
  const { id } = useParams();
  const [user, setUser] = useState({});
  const [cuser, setCuser] = useState({});
  const [fcoinamount, setFcoinamount] = useState(0);
  const [scoinamount, setScoinamount] = useState(0);
  const [scyouget, setScyouget] = useState(0);
  const [fcyouget, setFcyouget] = useState(0);
  const [specificBuys, setSpecificBuys] = useState([]);
  const [totalAmountBoughtInSC, setTotalAmountBoughtInSC] = useState(0);
  const [specificSells, setSpecificSells] = useState([]);
  const [totalAmountSoldInSC, setTotalAmountSoldInSC] = useState(0);
  const [graphData, setGraphData] = useState([]);

  console.log("Printing username", user.username);

  useEffect(() => {
    // Fetch user profile data
    axios
      .get(`http://localhost:3001/${id}`)
      .then((res) => setUser(res.data.user))
      .catch((err) => console.log(err));

    // Fetch logged-in user profile data including balance
    axios
      .get("http://localhost:3001/myprofile", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Assuming you store the token in localStorage
        },
      })
      .then((res) => setCuser(res.data.user))
      .catch((err) => console.log(err));

    // Fetch Specificbuys of the user whose profile is currently open
    axios
      .get(`http://localhost:3001/fetchspecificbuys/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setSpecificBuys(res.data.specificBuys);
        setTotalAmountBoughtInSC(res.data.totalAmountBoughtInSC);
      });

    // Fetch Specificsells of the user whose profile is currently open
    axios
      .get(`http://localhost:3001/graphdata/${user.username}`) // Assuming username is available in the user object
      .then((res) => {
        setGraphData(res.data);
        drawChart(res.data); // Call the function to draw the chart
      })
      .catch((err) => console.error("Error fetching graph data:", err));
  }, [id, user.username]);

  // Function to draw the chart
  // Function to draw the chart
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
          }
        }
      },
    });
  };

  // Function to draw the chart
  // Function to draw the chart

  let calculatedFcoinBalance = Math.max(0, cuser.balance - fcoinamount);

  // While buying onchange of input
  function socialCoinsYouGet(famount) {
    console.log("Printing famount", famount);
    console.log("Prinint calculatedFcoinBalance", calculatedFcoinBalance);
    if (famount <= calculatedFcoinBalance) {
      axios
        .get(`http://localhost:3001/${id}`)
        .then((res) => setUser(res.data.user))
        .catch((err) => console.log(err));

      axios
        .get("http://localhost:3001/myprofile", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Assuming you store the token in localStorage
          },
        })
        .then((res) => setCuser(res.data.user));
      calculatedFcoinBalance = Math.max(0, cuser.balance - fcoinamount);

      let x = parseFloat(famount) + parseFloat(user.cfi);
      let y = x / 0.003;

      setScyouget((Math.sqrt(y) - parseFloat(user.ccm)).toFixed(2));
    }
  }

  let calculatedScoinBalance =
    Math.max(0, totalAmountBoughtInSC - totalAmountSoldInSC) +
    parseFloat(scoinamount);

  // While selling the calculations are done here for updating balance of scoins
  function fcoinsYouGet(samount) {
    console.log("Printing samount", samount);
    console.log("Printing calculatedScoinBalance", calculatedScoinBalance);
    if (samount <= calculatedScoinBalance) {
      console.log("totalAmountBoughtInSC", totalAmountBoughtInSC);
      console.log("totalAmountSoldInSC", totalAmountSoldInSC);

      console.log("calculatedScoinBalance", calculatedScoinBalance);
      axios
        .get(`http://localhost:3001/${id}`)
        .then((res) => setUser(res.data.user))
        .catch((err) => console.log(err));

      axios
        .get("http://localhost:3001/myprofile", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Assuming you store the token in localStorage
          },
        })
        .then((res) => setCuser(res.data.user));

      calculatedScoinBalance = Math.max(
        0,
        totalAmountBoughtInSC - totalAmountSoldInSC - scoinamount
      );
      let x = user.ccm * user.ccm * 0.003;
      console.log("Printing X", x);
      let y = (user.ccm - samount) * (user.ccm - samount) * 0.003;
      console.log("Printing Y", y);
      let z = x - y;
      console.log("Printing z", z);
      setFcyouget(z.toFixed(2));
    }
  }

  function onBuy() {
    axios
      .get(`http://localhost:3001/${id}`)
      .then((res) => setUser(res.data.user))
      .catch((err) => console.log(err));

    // Fetch logged-in user profile data including balance
    axios
      .get("http://localhost:3001/myprofile", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setCuser(res.data.user);
        // Update fcoinamount and scyouget
        setFcoinamount(0);
        setScyouget(0);
      })
      .catch((err) => console.log(err));

    axios
      .post(
        "http://localhost:3001/buy",
        {
          fcoinamount,
          scyouget,
          cuserId: cuser.id,
          userId: id,
          cusername: cuser.username,
          username: user.username,
        }, // Send the fcoinamount, scyouget, and userId to the backend
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then(() => {
        // Update the user and cuser state after successfully buying coins
        axios
          .get(`http://localhost:3001/${id}`)
          .then((res) => setUser(res.data.user))
          .catch((err) => console.log(err));

        axios
          .get("http://localhost:3001/myprofile", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          })
          .then((res) => setCuser(res.data.user))
          .catch((err) => console.log(err));

        axios
          .get(`http://localhost:3001/fetchspecificbuys/${id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          })
          .then((res) => {
            setSpecificBuys(res.data.specificBuys);
            setTotalAmountBoughtInSC(res.data.totalAmountBoughtInSC);
          });

        // Fetch Specificsells of the user whose profile is currently open
        axios
          .get(`http://localhost:3001/fetchspecificsells/${id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          })
          .then((res) => {
            setSpecificSells(res.data.specificSells);
            setTotalAmountSoldInSC(res.data.totalAmountSoldInSC);
          });
        axios
          .get(`http://localhost:3001/graphdata/${user.username}`) // Assuming username is available in the user object
          .then((res) => {
            setGraphData(res.data);
            drawChart(res.data); // Call the function to draw the chart
          })
          .catch((err) => console.error("Error fetching graph data:", err));
        drawChart(graphData);
      }, [user.username])

      .catch((err) => console.log(err));
  }

  function onSell() {
    axios
      .get(`http://localhost:3001/${id}`)
      .then((res) => setUser(res.data.user))
      .catch((err) => console.log(err));

    // Fetch logged-in user profile data including balance
    axios
      .get("http://localhost:3001/myprofile", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setCuser(res.data.user);
        // Update scoinamount and fcyouget
        setScoinamount(0);
        setFcyouget(0);
      })
      .catch((err) => console.log(err));

    axios
      .post(
        "http://localhost:3001/sell",
        {
          scoinamount,
          fcyouget,
          cuserId: cuser.id,
          userId: id,
          cusername: cuser.username,
          username: user.username,
        }, // Send the scoinamount, fcyouget, and userId to the backend
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then(() => {
        // Update the user and cuser state after successfully buying coins
        axios
          .get(`http://localhost:3001/${id}`)
          .then((res) => setUser(res.data.user))
          .catch((err) => console.log(err));

        axios
          .get("http://localhost:3001/myprofile", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          })
          .then((res) => setCuser(res.data.user))
          .catch((err) => console.log(err));

        axios
          .get(`http://localhost:3001/fetchspecificbuys/${id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          })
          .then((res) => {
            setSpecificBuys(res.data.specificBuys);
            setTotalAmountBoughtInSC(res.data.totalAmountBoughtInSC);
          });

        // Fetch Specificsells of the user whose profile is currently open
        axios
          .get(`http://localhost:3001/fetchspecificsells/${id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          })
          .then((res) => {
            setSpecificSells(res.data.specificSells);
            setTotalAmountSoldInSC(res.data.totalAmountSoldInSC);
          });
        axios
          .get(`http://localhost:3001/graphdata/${user.username}`) // Assuming username is available in the user object
          .then((res) => {
            setGraphData(res.data);
            drawChart(res.data); // Call the function to draw the chart
          })
          .catch((err) => console.error("Error fetching graph data:", err));
        drawChart(graphData);
      }, [user.username])
      .catch((err) => console.log(err));
  }

  return (
    <>
      <Navbar />
      <div className="wholeprofile">
        <img
          className="profilepic"
          src={`http://localhost:3001/${user.imageURL}`}
          alt="Profile pic"
        />

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

        <div className="graphbuysell">
          <div className="graph">
            <canvas id="myChart" width="500" height="300"></canvas>
          </div>

          <div className="dual">
            {/* Buy/Deposit */}
            <div className="buybox">
              <h2>Buy {user.username} coins</h2>
              <input
                type="number"
                onChange={(e) => {
                  const famount = e.target.value;
                  setFcoinamount(famount);
                  socialCoinsYouGet(famount);
                }}
                placeholder="Enter Fcoin amount"
              />
              <h3>
                {user.username} coins you get ≈ {scyouget}
              </h3>
              <h3>Fcoin balance ≈ {cuser.balance - fcoinamount}</h3>
              <button onClick={onBuy} disabled={calculatedFcoinBalance === 0}>
                Buy
              </button>
            </div>

            {/* Sell/Withdraw */}
            <div className="sellbox">
              <h2>Withdraw {user.username} coins</h2>
              <input
                type="number"
                onChange={(e) => {
                  const samount = e.target.value;
                  setScoinamount(samount);
                  fcoinsYouGet(samount);
                }}
                placeholder={`Enter ${user.username} to sell`}
              />
              <h3>Fcoins you get ≈ {fcyouget}</h3>
              <h3>
                {user.username} coins you have ≈{" "}
                {(
                  totalAmountBoughtInSC -
                  totalAmountSoldInSC -
                  scoinamount
                ).toFixed(2)}
              </h3>
              <button onClick={onSell}>Sell</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Profile;
