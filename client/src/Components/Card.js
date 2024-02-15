import React, { useState, useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import Chart from "chart.js/auto";
import "./Card.css";

function Card(props) {
  // const { id } = useParams;
  // const [graphData, setGraphData] = useState([]);
  const chartId = `myChart-${props.id}`;
  const [chartInstance, setChartInstance] = useState(null);
  const chartRef = useRef(null);

  console.log(props.graphData);

  const fullname = props.firstname + " " + props.lastname;

  useEffect(() => {
    if (props.graphData) {
      const ctx = chartRef.current.getContext("2d");
      if (chartInstance) {
        // If chart instance exists, destroy it before creating a new one
        chartInstance.destroy();
      }
      const newChartInstance = new Chart(ctx, {
        type: "line",
        data: {
          labels: props.graphData.map((entry) => entry.timestamp),
          datasets: [
            {
              label: "Price",
              data: props.graphData.map((entry) => entry.price),
              borderColor: "#63F31E",
              borderWidth: 2,
              fill: false,
              pointRadius: 0,
            },
          ],
        },
        options: {
          scales: {
            x: {
              display: false,
            },
            y: {
              display: false,
            },
          },
          plugins: {
            legend: {
              display: false,
            },
          },
        },
      });
      setChartInstance(newChartInstance);
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
              ref={chartRef}
              width="50"
              height="30"
            ></canvas>
            <span className="popuptext">Graph</span>
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
