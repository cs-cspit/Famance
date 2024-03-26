import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import PortfolioLeftCard from "./PortfolioLeftCard";
import PortfolioRightCard from "./PortfolioRightCard";
import axios from "axios";
import Chart from "chart.js/auto";
import "./Portfolio.css";

function Portfolio() {
  const [portfolioBuys, setPortfolioBuys] = useState([]);
  const [portfolioSells, setPortfolioSells] = useState([]);
  const [holdings, setHoldings] = useState([]);

  useEffect(() => {

    
    
    if (holdings.length > 0) {
      renderPieChart();
    }
  }, [holdings]);

  useEffect(() => {
    
    axios
      .get("http://localhost:3001/portfolio", {
        headers: {
          Authorization: `${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setPortfolioBuys(res.data.portfolioBuys);
        setPortfolioSells(res.data.portfolioSells);
        calculateHoldings(res.data.portfolioBuys, res.data.portfolioSells);
      })
      .catch((err) => console.log(err));
  }, []);

  const calculateHoldings = (buys, sells) => {
    const holdingsMap = new Map();

    // Calculate holdings based on buys
    buys.forEach((buy) => {
      const { usernameofsc, amountboughtinfcoins } = buy;
      if (!holdingsMap.has(usernameofsc)) {
        holdingsMap.set(usernameofsc, amountboughtinfcoins);
      } else {
        holdingsMap.set(
          usernameofsc,
          holdingsMap.get(usernameofsc) + amountboughtinfcoins
        );
      }
    });
    // Subtract holdings based on sells
    sells.forEach((sell) => {
      const { usernameofsc, amountreceivedinfcoins } = sell;
      if (holdingsMap.has(usernameofsc)) {
        holdingsMap.set(
          usernameofsc,
          holdingsMap.get(usernameofsc) - amountreceivedinfcoins
        );
      }
    });

    // Filter out holdings where the amount is greater than 0
    const filteredHoldings = [...holdingsMap.entries()].filter(
      ([coin, amount]) => amount > 0
    );

    setHoldings(filteredHoldings);
  };

  

  const renderPieChart = () => {
    
    
    // Check if a chart instance already exists
    if (window.myChart instanceof Chart) {
      window.myChart.destroy(); // Destroy the existing chart instance
    }
    const labels = holdings.map(([coin, amount]) => coin);
    const data = holdings.map(([coin, amount]) => amount);

    const ctx = document.getElementById("pie-chart");
    new Chart(ctx, {
      type: "pie",
      data: {
        labels: labels,
        datasets: [
          {
            data: data,
            backgroundColor: [
              "rgba(255, 99, 132, 0.5)",
              "rgba(54, 162, 235, 0.5)",
              "rgba(255, 206, 86, 0.5)",
              "rgba(75, 192, 192, 0.5)",
              "rgba(153, 102, 255, 0.5)",
              "rgba(255, 159, 64, 0.5)",
            ],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
      },
    });
  };

  return (
    <>
      <Navbar />
      <div className="wholeportfolio">
        <div className="currentholdings">
          <h3>Current Holdings</h3>
          <canvas id="pie-chart"></canvas>
        </div>

        <div className="portfolio-left-right">
          <div className="portfolioleft">
            <h3>Buys</h3>
            <PortfolioLeftCard props={portfolioBuys} />
          </div>
          <div className="portfolioright">
            <h3>Sells</h3>
            <PortfolioRightCard props={portfolioSells} />
          </div>
        </div>
      </div>
    </>
  );
}

export default Portfolio;
