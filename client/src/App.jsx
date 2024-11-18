import React, { useState } from "react";
import "./App.css";

function App() {
  const [text, setText] = useState("");
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSpam, setIsSpam] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!text.trim()) {
      setResult("Please enter some text.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("https://spamdetectoraimodel.onrender.com/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error("Failed to communicate with the server.");
      }

      const data = await response.json();

      if (data.error) {
        setResult(`Error: ${data.error}`);
        setIsSpam(false);
      } else {
        setResult(`${data.prediction}`);
        setIsSpam(data.prediction.toLowerCase() === "spam");
      }
    } catch (error) {
      console.error("Error:", error);
      setResult("An error occurred while processing your request.");
    }

    setIsLoading(false);
  };

  // Determine the icon color based on the result
  const getIconColor = () => {
    if (isSpam) {
      return "#dc2626"; // Red for spam
    } else if (result && !isSpam) {
      return "#16a34a"; // Green for not spam
    }
    return "#2563eb"; // Default color
  };

  return (
    <div className="app-container">
      <main className="main-content">
        <div className="header">
          <div className="result-icon shield head-icon" style={{ color: getIconColor() }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24">
              <path d="M12 22s8-4 8-10V5L12 2 4 5v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <h1>Spam Detection System</h1>
          <p className="subtitle">Advanced text analysis for spam detection</p>
        </div>

        <div className="content-wrapper">
          <form onSubmit={handleSubmit} className="form">
            <div className="textarea-container">
              <textarea
                rows="15"
                placeholder="Enter your text here to analyze for spam content..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="input-textarea"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className={`submit-button ${isLoading ? "loading" : ""}`}
            >
              {isLoading ? "Analyzing..." : "Analyze Text"}
            </button>
          </form>

          {result && (
            <div
              className={`result-container ${
                result.toLowerCase().includes("text") ? "spam" : "not-spam"
              }`}
            >
              <div className="result-header">
                <div className="result-icon shield" style={{ color: getIconColor() }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <path d="M12 22s8-4 8-10V5L12 2 4 5v7c0 6 8 10 8 10z" />
                  </svg>
                </div>
                <h3 className="result-title">Analysis Result</h3>
              </div>
              <p className="result-text">{result}</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
