import { useState } from "react";
import API from "../services/api";

function AnalyzeReel() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!url.trim()) {
      alert("Please enter an Instagram Reel URL");
      return;
    }

    try {
      setLoading(true);

      const response = await API.post("/analyze", {
        url,
      });

      setResult(response.data);
    } catch (error) {
      console.error(error);

      alert(
        error?.response?.data?.message ||
        "Analysis Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">

      <h1>Instagram Reel Analysis</h1>

      <input
        className="input-box"
        type="text"
        placeholder="Paste Instagram Reel URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />

      <button
        className="btn"
        onClick={handleAnalyze}
      >
        Analyze Reel
      </button>

      {loading && (
        <p className="loading">
          Analyzing Reel...
        </p>
      )}

      {result && (
        <div className="result-card">

          <h2>Summary</h2>
          <p>{result.summary}</p>

          <h2>Sentiment</h2>
          <p>{result.sentiment}</p>

          <h2>Topics</h2>

          <ul>
            {result.topics?.map((topic, index) => (
              <li key={index}>{topic}</li>
            ))}
          </ul>

        </div>
      )}

    </div>
  );
}

export default AnalyzeReel;