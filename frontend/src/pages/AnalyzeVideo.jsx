import { useState } from "react";
import API from "../services/api";

function AnalyzeVideo() {

    const [url, setUrl] = useState("");

    const [result, setResult] = useState(null);

    const [loading, setLoading] =
        useState(false);

    const handleAnalyze = async () => {

        try {

            setLoading(true);

            const response =
                await API.post(
                    "/analyze",
                    { url }
                );

            setResult(response.data);

        } catch (error) {

            console.error(error);

            alert(
                "Analysis Failed"
            );

        } finally {

            setLoading(false);

        }
    };

    return (
        <div className="page">
            <h1>
                YouTube Analysis
            </h1>

            <input
                type="text"
                placeholder="Paste YouTube URL"
                value={url}
                onChange={(e) =>
                    setUrl(e.target.value)
                }
                className="input-box"
            />

            <br />
            <br />

            <button
                className="btn"
                onClick={handleAnalyze}
            >
                Analyze
            </button>

            {
                loading &&
                <p className="loading">
                    Analyzing Video...
                </p>
            }

            {
                result &&
                (
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
                )
            }

        </div>
    );
}

export default AnalyzeVideo;