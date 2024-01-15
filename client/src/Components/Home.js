import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Card from "./Card";
import Static from "./Static";
import "./Home.css";

function Home() {
  return (
    <>
      <Navbar />
      <div className="both">
        <Sidebar />
        <div className="statncard">
          <Static />
          <Card />
        </div>
      </div>
    </>
  );
}

export default Home;
