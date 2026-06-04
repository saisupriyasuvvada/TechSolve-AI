import { useState } from "react";
import API from "../services/api";

function AskQuestion() {

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {

    if (!question.trim()) {
      alert("Please enter a question"); 
      return;
    }

    try {

      setLoading(true);

      const response = await API.post(
        "/query/ask",
        {
          question,
          platform: "Both"
        }
      );

      setAnswer(response.data.answer);

    } catch (error) {

      console.error(error);

      alert(
        error?.response?.data?.message ||
        "Failed to get answer"
      );

    } finally {

      setLoading(false);

    }
  };

  return (
    <div className="page-container">

      <div className="analysis-card">

        <h1 className="page-title">
          Ask AI About Your Content
        </h1>

        <p className="page-subtitle">
          Compare videos and get improvement suggestions
        </p>

        <textarea
          className="question-box"
          placeholder="Ask a question..."
          value={question}
          onChange={(e) =>
            setQuestion(e.target.value)
          }
        />

        {/* <div className="suggestion-box">

          <h3>Example Questions</h3>

          <ul>
            <li>Which video is better?</li>
            <li>Why is Instagram performing better?</li>
            <li>How can the YouTube video improve?</li>
            <li>Which video has more viral potential?</li>
            <li>Give engagement suggestions.</li>
          </ul>

        </div> */}

        <button
          className="btn"
          onClick={handleAsk}
        >
          Ask AI
        </button>

        {
          loading &&
          <p className="loading">
            Thinking...
          </p>
        }

        {
          answer &&
          (
            <div className="answer-box">

              <h2>AI Answer</h2>

              <p>{answer}</p>

            </div>
          )
        }

      </div>

    </div>
  );
}

export default AskQuestion;