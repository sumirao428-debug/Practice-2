"use client";

import { useState } from "react";

type Result = { won: boolean; message: string } | null;

export default function Lottery() {
  const [result, setResult] = useState<Result>(null);
  const [loading, setLoading] = useState(false);

  async function handleDraw() {
    setLoading(true);
    setResult(null);
    const res = await fetch("/api/lottery");
    const data = await res.json();
    setResult(data);
    setLoading(false);
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <button
        onClick={handleDraw}
        disabled={loading}
        className="h-10 rounded-full bg-[#8fa692] px-6 text-sm font-medium text-white transition-colors hover:bg-[#7d9480] disabled:cursor-not-allowed disabled:opacity-50 dark:bg-[#9ab8a0] dark:hover:bg-[#8aa890]"
      >
        {loading ? "抽獎中…" : "立即抽獎"}
      </button>
      {result && (
        <p
          className={`text-base font-medium ${
            result.won
              ? "text-[#6a9470] dark:text-[#9ab8a0]"
              : "text-[#a08090] dark:text-[#c0a09c]"
          }`}
        >
          {result.message}
        </p>
      )}
    </div>
  );
}
