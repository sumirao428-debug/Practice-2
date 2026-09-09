"use client";

import { useEffect, useState } from "react";

export default function OnlineCounter() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    let active = true;

    fetch("/api/online", { method: "POST" })
      .then((res) => res.json())
      .then((data) => { if (active) setCount(data.count); });

    const handleUnload = () => {
      fetch("/api/online", { method: "DELETE", keepalive: true });
      active = false;
    };

    window.addEventListener("beforeunload", handleUnload);

    return () => {
      window.removeEventListener("beforeunload", handleUnload);
      if (active) fetch("/api/online", { method: "DELETE" });
    };
  }, []);

  return (
    <div className="flex items-center gap-1.5 text-xs text-[#a09890] dark:text-[#7a7268]">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#8fa692] opacity-60" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-[#8fa692]" />
      </span>
      <span>
        線上 <span className="font-semibold text-[#3d3730] dark:text-[#e8e2d8]">{count ?? "—"}</span> 人
      </span>
    </div>
  );
}
