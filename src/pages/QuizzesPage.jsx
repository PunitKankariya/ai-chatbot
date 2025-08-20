import React, { useEffect, useMemo, useState } from "react";
import AppLayout from "../components/ui/AppLayout";

const sampleQuestions = [
  {
    id: "q1",
    text: "What is the time complexity of binary search?",
    options: ["O(n)", "O(log n)", "O(n log n)", "O(1)"],
    correctIndex: 1,
  },
  {
    id: "q2",
    text: "Which normal form removes transitive dependency?",
    options: ["1NF", "2NF", "3NF", "BCNF"],
    correctIndex: 2,
  },
  {
    id: "q3",
    text: "Round Robin is best suited for?",
    options: [
      "Batch systems",
      "Real-time systems",
      "Time-sharing systems",
      "Embedded systems",
    ],
    correctIndex: 2,
  },
];

function shuffle(array) {
  const a = [...array];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function QuizzesPage() {
  const [questions, setQuestions] = useState(() => shuffle(sampleQuestions));
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  // Re-shuffle when the page first loads
  useEffect(() => {
    setQuestions(shuffle(sampleQuestions));
  }, []);

  const score = useMemo(() => {
    if (!submitted) return 0;
    return questions.reduce(
      (acc, q) => acc + (answers[q.id] === q.correctIndex ? 1 : 0),
      0
    );
  }, [submitted, answers, questions]);

  const handleSelect = (idx) => {
    const q = questions[current];
    setAnswers((prev) => ({ ...prev, [q.id]: idx }));
  };

  const next = () => setCurrent((c) => Math.min(c + 1, questions.length - 1));
  const prev = () => setCurrent((c) => Math.max(c - 1, 0));
  const submit = () => setSubmitted(true);
  const restart = () => {
    setQuestions(shuffle(sampleQuestions));
    setCurrent(0);
    setAnswers({});
    setSubmitted(false);
  };

  const q = questions[current];

  return (
    <AppLayout>
      <div className="h-full p-6 text-white">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">📝 Quizzes</h1>
          <div className="text-sm text-white/70">
            Question {current + 1} / {questions.length}
          </div>
        </div>

        <div className="bg-white/5 rounded-xl border border-white/10 p-6 max-w-3xl">
          <h2 className="text-lg font-semibold">{q.text}</h2>
          <div className="mt-4 grid gap-3">
            {q.options.map((opt, idx) => {
              const isSelected = answers[q.id] === idx;
              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  className={`text-left px-4 py-3 rounded-lg border transition-colors ${
                    isSelected
                      ? "bg-purple-600/60 border-purple-400"
                      : "bg-white/5 border-white/10 hover:bg-white/10"
                  }`}
                >
                  {opt}
                </button>
              );
            })}
          </div>

          <div className="mt-6 flex items-center justify-between">
            <button
              onClick={prev}
              disabled={current === 0}
              className="px-4 py-2 rounded-lg bg-white/10 disabled:opacity-50"
            >
              Prev
            </button>
            {current < questions.length - 1 ? (
              <button
                onClick={next}
                className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700"
              >
                Next
              </button>
            ) : (
              <button
                onClick={submit}
                className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700"
              >
                Submit
              </button>
            )}
          </div>
        </div>

        {submitted && (
          <div className="mt-6 max-w-3xl bg-white/5 rounded-xl border border-white/10 p-6">
            <h3 className="text-lg font-semibold">Result</h3>
            <p className="mt-1">
              Score: {score} / {questions.length}
            </p>
            <button
              onClick={restart}
              className="mt-4 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20"
            >
              Restart
            </button>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
