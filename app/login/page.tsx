"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

type Tab = "login" | "register";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [tab, setTab] = useState<Tab>("login");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({ name: "", email: "", password: "" });

  const handleLogin = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginForm),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); return; }
      login(data);
      router.push("/ledger");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registerForm),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); return; }
      const loginRes = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: registerForm.email, password: registerForm.password }),
      });
      const loginData = await loginRes.json();
      if (loginRes.ok) {
        login(loginData);
        router.push("/ledger");
      } else {
        setTab("login");
        setLoginForm({ email: registerForm.email, password: "" });
      }
    } finally {
      setLoading(false);
    }
  };

  const inputCls =
    "w-full mt-1 rounded-lg border border-[#d4cdc4] bg-[#f0ebe3] px-3 py-2.5 text-sm text-[#3d3730] placeholder-[#b0a89e] focus:outline-none focus:ring-2 focus:ring-[#c0a09c] dark:border-[#403c36] dark:bg-[#2a2620] dark:text-[#e8e2d8] dark:placeholder-[#7a7268] dark:focus:ring-[#c8aaa6]";

  return (
    <div className="min-h-screen bg-[#f0ebe3] font-sans dark:bg-[#1e1b16] flex flex-col">
      {/* Header */}
      <header className="mx-auto flex w-full max-w-4xl items-center justify-between px-6 pt-8">
        <Link
          href="/"
          className="text-sm font-semibold tracking-widest text-[#a09890] hover:text-[#3d3730] transition-colors dark:text-[#7a7268] dark:hover:text-[#e8e2d8]"
        >
          MINI TOOLS
        </Link>
      </header>

      {/* Form */}
      <div className="flex flex-1 items-center justify-center px-4 py-16">
        <div className="w-full max-w-sm">
          {/* Title */}
          <div className="mb-8 text-center">
            <p className="mb-2 text-xs tracking-widest text-[#a09890] dark:text-[#7a7268]">帳戶</p>
            <h1 className="text-3xl font-semibold text-[#3d3730] dark:text-[#e8e2d8]">
              {tab === "login" ? "登入" : "註冊"}
            </h1>
            <div className="mt-3 mx-auto h-px w-10 bg-[#c0a09c] opacity-60" />
          </div>

          <div className="rounded-2xl border border-[#d4cdc4] bg-[#e8e2d8] p-7 dark:border-[#403c36] dark:bg-[#2a2620]">
            {/* Tab */}
            <div className="mb-6 flex rounded-xl bg-[#f0ebe3] p-1 dark:bg-[#1e1b16]">
              {(["login", "register"] as Tab[]).map((t) => (
                <button
                  key={t}
                  onClick={() => { setTab(t); setError(""); }}
                  className={`flex-1 rounded-lg py-1.5 text-sm font-medium transition-colors ${
                    tab === t
                      ? "bg-[#e8e2d8] text-[#3d3730] shadow-sm dark:bg-[#2a2620] dark:text-[#e8e2d8]"
                      : "text-[#a09890] hover:text-[#7a7268] dark:text-[#7a7268]"
                  }`}
                >
                  {t === "login" ? "登入" : "註冊"}
                </button>
              ))}
            </div>

            {error && (
              <div className="mb-4 rounded-lg border border-[#e8b4a0] bg-[#f8ede8] px-3 py-2.5 text-sm text-[#b05030] dark:border-[#6b3020] dark:bg-[#3a1810] dark:text-[#e8a080]">
                {error}
              </div>
            )}

            {tab === "login" ? (
              <form onSubmit={handleLogin} className="flex flex-col gap-4">
                <div>
                  <label className="text-xs font-medium tracking-wide text-[#7a7268] dark:text-[#a09890]">
                    EMAIL
                  </label>
                  <input
                    type="email"
                    required
                    value={loginForm.email}
                    onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                    className={inputCls}
                    placeholder="you@example.com"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium tracking-wide text-[#7a7268] dark:text-[#a09890]">
                    密碼
                  </label>
                  <input
                    type="password"
                    required
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    className={inputCls}
                    placeholder="••••••••"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="mt-1 w-full rounded-xl bg-[#c0a09c] py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#b09088] disabled:opacity-50 dark:bg-[#c8aaa6] dark:hover:bg-[#b89a98]"
                >
                  {loading ? "登入中…" : "登入"}
                </button>
              </form>
            ) : (
              <form onSubmit={handleRegister} className="flex flex-col gap-4">
                <div>
                  <label className="text-xs font-medium tracking-wide text-[#7a7268] dark:text-[#a09890]">
                    姓名
                  </label>
                  <input
                    type="text"
                    required
                    value={registerForm.name}
                    onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                    className={inputCls}
                    placeholder="你的名字"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium tracking-wide text-[#7a7268] dark:text-[#a09890]">
                    EMAIL
                  </label>
                  <input
                    type="email"
                    required
                    value={registerForm.email}
                    onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                    className={inputCls}
                    placeholder="you@example.com"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium tracking-wide text-[#7a7268] dark:text-[#a09890]">
                    密碼
                  </label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={registerForm.password}
                    onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                    className={inputCls}
                    placeholder="至少 6 個字元"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="mt-1 w-full rounded-xl bg-[#c0a09c] py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#b09088] disabled:opacity-50 dark:bg-[#c8aaa6] dark:hover:bg-[#b89a98]"
                >
                  {loading ? "註冊中…" : "建立帳號"}
                </button>
              </form>
            )}
          </div>

          <p className="mt-6 text-center text-xs text-[#a09890] dark:text-[#7a7268]">
            <Link href="/" className="transition hover:text-[#3d3730] dark:hover:text-[#e8e2d8]">
              ← 回首頁
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
