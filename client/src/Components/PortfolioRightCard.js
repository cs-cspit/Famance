import './PortfolioRightCard.css'
import {Link} from 'react-router-dom'

function PortfolioRightCard({props}) {

    const aggregatedData = props.reduce((acc, current) => {
        const existingItem = acc.find(item => item.usernameofsc === current.usernameofsc);
        if (existingItem) {
          existingItem.amountsoldinsc += current.amountsoldinsc;
        } else {
          acc.push({ ...current });
        }
        return acc;
      }, []);

    return (
        <>
        {aggregatedData.map((sell, index) => (
        <Link to={`/${sell.userid}`}>
        <div className="wholeportfoliorightcard" key={index}>
          <div className="portfoliorightcard">
            <img
              className="portfolio-propic"
              src={`http://localhost:3001/${sell.userpropic}`}
              alt="Profile pic"
            />
            <h3>{sell.usernameofsc}</h3>
            <p>{(sell.amountsoldinsc).toFixed(2)}</p>
          </div>
          {/* Render other data as needed */}
        </div>
        </Link>
      ))}
        </>
    )
}

export default PortfolioRightCard