import './Navbar.css'

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
                Login
            </div>
        </nav>
        </>
    )
}

export default Navbar