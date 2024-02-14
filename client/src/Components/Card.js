import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import Chart from "chart.js/auto";
import "./Card.css";

function Card(props) {
  const { id } = useParams;
  // const [graphData, setGraphData] = useState([]);
  const [user, setUser] = useState({});
  console.log(props.graphData);

  const fullname = props.firstname + " " + props.lastname;

  useEffect(() => {
    // Fetching all users to display their names in the graph popup
    axios
      .get("http://localhost:3001/allusers")
      .then((users) => setUser(users.data))
      .catch((err) => console.log(err));

    if (props.graphData) {
      drawChart(props.graphData);
    }
  }, [props.graphData]);

  // When the user hovers over the username, open the popup
  function handleHoverUsername() {
    var popup = document.getElementById(`popup-${props.username}`);
    popup.classList.add("show");
    setTimeout(function () {
      popup.classList.remove("show");
    }, 2000); // 2000 milliseconds (2 seconds) delay
  }

  function handleHoverCFI() {
    var popup = document.getElementById(`popup-${props.cfi}`);
    popup.classList.add("show");
    setTimeout(function () {
      popup.classList.remove("show");
    }, 2000); // 2000 milliseconds (2 seconds) delay
  }

  function handleHoverName() {
    var popup = document.getElementById(`popup-${fullname}`);
    popup.classList.add("show");
    setTimeout(function () {
      popup.classList.remove("show");
    }, 2000); // 2000 milliseconds (2 seconds) delay
  }

  function handleHoverMcap() {
    var popup = document.getElementById(`popup-${props.mcap}`);
    popup.classList.add("show");
    setTimeout(function () {
      popup.classList.remove("show");
    }, 2000); // 2000 milliseconds (2 seconds) delay
  }

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
          },
        },
      },
    });
  };

  return (
    <>
      <Link to={`/${props.id}`}>
        <div className="card">
          {props.imageURL && (
            <img
              className="cardpropic"
              src={`http://localhost:3001/${props.imageURL}`}
              alt="profile pic"
            />
          )}

          <div className="popup" onMouseEnter={handleHoverUsername}>
            <h4>{props.username}</h4>
            <span className="popuptext" id={`popup-${props.username}`}>
              Username
            </span>
          </div>

          <div className="popup" onMouseEnter={handleHoverName}>
            <h4>{fullname}</h4>
            <span className="popuptext" id={`popup-${fullname}`}>
              Name
            </span>
          </div>

          {props.graphData && (
            <div className="popup">
              <canvas
                id={`myChart-${props.id}`} // Unique ID for each chart
                width="500"
                height="300"
              ></canvas>
              <span className="popuptext" id={`popup-${fullname}`}>
                Graph
              </span>
            </div>
          )}

          <div className="popup" onMouseEnter={handleHoverCFI}>
            <h4>{props.cfi}</h4>
            <span className="popuptext" id={`popup-${props.cfi}`}>
              Market Cap
            </span>
          </div>

          <div className="popup" onMouseEnter={handleHoverMcap}>
            <h4>
              {((props.ccm + 1) * (props.ccm + 1) * 0.003 - props.cfi).toFixed(
                2
              )}
            </h4>
            <span className="popuptext" id={`popup-${props.mcap}`}>
              Price
            </span>
          </div>
        </div>
      </Link>
    </>
  );
}

export default Card;
