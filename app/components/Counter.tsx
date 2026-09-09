"use client";

import { useState } from "react";

export default function Counter() {
  const [count, setCount] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    const res = await fetch("/api/hello");
    const data = await res.json();
    setCount(data.count);
    setMessage(data.message);
    setLoading(false);
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <button
        onClick={handleClick}
        disabled={loading}
        className="h-10 rounded-full bg-[#c0a09c] px-6 text-sm font-medium text-white transition-colors hover:bg-[#b09088] disabled:cursor-not-allowed disabled:opacity-50 dark:bg-[#c8aaa6] dark:hover:bg-[#b89a98]"
      >
        {loading ? "載入中…" : "點我計數"}
      </button>
      {count !== null && (
        <div className="flex flex-col items-center gap-0.5">
          <p className="text-xs text-[#a09890] dark:text-[#7a7268]">{message}</p>
          <p className="text-5xl font-semibold tabular-nums text-[#3d3730] dark:text-[#e8e2d8]">
            {count}
          </p>
        </div>
      )}
    </div>
  );
}
