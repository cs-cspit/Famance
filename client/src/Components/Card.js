import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Card.css";

function Card(props) {
  const [pets, setPets] = useState([]);

  const fullname = props.firstname + " " + props.lastname

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

          <div className="popup" onMouseEnter={handleHoverCFI}>
            <h4>{props.cfi}</h4>
            <span className="popuptext" id={`popup-${props.cfi}`}>
              Market Cap
            </span>
          </div>
          
          <div className="popup" onMouseEnter={handleHoverMcap}>
            <h4>{((((props.ccm+1)*(props.ccm+1)) * 0.003) - props.cfi).toFixed(2)}</h4>
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
