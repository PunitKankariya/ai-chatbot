import React, { useMemo, useState } from "react";
import AppLayout from "../components/ui/AppLayout";

export default function ProgressPage() {
  const [stats] = useState({
    studyHours: [2, 3, 1, 4, 2, 5, 3],
    quizzes: { attempted: 12, passed: 9 },
    notesCreated: 32,
  });

  const passRate = useMemo(() => {
    if (stats.quizzes.attempted === 0) return 0;
    return Math.round((stats.quizzes.passed / stats.quizzes.attempted) * 100);
  }, [stats]);

  return (
    <AppLayout>
      <div className="h-full p-6 text-white">
        <h1 className="text-2xl font-semibold mb-6">📊 Progress</h1>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="bg-white/5 rounded-xl border border-white/10 p-4">
            <p className="text-sm text-white/70">Notes Created</p>
            <p className="text-3xl font-bold mt-2">{stats.notesCreated}</p>
          </div>
          <div className="bg-white/5 rounded-xl border border-white/10 p-4">
            <p className="text-sm text-white/70">Quizzes Attempted</p>
            <p className="text-3xl font-bold mt-2">{stats.quizzes.attempted}</p>
          </div>
          <div className="bg-white/5 rounded-xl border border-white/10 p-4">
            <p className="text-sm text-white/70">Quiz Pass Rate</p>
            <div className="mt-2 w-full bg-white/10 rounded-full h-3">
              <div
                className="h-3 rounded-full bg-green-500"
                style={{ width: `${passRate}%` }}
              />
            </div>
            <p className="text-sm mt-1">{passRate}%</p>
          </div>
        </div>

        <div className="mt-6 bg-white/5 rounded-xl border border-white/10 p-4">
          <p className="text-sm text-white/70 mb-2">Study Hours (Last 7 days)</p>
          <div className="grid grid-cols-7 gap-2 items-end h-32">
            {stats.studyHours.map((h, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <div
                  className="w-6 bg-purple-500 rounded"
                  style={{ height: `${Math.max(h * 12, 6)}px` }}
                />
                <span className="text-xs text-white/60">{h}h</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}