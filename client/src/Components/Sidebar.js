import "./Sidebar.css";
import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <>
      <div class="sidebar">
        <Link to="/myprofile">
          <i class=""></i> Profile
        </Link>
        <a href="#services">
          <i class="fa fa-fw fa-wrench"></i> Wallet
        </a>
        <Link to="/portfolio">
          <i class=""></i> Portfolio
        </Link>
        <a href="#contact">
          <i class="fa fa-fw fa-envelope"></i> Watchlist
        </a>
        <a href="#contact">
          <i class="fa fa-fw fa-envelope"></i> Inbox
        </a>
        <a href="#contact">
          <i class="fa fa-fw fa-envelope"></i> Notes
        </a>
        <Link to="/settings">
          <i class=""></i> Settings
        </Link>
      </div>
    </>
  );
}

export default Sidebar;
