"use client";

import { useState } from "react";

type Result = { n: number; prime: boolean } | null;

export default function PrimeChecker() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<Result>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleCheck() {
    setError("");
    setResult(null);
    setLoading(true);
    const res = await fetch(`/api/prime?n=${encodeURIComponent(input)}`);
    const data = await res.json();
    if (!res.ok) {
      setError(data.error);
    } else {
      setResult(data);
    }
    setLoading(false);
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex gap-2">
        <input
          type="number"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleCheck()}
          placeholder="輸入數字"
          className="h-10 w-28 rounded-full border border-[#d4cdc4] bg-[#ede8e1] px-4 text-center text-sm text-[#3d3730] outline-none transition focus:border-[#c0a09c] dark:border-[#403c36] dark:bg-[#332e28] dark:text-[#e8e2d8] dark:focus:border-[#c8aaa6]"
        />
        <button
          onClick={handleCheck}
          disabled={loading || input.trim() === ""}
          className="h-10 rounded-full bg-[#90a4b8] px-5 text-sm font-medium text-white transition-colors hover:bg-[#7e92a4] disabled:cursor-not-allowed disabled:opacity-50 dark:bg-[#9ab0c8] dark:hover:bg-[#8aa0b8]"
        >
          {loading ? "判斷中…" : "判斷"}
        </button>
      </div>
      {error && (
        <p className="text-xs text-[#a08090] dark:text-[#c0a09c]">{error}</p>
      )}
      {result && (
        <p
          className={`text-base font-medium ${
            result.prime
              ? "text-[#6a9470] dark:text-[#9ab8a0]"
              : "text-[#a08090] dark:text-[#c0a09c]"
          }`}
        >
          {result.n} {result.prime ? "是質數 ✓" : "不是質數 ✗"}
        </p>
      )}
    </div>
  );
}
