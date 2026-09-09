import Link from "next/link";
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

const NAV_LINKS = [
  { href: "/qrcode", label: "QR Code 產生器", desc: "輸入網址，即時產生可下載的 QR Code" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f0ebe3] font-sans dark:bg-[#1e1b16]">

      {/* ── Header ── */}
      <header className="mx-auto flex max-w-4xl items-center justify-between px-6 pt-8">
        <span className="text-sm font-semibold tracking-widest text-[#a09890] dark:text-[#7a7268]">
          MINI TOOLS
        </span>
        <OnlineCounter />
      </header>

      {/* ── Hero ── */}
      <section className="mx-auto max-w-4xl px-6 pb-12 pt-16">
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

      {/* ── Tool Cards ── */}
      <section className="mx-auto max-w-4xl px-6 pb-12">
        <div className="grid gap-4 sm:grid-cols-3">
          {TOOLS.map((tool) => (
            <div
              key={tool.title}
              className="flex flex-col gap-5 rounded-2xl border border-[#d4cdc4] bg-[#e8e2d8] p-6 dark:border-[#403c36] dark:bg-[#2a2620]"
            >
              {/* Card header */}
              <div className="flex flex-col gap-2">
                <span
                  className="text-lg leading-none"
                  style={{ color: tool.iconColor }}
                >
                  {tool.icon}
                </span>
                <h2 className="text-sm font-semibold text-[#3d3730] dark:text-[#e8e2d8]">
                  {tool.title}
                </h2>
                <p className="text-xs leading-relaxed text-[#a09890] dark:text-[#7a7268]">
                  {tool.desc}
                </p>
              </div>

              {/* Divider */}
              <div className="h-px bg-[#d4cdc4] dark:bg-[#403c36]" />

              {/* Component */}
              <div className="flex flex-1 items-center justify-center">
                {tool.component}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Navigation Cards ── */}
      <section className="mx-auto max-w-4xl px-6 pb-16">
        <p className="mb-4 text-xs tracking-widest text-[#a09890] dark:text-[#7a7268]">
          其他頁面
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group flex items-center justify-between rounded-2xl border border-[#d4cdc4] bg-[#e8e2d8] px-6 py-5 transition-colors hover:border-[#c0a09c] hover:bg-[#ede8e1] dark:border-[#403c36] dark:bg-[#2a2620] dark:hover:border-[#c8aaa6] dark:hover:bg-[#322d28]"
            >
              <div>
                <p className="text-sm font-semibold text-[#3d3730] dark:text-[#e8e2d8]">
                  {link.label}
                </p>
                <p className="mt-0.5 text-xs text-[#a09890] dark:text-[#7a7268]">
                  {link.desc}
                </p>
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
