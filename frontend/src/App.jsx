import { useState } from "react";
import Intro from "./components/Intro";
import Quiz from "./components/Quiz";
import Results from "./components/Results";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

export default function App() {
  const [screen, setScreen] = useState("intro"); // intro | quiz | results
  const [companyName, setCompanyName] = useState("");
  const [questions, setQuestions] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleStart = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/questions`);
      if (!res.ok) throw new Error("Request failed");
      const data = await res.json();
      setQuestions(data);
      setScreen("quiz");
    } catch {
      setError(
        "Couldn't reach the server. Make sure the backend is running and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleQuizComplete = async (answers) => {
    setScreen("loading");
    setError("");
    try {
      const res = await fetch(`${API_BASE}/assess`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          answers,
          company_name: companyName.trim() || null,
        }),
      });
      if (!res.ok) throw new Error("Request failed");
      const data = await res.json();
      setResult(data);
      setScreen("results");
    } catch {
      setError("Something went wrong while scoring your answers. Please try again.");
      setScreen("intro");
    }
  };

  const handleRestart = () => {
    setResult(null);
    setScreen("intro");
  };

  return (
    <div className="min-h-screen bg-ink flex flex-col">
      <header className="px-6 py-6 max-w-md w-full mx-auto flex items-center justify-between">
        <span className="font-display font-semibold text-paper tracking-tight">
          Offer<span className="text-amber">Check</span>
        </span>
        <span className="font-mono text-[11px] text-slate uppercase tracking-wider">
          For freshers
        </span>
      </header>

      <main className="flex-1 flex items-center justify-center px-6 py-8">
        {screen === "intro" && (
          <Intro
            companyName={companyName}
            setCompanyName={setCompanyName}
            onStart={handleStart}
            loading={loading}
            error={error}
          />
        )}

        {screen === "quiz" && (
          <Quiz questions={questions} onComplete={handleQuizComplete} />
        )}

        {screen === "loading" && (
          <p className="font-mono text-sm text-slate uppercase tracking-wider">
            Calculating risk score…
          </p>
        )}

        {screen === "results" && result && (
          <Results result={result} onRestart={handleRestart} />
        )}
      </main>

      <footer className="px-6 py-6 text-center">
        <p className="font-body text-xs text-slate/70">
          This tool flags known scam patterns. It is not legal advice — always verify independently before paying anything.
        </p>
      </footer>
    </div>
  );
}