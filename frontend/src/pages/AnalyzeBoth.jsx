import { useState } from "react";
import API from "../services/api";

function AnalyzeBoth() {

  const [youtubeUrl, setYoutubeUrl] =
    useState("");

  const [instagramUrl, setInstagramUrl] =
    useState("");

  const [youtubeResult,
    setYoutubeResult] =
    useState(null);

  const [instagramResult,
    setInstagramResult] =
    useState(null);

  const [loading,
    setLoading] =
    useState(false);

  const handleAnalyze =
    async () => {

      try {

        setLoading(true);

        const youtubeResponse =
          await API.post(
            "/analyze",
            {
              url: youtubeUrl
            }
          );

        const instagramResponse =
          await API.post(
            "/analyze",
            {
              url: instagramUrl
            }
          );

        setYoutubeResult(
          youtubeResponse.data
        );

        setInstagramResult(
          instagramResponse.data
        );

      }
      catch(error){

        console.log(error);

        alert(
          "Analysis Failed"
        );

      }
      finally{

        setLoading(false);

      }
    };

  return (

    <div className="page">

      <h1>
        Compare Two Videos
      </h1>

      <input
        className="input-box"
        placeholder="YouTube URL"
        value={youtubeUrl}
        onChange={(e)=>
          setYoutubeUrl(
            e.target.value
          )
        }
      />

      <input
        className="input-box"
        placeholder="Instagram Reel URL"
        value={instagramUrl}
        onChange={(e)=>
          setInstagramUrl(
            e.target.value
          )
        }
      />

      <button
        className="btn"
        onClick={handleAnalyze}
      >
        Analyze Both
      </button>

      {loading &&
        <p className="loading">
          Analyzing Video and Reel...
        </p>
      }

      {youtubeResult &&
      instagramResult && (

        <div>

          <div className="result-card">

            <h2>
              YouTube Summary
            </h2>

            <p>
              {
                youtubeResult.summary
              }
            </p>

          </div>

          <div className="result-card">

            <h2>
              Instagram Summary
            </h2>

            <p>
              {
                instagramResult.summary
              }
            </p>

          </div>

        </div>
      )}

    </div>
  );
}

export default AnalyzeBoth; 