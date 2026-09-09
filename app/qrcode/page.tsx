"use client";

import { useState, useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import Link from "next/link";

export default function QRCodePage() {
  const [input, setInput] = useState("");
  const [url, setUrl] = useState("");
  const svgRef = useRef<HTMLDivElement>(null);

  function handleGenerate() {
    if (input.trim()) setUrl(input.trim());
  }

  function handleDownload() {
    const svg = svgRef.current?.querySelector("svg");
    if (!svg) return;

    const serialized = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([serialized], { type: "image/svg+xml" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "qrcode.svg";
    link.click();
    URL.revokeObjectURL(link.href);
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-10 bg-zinc-50 px-4 font-sans dark:bg-black">
      <div className="flex w-full max-w-md flex-col gap-6 rounded-2xl border border-black/[.08] bg-white p-8 shadow-sm dark:border-white/[.1] dark:bg-zinc-900">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold text-black dark:text-white">
            QR Code 產生器
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            輸入網址，即時產生 QR Code
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <input
            type="url"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
            placeholder="https://example.com"
            className="h-12 w-full rounded-xl border border-black/[.08] px-4 text-black outline-none transition focus:border-black dark:border-white/[.145] dark:bg-zinc-800 dark:text-white dark:placeholder-zinc-500 dark:focus:border-white"
          />
          <button
            onClick={handleGenerate}
            disabled={input.trim() === ""}
            className="flex h-12 w-full items-center justify-center rounded-xl bg-black text-white font-medium transition hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed dark:bg-white dark:text-black dark:hover:bg-zinc-200"
          >
            產生 QR Code
          </button>
        </div>

        {url && (
          <div className="flex flex-col items-center gap-4">
            <div
              ref={svgRef}
              className="rounded-xl border border-black/[.08] bg-white p-4 dark:border-white/[.1]"
            >
              <QRCodeSVG value={url} size={200} />
            </div>
            <p className="max-w-full truncate text-xs text-zinc-400">{url}</p>
            <button
              onClick={handleDownload}
              className="flex h-10 items-center justify-center rounded-xl border border-black/[.08] px-5 text-sm font-medium text-black transition hover:bg-zinc-100 dark:border-white/[.1] dark:text-white dark:hover:bg-zinc-800"
            >
              下載 SVG
            </button>
          </div>
        )}
      </div>

      <Link
        href="/"
        className="text-sm text-zinc-400 transition hover:text-black dark:hover:text-white"
      >
        ← 回首頁
      </Link>
    </div>
  );
}
