import "./PortfolioLeftCard.css";
import {Link} from 'react-router-dom'
function PortfolioLeftCard({ props }) {
  console.log("props", props);

  // Aggregate amountboughtinfcoins for each unique usernameofsc
  const aggregatedData = props.reduce((acc, current) => {
    const existingItem = acc.find(item => item.usernameofsc === current.usernameofsc);
    if (existingItem) {
      existingItem.amountboughtinfcoins += current.amountboughtinfcoins;
    } else {
      acc.push({ ...current });
    }
    return acc;
  }, []);

  return (
    <>
      {aggregatedData.map((buy, index) => (
        <Link to={`/${buy.userid}`}>
        <div className="wholeportfolioleftcard" key={index}>
          <div className="portfolioleftcard">
            <img
              className="portfolio-propic"
              src={`http://localhost:3001/${buy.userpropic}`}
              alt="Profile pic"
            />
            <h3>{buy.usernameofsc}</h3>
            <p>{(buy.amountboughtinfcoins).toFixed(2)}</p>
          </div>
          {/* Render other data as needed */}
        </div>
        </Link>
      ))}
    </>
  );
}

export default PortfolioLeftCard;
