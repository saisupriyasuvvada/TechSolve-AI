import { useState } from "react";
import API from "../services/api";

function Engagement() {

  const [transcript, setTranscript] =
    useState("");

  const [result, setResult] =
    useState(null);

  const handleAnalyze = async () => {

    try {

      const response =
        await API.post(
          "/engagement",
          {
            metadata: {},
            transcript
          }
        );

      setResult(
        response.data.analysis
      );

    } catch (error) {

      console.error(error);

      alert(error?.response?.data?.message || "Analysis Failed");

    }
  };

  return (
  <div className="page-container">

    <div className="analysis-card">

      <h1 className="page-title">
        Engagement Analysis
      </h1>

      <p className="page-subtitle">
        Analyze your content's viral potential
      </p>

      <textarea
        className="question-box"
        placeholder="Paste transcript here..."
        value={transcript}
        onChange={(e) =>
          setTranscript(e.target.value)
        }
      />

      <button
        className="btn"
        onClick={handleAnalyze}
      >
        Analyze Content
      </button>

      {result && (

        <div className="engagement-results">

          <div className="metric-card">
            <h3>Content Category</h3>
            <p>{result.contentCategory}</p>
          </div>

          <div className="metric-card">
            <h3>Target Audience</h3>
            <p>{result.targetAudience}</p>
          </div>

          <div className="metric-card">
            <h3>Engagement Level</h3>
            <p>{result.engagementLevel}</p>
          </div>

          <div className="metric-card">
            <h3>Viral Potential</h3>
            <p>{result.viralPotential}</p>
          </div>

          {result.suggestions && (

            <div className="suggestion-card">

              <h3>
                Improvement Suggestions
              </h3>

              <ul>

                {result.suggestions.map(
                  (item, index) => (
                    <li key={index}>
                      {item}
                    </li>
                  )
                )}

              </ul>

            </div>

          )}

        </div>

      )}

    </div>

  </div>
);
}

export default Engagement;