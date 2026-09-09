"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import Counter from "./components/Counter";
import Lottery from "./components/Lottery";
import PrimeChecker from "./components/PrimeChecker";
import OnlineCounter from "./components/OnlineCounter";

const TOOLS = [
  {
    icon: "✦",
    iconColor: "#c0a09c",
    title: "點擊計數",
    desc: "每次點擊呼叫 API，伺服器端累積次數並回傳。",
    component: <Counter />,
  },
  {
    icon: "◈",
    iconColor: "#8fa692",
    title: "幸運抽獎",
    desc: "30% 中獎機率，每次抽獎結果由伺服器隨機決定。",
    component: <Lottery />,
  },
  {
    icon: "◇",
    iconColor: "#90a4b8",
    title: "質數判斷",
    desc: "輸入任意整數，伺服器端即時判斷是否為質數。",
    component: <PrimeChecker />,
  },
];

export default function Home() {
  const { user, loading: authLoading } = useAuth();

  return (
    <div className="min-h-screen bg-[#f0ebe3] font-sans dark:bg-[#1e1b16]">

      {/* ── Header ── */}
      <header className="mx-auto flex max-w-4xl items-center justify-between px-6 pt-8">
        <span className="text-sm font-semibold tracking-widest text-[#a09890] dark:text-[#7a7268]">
          MINI TOOLS
        </span>
        <div className="flex items-center gap-4">
          <OnlineCounter />
          {!authLoading && (
            user ? (
              <Link
                href="/ledger"
                className="text-xs text-[#a09890] transition-colors hover:text-[#3d3730] dark:text-[#7a7268] dark:hover:text-[#e8e2d8]"
              >
                {user.name} →
              </Link>
            ) : (
              <Link
                href="/login"
                className="text-xs text-[#a09890] transition-colors hover:text-[#3d3730] dark:text-[#7a7268] dark:hover:text-[#e8e2d8]"
              >
                登入
              </Link>
            )
          )}
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="mx-auto max-w-4xl px-6 pb-12 pt-14">
        <p className="mb-3 text-xs tracking-widest text-[#a09890] dark:text-[#7a7268]">
          輕量 · 實驗 · 互動
        </p>
        <h1 className="text-5xl font-semibold leading-tight tracking-tight text-[#3d3730] dark:text-[#e8e2d8] sm:text-6xl">
          工具集
        </h1>
        <div className="mt-4 h-px w-16 bg-[#c0a09c] opacity-60" />
        <p className="mt-5 max-w-sm text-base leading-relaxed text-[#7a7268] dark:text-[#b0a89e]">
          以 Next.js App Router 打造的小型工具展示頁，每個功能皆串接後端 API。
        </p>
      </section>

      {/* ── 記帳系統 Featured Card ── */}
      <section className="mx-auto max-w-4xl px-6 pb-8">
        <Link
          href={user ? "/ledger" : "/login"}
          className="group block rounded-2xl border border-[#d4cdc4] bg-[#e8e2d8] px-7 py-6 transition-colors hover:border-[#c0a09c] hover:bg-[#ede8e1] dark:border-[#403c36] dark:bg-[#2a2620] dark:hover:border-[#c8aaa6] dark:hover:bg-[#322d28]"
        >
          <div className="flex items-start justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg leading-none text-[#c0a09c] dark:text-[#c8aaa6]">◉</span>
                <span className="text-xs font-semibold tracking-widest text-[#a09890] dark:text-[#7a7268]">
                  完整功能
                </span>
              </div>
              <h2 className="text-xl font-semibold text-[#3d3730] dark:text-[#e8e2d8]">
                個人記帳系統
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-[#7a7268] dark:text-[#b0a89e] max-w-lg">
                登入後可新增、編輯、刪除收支紀錄，即時查看收入、支出與結餘統計。資料儲存於 MongoDB。
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {["使用者驗證", "MongoDB", "即時統計", "CRUD"].map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-[#d4cdc4] px-2.5 py-0.5 text-xs text-[#a09890] dark:border-[#403c36] dark:text-[#7a7268]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex-none self-center">
              <span className="block text-[#c0a09c] transition-transform group-hover:translate-x-1 dark:text-[#c8aaa6] text-xl">
                →
              </span>
            </div>
          </div>
        </Link>
      </section>

      {/* ── Tool Cards ── */}
      <section className="mx-auto max-w-4xl px-6 pb-10">
        <p className="mb-4 text-xs tracking-widest text-[#a09890] dark:text-[#7a7268]">互動小工具</p>
        <div className="grid gap-4 sm:grid-cols-3">
          {TOOLS.map((tool) => (
            <div
              key={tool.title}
              className="flex flex-col gap-5 rounded-2xl border border-[#d4cdc4] bg-[#e8e2d8] p-6 dark:border-[#403c36] dark:bg-[#2a2620]"
            >
              <div className="flex flex-col gap-2">
                <span className="text-lg leading-none" style={{ color: tool.iconColor }}>
                  {tool.icon}
                </span>
                <h2 className="text-sm font-semibold text-[#3d3730] dark:text-[#e8e2d8]">
                  {tool.title}
                </h2>
                <p className="text-xs leading-relaxed text-[#a09890] dark:text-[#7a7268]">
                  {tool.desc}
                </p>
              </div>
              <div className="h-px bg-[#d4cdc4] dark:bg-[#403c36]" />
              <div className="flex flex-1 items-center justify-center">
                {tool.component}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Navigation Cards ── */}
      <section className="mx-auto max-w-4xl px-6 pb-16">
        <p className="mb-4 text-xs tracking-widest text-[#a09890] dark:text-[#7a7268]">其他頁面</p>
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            { href: "/qrcode", label: "QR Code 產生器", desc: "輸入網址，即時產生可下載的 QR Code", icon: "⬡" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group flex items-center justify-between rounded-2xl border border-[#d4cdc4] bg-[#e8e2d8] px-6 py-5 transition-colors hover:border-[#c0a09c] hover:bg-[#ede8e1] dark:border-[#403c36] dark:bg-[#2a2620] dark:hover:border-[#c8aaa6] dark:hover:bg-[#322d28]"
            >
              <div className="flex items-center gap-3">
                <span className="text-sm text-[#a09890] dark:text-[#7a7268]">{link.icon}</span>
                <div>
                  <p className="text-sm font-semibold text-[#3d3730] dark:text-[#e8e2d8]">
                    {link.label}
                  </p>
                  <p className="mt-0.5 text-xs text-[#a09890] dark:text-[#7a7268]">{link.desc}</p>
                </div>
              </div>
              <span className="ml-4 text-[#c0a09c] transition-transform group-hover:translate-x-1 dark:text-[#c8aaa6]">
                →
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-[#d4cdc4] py-6 dark:border-[#403c36]">
        <p className="text-center text-xs text-[#a09890] dark:text-[#7a7268]">
          Built with Next.js · App Router
        </p>
      </footer>
    </div>
  );
}
