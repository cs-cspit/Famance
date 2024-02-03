import React, { useEffect, useState } from "react";
import axios from "axios";
import './Myprofile.css'

function MyProfile() {

    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await axios.get("http://localhost:3001/myprofile", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                });

                setUser(response.data.user);
            } catch (error) {
                console.error("Error fetching user profile:", error);
            }
        };

        fetchUserProfile();
    }, []);

    return (
        <>
            <div className="wholemyprofile">
                <h2>My Profile</h2>
                {user && (
                    <>
                        <h4>Username: {user.username}</h4>
                        <h4>Email: {user.email}</h4>
                        <h4>Bio: {user.bio}</h4>
                        {user.imageURL && <img src={`http://localhost:3001/${user.imageURL}`} alt="Profile" />}
                        <h4>Balance: {user.balance}</h4>
                        {/* Add other properties you want to display */}
                    </>
                )}
            </div>
        </>
    );
}

export default MyProfile;
