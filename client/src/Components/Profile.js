import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./Profile.css";

function Profile() {
  const { id } = useParams();
  const [user, setUser] = useState({});
  const [cuser, setCuser] = useState({});
  const [fcoinamount, setFcoinamount] = useState(0)
  const [scyouget, setScyouget] = useState(0)

  

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

console.log(cuser)
  const calculatedBalance = Math.max(0, cuser.balance - fcoinamount)


  // Update scyouget when fcoinamount changes
  useEffect(() => {
    const newScyouget = Math.sqrt(fcoinamount / 0.003);
    setScyouget(isNaN(newScyouget) ? 0 : newScyouget);
  }, [fcoinamount]);

  

  function onBuy() {
    // Make an API call to update the ccm value in the database
    axios
      .put(
        `http://localhost:3001/update-ccm/${user._id}`,
        { ccm: scyouget, fcoinamount: fcoinamount },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        // Update the local state or perform any additional logic if needed
        console.log("ccm and balance updated successfully");
        // Display a popup or any other UI element indicating transaction success
        alert("Transaction successful!");
  
        // Fetch the updated balance directly from the server
        axios
          .get(`http://localhost:3001/myprofile`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          })
          .then((res) => {
            // Update cuser state with the new balance from MongoDB
            setCuser({ ...cuser, balance: res.data.user.balance });
          })
          .catch((err) => console.log(err));
  
        // Reset state values
        setScyouget(0);
        setFcoinamount(0);
      })
      .catch((error) => {
        console.error("Error updating ccm and balance:", error);
      });
  }
  
  
  return (
    <>
      <div className="wholeprofile">
        <h3>Profile page</h3>
        <img src={`http://localhost:3001/${user.imageURL}`} alt="Profile pic" />
        <h3>{user.username}</h3>
        <h3>{user.firstname} {user.lastname}</h3>
        <h3>{user.bio}</h3>
        <h3>{user.balance}</h3>
        <h3>{user.cfi}</h3>
        <h3>{user.ccm}</h3>
        <h3>{(((user.ccm+1)*(user.ccm+1)) * 0.003) - user.cfi}</h3>


        <h2>Buy {user.username} coins</h2>

        <input type="text" onChange={(e)=>setFcoinamount(e.target.value)} placeholder="Enter Fcoin amount" />
        <h3>{user.username} coins you get: {scyouget}</h3>
        <h3>Fcoin balance: {cuser.balance - fcoinamount}</h3>
        <button onClick={onBuy} disabled={calculatedBalance === 0}>Buy</button>


        <h2>Withdraw {user.username} coins</h2>
        <h3>Fcoins you get: </h3>
        <h3>{user.username} coins you own</h3>
      </div>
    </>
  );
}

export default Profile;
