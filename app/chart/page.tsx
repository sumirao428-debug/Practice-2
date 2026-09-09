"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  TooltipProps,
} from "recharts";

// ── 假資料：三個產品線的月營收（單位：萬元）
const DATA = [
  { month: "1月",  A: 42, B: 28, C: 61 },
  { month: "2月",  A: 38, B: 35, C: 55 },
  { month: "3月",  A: 55, B: 41, C: 48 },
  { month: "4月",  A: 63, B: 38, C: 52 },
  { month: "5月",  A: 71, B: 52, C: 59 },
  { month: "6月",  A: 68, B: 60, C: 66 },
  { month: "7月",  A: 80, B: 55, C: 70 },
  { month: "8月",  A: 75, B: 62, C: 74 },
  { month: "9月",  A: 90, B: 70, C: 68 },
  { month: "10月", A: 85, B: 78, C: 72 },
  { month: "11月", A: 98, B: 82, C: 80 },
  { month: "12月", A: 110, B: 95, C: 88 },
];

// ── 參考 palette.md 的 categorical slots 1-3
const PALETTE = {
  light: {
    series1: "#2a78d6",  // blue
    series2: "#eb6834",  // orange
    series3: "#1baf7a",  // aqua
    surface:   "#fcfcfb",
    textPrimary: "#0b0b0b",
    textSecondary: "#52514e",
    muted:     "#898781",
    gridline:  "#e1e0d9",
    border:    "rgba(11,11,11,0.10)",
  },
  dark: {
    series1: "#3987e5",
    series2: "#d95926",
    series3: "#199e70",
    surface:   "#1a1a19",
    textPrimary: "#ffffff",
    textSecondary: "#c3c2b7",
    muted:     "#898781",
    gridline:  "#2c2c2a",
    border:    "rgba(255,255,255,0.10)",
  },
};

const SERIES = [
  { key: "A", label: "產品 A", slot: "series1" as const },
  { key: "B", label: "產品 B", slot: "series2" as const },
  { key: "C", label: "產品 C", slot: "series3" as const },
];

function useIsDark() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    setDark(mq.matches);
    const handler = (e: MediaQueryListEvent) => setDark(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return dark;
}

function CustomTooltip({ active, payload, label }: TooltipProps<number, string>) {
  const dark = useIsDark();
  const p = dark ? PALETTE.dark : PALETTE.light;

  if (!active || !payload?.length) return null;

  return (
    <div
      style={{
        background: p.surface,
        border: `1px solid ${p.border}`,
        borderRadius: 10,
        padding: "10px 14px",
        boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
        minWidth: 130,
      }}
    >
      <p style={{ color: p.textSecondary, fontSize: 12, marginBottom: 6 }}>{label}</p>
      {payload.map((item) => (
        <div
          key={item.dataKey}
          style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}
        >
          <span
            style={{
              display: "inline-block",
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: item.color,
            }}
          />
          <span style={{ color: p.textSecondary, fontSize: 12 }}>{item.name}</span>
          <span style={{ color: p.textPrimary, fontSize: 13, fontWeight: 600, marginLeft: "auto" }}>
            {item.value} 萬
          </span>
        </div>
      ))}
    </div>
  );
}

export default function ChartPage() {
  const dark = useIsDark();
  const p = dark ? PALETTE.dark : PALETTE.light;

  return (
    <div
      style={{ background: dark ? "#0d0d0d" : "#f9f9f7" }}
      className="flex min-h-screen flex-col items-center justify-center gap-10 px-4 font-sans"
    >
      <div
        style={{
          background: p.surface,
          border: `1px solid ${p.border}`,
          borderRadius: 16,
          padding: "32px 28px",
          width: "100%",
          maxWidth: 760,
          boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
        }}
      >
        {/* 標題 */}
        <div style={{ marginBottom: 24 }}>
          <p style={{ color: p.muted, fontSize: 12, marginBottom: 4 }}>2024 年度</p>
          <h1 style={{ color: p.textPrimary, fontSize: 20, fontWeight: 600, margin: 0 }}>
            各產品線月營收趨勢
          </h1>
          <p style={{ color: p.textSecondary, fontSize: 13, marginTop: 4 }}>
            單位：萬元
          </p>
        </div>

        {/* 圖表 */}
        <ResponsiveContainer width="100%" height={340}>
          <LineChart data={DATA} margin={{ top: 8, right: 12, bottom: 0, left: 0 }}>
            <CartesianGrid
              stroke={p.gridline}
              strokeWidth={1}
              vertical={false}
            />
            <XAxis
              dataKey="month"
              tick={{ fill: p.muted, fontSize: 12 }}
              axisLine={{ stroke: p.gridline }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: p.muted, fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              width={42}
              tickFormatter={(v) => `${v}`}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: p.gridline, strokeWidth: 1 }} />
            <Legend
              iconType="circle"
              iconSize={8}
              formatter={(value) => (
                <span style={{ color: p.textSecondary, fontSize: 12 }}>{value}</span>
              )}
              wrapperStyle={{ paddingTop: 16 }}
            />
            {SERIES.map((s) => (
              <Line
                key={s.key}
                type="monotone"
                dataKey={s.key}
                name={s.label}
                stroke={p[s.slot]}
                strokeWidth={2}
                dot={{ r: 4, strokeWidth: 0, fill: p[s.slot] }}
                activeDot={{ r: 6, strokeWidth: 2, stroke: p.surface, fill: p[s.slot] }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      <Link
        href="/"
        style={{ color: p.muted, fontSize: 14 }}
        className="transition hover:opacity-70"
      >
        ← 回首頁
      </Link>
    </div>
  );
}
