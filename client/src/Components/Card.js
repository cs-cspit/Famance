import "./Card.css";

function Card() {
  return (
    <>
        <div className="card">
          <img
            className="cardpropic"
            src="https://pbs.twimg.com/profile_images/1683325380441128960/yRsRRjGO_400x400.jpg"
          />
          <h4>John</h4>
          <h4>549,000</h4>
          <img
            className="cardgraph"
            src="https://motionarray.imgix.net/preview-975047-dOAbHCWmyG-high_0010.jpg"
          />
          <h4>$523.75</h4>
        </div>
    </>
  );
}

export default Card;
