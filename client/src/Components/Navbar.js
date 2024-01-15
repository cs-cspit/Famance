import './Navbar.css'
// import {Link} from 'react-router-dom'

function Navbar () {
    return(
        <>
        <nav>
            <div className="leftnav">
                Famance
            </div>
            <div className="rightnav">
                Docs
                <input placeholder="Search" type="text"></input>
                <button className="loginbutton">Login</button>
                <button className="signupbutton">Signup</button>
            </div>
        </nav>
        </>
    )
}

export default Navbar