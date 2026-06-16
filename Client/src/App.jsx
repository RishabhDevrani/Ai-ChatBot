import { useEffect, useState } from 'react';
import ReactMarkdown from "react-markdown";
import axios from 'axios';

import './App.css'
import Loading from './Loading';


function App() {
  const [question, setQuestions] = useState("");
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [data, setData] = useState("");
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");

  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  let handleSubmit = (e) => {
    e.preventDefault();
    if (!question.trim() || loadingStatus) return;

    setLoadingStatus(true)
    axios.post(`https://ai-chatbot-1h6d.onrender.com`, { question })
      .then((res) => res.data)
      .then((finalRes) => {
        console.log(finalRes);
        if (finalRes._status) {
          setData(finalRes.finalData)
        }
      })
      .catch(() => {
        setData("Sorry, I could not reach the AI server. Please make sure the backend is running on port 8000.");
      })
      .finally(() => {
        setLoadingStatus(false)
    })
    console.log(question);
  }

  return (
    <main className={`app-shell ${theme}`}>
      <section className="chat-page">
        <header className="topbar">
          <div>
            <p className="eyebrow">Gemini powered assistant</p>
            <h1 className="title">AI Chat Bot</h1>
            <p className="subtitle">
              Ask for ideas, summaries, code help, or polished content and get a clean markdown response.
            </p>
          </div>

          <button
            type="button"
            className="theme-toggle"
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            aria-pressed={theme === "dark"}
            onClick={() => setTheme((currentTheme) => currentTheme === "light" ? "dark" : "light")}
          >
            <span className="toggle-label">{theme === "light" ? "Light" : "Dark"}</span>
            <span className="toggle-track" aria-hidden="true">
              <span className="toggle-thumb">{theme === "light" ? "L" : "D"}</span>
            </span>
          </button>
        </header>

        <div className="chat-card">
          <form onSubmit={handleSubmit} className="prompt-panel">
            <div className="assistant-badge">
              <span className="avatar">AI</span>
              <div>
                <h2>Start a chat</h2>
                <p>Write a prompt and let Gemini draft the answer.</p>
              </div>
            </div>

            <label htmlFor="prompt" className="prompt-label">Your prompt</label>
            <textarea
              id="prompt"
              value={question}
              onChange={(e) => setQuestions(e.target.value)}
              className="prompt-input"
              placeholder="Example: Create a friendly product description for a modern task manager..."
            />
            <button className="submit-button" disabled={loadingStatus || !question.trim()}>
              {loadingStatus ? "Creating..." : "Create Content"}
            </button>
            <p className="hint">Responses support headings, lists, links, and code blocks.</p>
          </form>

          <section className="response-panel" aria-live="polite">
            <div className="response-head">
              <div>
                <h2>Assistant response</h2>
                <p>Your generated answer will appear here.</p>
              </div>
              <span className="status-pill">{loadingStatus ? "Thinking" : data ? "Ready" : "Waiting"}</span>
            </div>

            <div className="response-body">
              {loadingStatus ? (
                <Loading />
              ) : data ? (
                <div className="markdown">
                  <ReactMarkdown>{data}</ReactMarkdown>
                </div>
              ) : (
                <div className="empty-state">
                  <div>
                    <span className="empty-icon">*</span>
                    <h3>No message yet</h3>
                    <p>Try asking for a blog outline, an explanation, or a quick piece of code.</p>
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      </section>
    </main>
  )
}

export default App
