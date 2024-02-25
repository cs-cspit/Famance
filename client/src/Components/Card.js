import React, { useState, useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import Chart from "chart.js/auto";
import "./Card.css";

function Card(props) {
  const chartId = `myChart-${props.id}`;
  const [chartInstance, setChartInstance] = useState(null);
  const chartRef = useRef(null);

  const fullname = props.firstname + " " + props.lastname;

  useEffect(() => {
    let newChartInstance = null;

    if (props.graphData && chartRef.current) {
      if (chartInstance) {
        chartInstance.destroy(); // Destroy the previous chart instance
      }

      const ctx = chartRef.current.getContext("2d");
      newChartInstance = new Chart(ctx, {
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

    // Cleanup function
    return () => {
      if (newChartInstance) {
        newChartInstance.destroy();
      }
    };
  }, [props.graphData]); // Only re-run the effect if props.graphData changes

  // Function to handle hover events
  function handleHover(event, targetId) {
    const popup = document.getElementById(`popup-${targetId}`);
    popup.classList.add("show");
    setTimeout(function () {
      popup.classList.remove("show");
    }, 2000); // 2000 milliseconds (2 seconds) delay
  }

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

          <div
            className="popup"
            onMouseEnter={(e) => handleHover(e, props.username)}
          >
            <h4>{props.username}</h4>
            <span className="popuptext" id={`popup-${props.username}`}>
              Username
            </span>
          </div>

          <div className="popup" onMouseEnter={(e) => handleHover(e, fullname)}>
            <h4>{fullname}</h4>
            <span className="popuptext" id={`popup-${fullname}`}>
              Name
            </span>
          </div>

          {props.graphData && (
            <div className="popup">
              <canvas ref={chartRef} width="50" height="30"></canvas>
              <span className="popuptext">Graph</span>
            </div>
          )}

          <div
            className="popup"
            onMouseEnter={(e) => handleHover(e, `cfi-${props.id}`)}
          >
            <h4>{(props.cfi).toFixed(2)}</h4>
            <span className="popuptext" id={`popup-cfi-${props.id}`}>
              Market Cap
            </span>
          </div>

          <div
            className="popup"
            onMouseEnter={(e) => handleHover(e, `price-${props.id}`)}
          >
            <h4>
              {(
                (props.ccm + 1) * (props.ccm + 1) * 0.003 -
                props.ccm * props.ccm * 0.003
              ).toFixed(2)}
            </h4>
            <span className="popuptext" id={`popup-price-${props.id}`}>
              Price
            </span>
          </div>
        </div>
      </Link>
    </>
  );
}

export default Card;
