"use client";

import { useState, useRef } from "react";
import { QRCodeSVG } from "qrcode.react";

export default function QRCode() {
  const [input, setInput] = useState("");
  const [url, setUrl] = useState("");
  const svgRef = useRef<HTMLDivElement>(null);

  function handleGenerate() {
    if (input.trim()) setUrl(input.trim());
  }

  function handleDownload() {
    const svg = svgRef.current?.querySelector("svg");
    if (!svg) return;
    const blob = new Blob([new XMLSerializer().serializeToString(svg)], { type: "image/svg+xml" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "qrcode.svg";
    a.click();
    URL.revokeObjectURL(a.href);
  }

  return (
    <div className="flex w-full flex-col items-center gap-3">
      <div className="flex w-full gap-2">
        <input
          type="url"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
          placeholder="https://example.com"
          className="h-9 flex-1 min-w-0 rounded-lg border border-[#d4cdc4] bg-[#f0ebe3] px-3 text-xs text-[#3d3730] placeholder-[#b0a89e] focus:outline-none focus:ring-2 focus:ring-[#c0a09c] dark:border-[#403c36] dark:bg-[#1e1b16] dark:text-[#e8e2d8] dark:placeholder-[#7a7268]"
        />
        <button
          onClick={handleGenerate}
          disabled={input.trim() === ""}
          className="h-9 rounded-lg bg-[#c0a09c] px-3 text-xs font-medium text-white transition-colors hover:bg-[#b09088] disabled:opacity-40 disabled:cursor-not-allowed dark:bg-[#c8aaa6] dark:hover:bg-[#b89a98]"
        >
          產生
        </button>
      </div>

      {url && (
        <div className="flex flex-col items-center gap-2">
          <div ref={svgRef} className="rounded-lg border border-[#d4cdc4] bg-white p-2 dark:border-[#403c36]">
            <QRCodeSVG value={url} size={120} />
          </div>
          <button
            onClick={handleDownload}
            className="text-xs text-[#a09890] underline underline-offset-2 transition-colors hover:text-[#3d3730] dark:hover:text-[#e8e2d8]"
          >
            下載 SVG
          </button>
        </div>
      )}
    </div>
  );
}
