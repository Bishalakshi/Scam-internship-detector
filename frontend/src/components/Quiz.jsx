import { useState } from "react";

export default function Quiz({ questions, onComplete }) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState({});

  const current = questions[index];
  const isLast = index === questions.length - 1;

  const submitAnswer = (value) => {
    const updated = { ...answers, [current.id]: value };
    setAnswers(updated);

    if (isLast) {
      onComplete(updated);
    } else {
      setIndex((i) => i + 1);
    }
  };

  const goBack = () => {
    if (index > 0) setIndex((i) => i - 1);
  };

  return (
    <div className="max-w-md w-full mx-auto">
      <div className="flex items-center justify-between mb-2">
        <p className="font-mono text-xs tracking-[0.2em] uppercase text-slate">
          Question {index + 1} / {questions.length}
        </p>
        {index > 0 && (
          <button
            onClick={goBack}
            className="font-mono text-xs uppercase tracking-wider text-slate hover:text-amber transition-colors"
          >
            ← Back
          </button>
        )}
      </div>

      {/* segmented progress ticks */}
      <div className="flex gap-1.5 mb-10">
        {questions.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              i <= index ? "bg-amber" : "bg-papermute/30"
            }`}
          />
        ))}
      </div>

      <h2 className="font-display text-2xl sm:text-[26px] font-semibold text-paper leading-snug min-h-[88px]">
        {current.question}
      </h2>

      <div className="mt-8 flex flex-col gap-3">
        {current.type === "boolean" && (
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => submitAnswer(true)}
              className="bg-paper hover:bg-papermute text-ink font-display font-semibold uppercase tracking-wide text-sm py-4 rounded-md transition-colors"
            >
              Yes
            </button>
            <button
              onClick={() => submitAnswer(false)}
              className="bg-transparent border border-slate/40 hover:border-amber text-paper font-display font-semibold uppercase tracking-wide text-sm py-4 rounded-md transition-colors"
            >
              No
            </button>
          </div>
        )}

        {current.type === "select" &&
          current.options.map((opt) => (
            <button
              key={opt}
              onClick={() => submitAnswer(opt)}
              className="text-left bg-transparent border border-slate/40 hover:border-amber hover:bg-paper/5 text-paper font-body text-[15px] px-5 py-3.5 rounded-md transition-colors"
            >
              {opt}
            </button>
          ))}
      </div>
    </div>
  );
}