import "./Sidebar.css";

function Sidebar() {
  return (
    <>
      <div class="sidebar">
        <a href="#home">
          <i class=""></i> Profile
        </a>
        <a href="#services">
          <i class="fa fa-fw fa-wrench"></i> Wallet
        </a>
        <a href="#clients">
          <i class="fa fa-fw fa-user"></i> Portfolio
        </a>
        <a href="#contact">
          <i class="fa fa-fw fa-envelope"></i> Watchlist
        </a>
        <a href="#contact">
          <i class="fa fa-fw fa-envelope"></i> Inbox
        </a>
        <a href="#contact">
          <i class="fa fa-fw fa-envelope"></i> Notes
        </a>
      </div>
    </>
  );
}

export default Sidebar;
