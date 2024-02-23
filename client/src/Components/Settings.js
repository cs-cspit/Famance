import { useNavigate } from "react-router-dom";

function Settings(){
    const navigate = useNavigate();


    const handleSignout = () => {
        localStorage.removeItem("token");
        navigate("/");
      };

    return(
        <>
        <button onClick={handleSignout}>Signout for now</button>
        </>
    )
}

export default Settings