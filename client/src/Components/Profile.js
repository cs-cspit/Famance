import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./Profile.css";

function Profile() {
  const { id } = useParams();
  console.log({id})
  const [user, setUser] = useState({});
  const [cuser, setCuser] = useState({});
  const [fcoinamount, setFcoinamount] = useState(0);
  const [scyouget, setScyouget] = useState(0);

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
  }, [id]);

  let calculatedBalance = Math.max(0, cuser.balance - fcoinamount);

  function socialCoinsYouGet(amount) {

    if (amount < calculatedBalance) {
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
      .then((res) => setCuser(res.data.user))
      calculatedBalance = Math.max(0, cuser.balance - fcoinamount);
      
      setScyouget(Math.sqrt(amount / 0.003));
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
        "http://localhost:3001/buy-coins",
        { fcoinamount, scyouget, cuserId: cuser.id, userId: id }, // Send the fcoinamount, scyouget, and userId to the backend
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
      })
      .catch((err) => console.log(err));
  }
  

  return (
    <>
      <div className="wholeprofile">
        <h3>Profile page</h3>
        <img src={`http://localhost:3001/${user.imageURL}`} alt="Profile pic" />
        <h3>Username: {user.username}</h3>
        <h3>
          Name: {user.firstname} {user.lastname}
        </h3>
        <h3>Bio: {user.bio}</h3>
        <h3>Balance: {user.balance}</h3>
        <h3>CFI: {user.cfi}</h3>
        <h3>CCM: {user.ccm}</h3>
        <h3>
          Current price: {(((user.ccm + 1) * (user.ccm + 1)) * 0.003 - (user.ccm * user.ccm)*0.003).toFixed(2)}
        </h3>

        <h2>Buy {user.username} coins</h2>

        <input
          type="number"
          onChange={(e) => {
            const amount = e.target.value;
            setFcoinamount(amount);
            socialCoinsYouGet(amount);
          }}
          placeholder="Enter Fcoin amount"
        />
        <h3>
          {user.username} coins you get ≈ {scyouget}
        </h3>
        <h3>Fcoin balance ≈ {cuser.balance - fcoinamount}</h3>
        <button onClick={onBuy} disabled={calculatedBalance === 0}>
          Buy
        </button>

        <h2>Withdraw {user.username} coins</h2>
        <h3>Fcoins you get: </h3>
        <h3>{user.username} coins you own</h3>
      </div>
    </>
  );
}

export default Profile;
