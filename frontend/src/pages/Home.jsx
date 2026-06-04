import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="home-container">

      <h1>🚀 TechSolve AI</h1>

      <p>
        AI Powered Video & Reel Analysis Platform
      </p>

      <div className="card-container">

        <Link to="/video" className="home-card">
          <h2>YouTube Analysis</h2>
          <p>Analyze YouTube videos</p>
        </Link>

        <Link to="/reel" className="home-card">
          <h2>Instagram Reels</h2>
          <p>Analyze Instagram reels</p>
        </Link>


        <Link to="/compare" className="home-card">
          <h2>Compare Videos</h2>
          <p>Compare YouTube & Instagram content</p>
        </Link>

        <Link to="/question" className="home-card">
          <h2>Ask Questions</h2>
          <p>Chat with video content</p>
        </Link>

        <Link to="/engagement" className="home-card">
          <h2>Engagement Analysis</h2>
          <p>Check viral potential</p>
        </Link>

      </div>

    </div>
  );
}

export default Home;