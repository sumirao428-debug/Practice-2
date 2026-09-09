"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

interface Transaction {
  _id: string;
  userId: string;
  type: "income" | "expense";
  amount: number;
  category: string;
  note?: string;
  date: string;
}

const emptyForm = {
  type: "expense" as "income" | "expense",
  amount: "",
  category: "",
  note: "",
  date: new Date().toISOString().split("T")[0],
};

const CATEGORY_SUGGESTIONS = {
  income: ["薪水", "獎金", "副業", "投資", "其他"],
  expense: ["餐飲", "交通", "購物", "娛樂", "醫療", "住宿", "其他"],
};

export default function LedgerPage() {
  const router = useRouter();
  const { user, loading: authLoading, logout } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [txLoading, setTxLoading] = useState(false);

  const refresh = () => {
    if (!user) return;
    setTxLoading(true);
    fetch(`/api/transactions?userId=${user._id}`)
      .then((r) => r.json())
      .then(setTransactions)
      .finally(() => setTxLoading(false));
  };

  useEffect(() => { refresh(); }, [user]);

  const income = transactions.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const expense = transactions.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  const balance = income - expense;

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    const payload = { ...form, amount: Number(form.amount), userId: user._id };

    if (editingId) {
      await fetch(`/api/transactions/${editingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } else {
      await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }

    refresh();
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
    setSaving(false);
  };

  const handleEdit = (t: Transaction) => {
    setEditingId(t._id);
    setForm({
      type: t.type,
      amount: String(t.amount),
      category: t.category,
      note: t.note ?? "",
      date: t.date.split("T")[0],
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("確定要刪除這筆交易？")) return;
    await fetch(`/api/transactions/${id}`, { method: "DELETE" });
    setTransactions((prev) => prev.filter((t) => t._id !== id));
  };

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  const inputCls =
    "w-full mt-1 rounded-lg border border-[#d4cdc4] bg-[#f0ebe3] px-3 py-2 text-sm text-[#3d3730] placeholder-[#b0a89e] focus:outline-none focus:ring-2 focus:ring-[#c0a09c] dark:border-[#403c36] dark:bg-[#1e1b16] dark:text-[#e8e2d8] dark:placeholder-[#7a7268]";

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#f0ebe3] dark:bg-[#1e1b16] flex items-center justify-center">
        <p className="text-sm text-[#a09890]">載入中…</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#f0ebe3] dark:bg-[#1e1b16] flex flex-col items-center justify-center gap-5">
        <p className="text-sm text-[#a09890] dark:text-[#7a7268]">請先登入以使用記帳功能</p>
        <Link
          href="/login"
          className="rounded-xl bg-[#c0a09c] px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#b09088] dark:bg-[#c8aaa6] dark:hover:bg-[#b89a98]"
        >
          前往登入
        </Link>
        <Link href="/" className="text-xs text-[#a09890] hover:text-[#3d3730] transition-colors dark:hover:text-[#e8e2d8]">
          ← 回首頁
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f0ebe3] font-sans dark:bg-[#1e1b16]">
      {/* Header */}
      <header className="mx-auto flex max-w-3xl items-center justify-between px-6 pt-8 pb-6">
        <div>
          <Link
            href="/"
            className="text-xs font-semibold tracking-widest text-[#a09890] hover:text-[#3d3730] transition-colors dark:text-[#7a7268] dark:hover:text-[#e8e2d8]"
          >
            MINI TOOLS
          </Link>
          <p className="mt-1 text-xs text-[#a09890] dark:text-[#7a7268]">
            {user.name}
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="rounded-lg border border-[#d4cdc4] px-3 py-1.5 text-xs text-[#a09890] transition-colors hover:border-[#c0a09c] hover:text-[#3d3730] dark:border-[#403c36] dark:hover:border-[#c8aaa6] dark:hover:text-[#e8e2d8]"
        >
          登出
        </button>
      </header>

      <div className="mx-auto max-w-3xl px-6 pb-16 space-y-6">
        {/* Hero */}
        <div>
          <p className="text-xs tracking-widest text-[#a09890] dark:text-[#7a7268]">個人財務</p>
          <h1 className="mt-1 text-3xl font-semibold text-[#3d3730] dark:text-[#e8e2d8]">記帳本</h1>
          <div className="mt-3 h-px w-10 bg-[#c0a09c] opacity-60" />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "收入", value: `+${income.toLocaleString()}`, accent: "text-[#5a9070]" },
            { label: "支出", value: `-${expense.toLocaleString()}`, accent: "text-[#b06050]" },
            {
              label: "結餘",
              value: balance >= 0 ? `+${balance.toLocaleString()}` : balance.toLocaleString(),
              accent: balance >= 0 ? "text-[#5080a0]" : "text-[#b06050]",
            },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-2xl border border-[#d4cdc4] bg-[#e8e2d8] p-4 dark:border-[#403c36] dark:bg-[#2a2620]"
            >
              <p className="text-xs text-[#a09890] dark:text-[#7a7268]">{s.label}</p>
              <p className={`mt-1 text-lg font-semibold tabular-nums ${s.accent}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Add / Edit Form */}
        {showForm && (
          <div className="rounded-2xl border border-[#d4cdc4] bg-[#e8e2d8] p-6 dark:border-[#403c36] dark:bg-[#2a2620]">
            <h2 className="mb-4 text-sm font-semibold text-[#3d3730] dark:text-[#e8e2d8]">
              {editingId ? "編輯交易" : "新增交易"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Type toggle */}
              <div className="flex rounded-xl bg-[#f0ebe3] p-1 dark:bg-[#1e1b16]">
                {(["expense", "income"] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, type: t }))}
                    className={`flex-1 rounded-lg py-1.5 text-sm font-medium transition-colors ${
                      form.type === t
                        ? t === "income"
                          ? "bg-[#5a9070] text-white shadow-sm"
                          : "bg-[#b06050] text-white shadow-sm"
                        : "text-[#a09890] hover:text-[#7a7268] dark:text-[#7a7268]"
                    }`}
                  >
                    {t === "income" ? "收入" : "支出"}
                  </button>
                ))}
              </div>

              {/* Category suggestions */}
              <div className="flex flex-wrap gap-1.5">
                {CATEGORY_SUGGESTIONS[form.type].map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, category: c }))}
                    className={`rounded-full border px-2.5 py-0.5 text-xs transition-colors ${
                      form.category === c
                        ? "border-[#c0a09c] bg-[#c0a09c] text-white dark:border-[#c8aaa6] dark:bg-[#c8aaa6]"
                        : "border-[#d4cdc4] text-[#a09890] hover:border-[#c0a09c] dark:border-[#403c36] dark:text-[#7a7268]"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium tracking-wide text-[#7a7268] dark:text-[#a09890]">金額</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={form.amount}
                    onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
                    className={inputCls}
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium tracking-wide text-[#7a7268] dark:text-[#a09890]">類別</label>
                  <input
                    type="text"
                    required
                    value={form.category}
                    onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                    className={inputCls}
                    placeholder="薪水、餐飲…"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium tracking-wide text-[#7a7268] dark:text-[#a09890]">日期</label>
                  <input
                    type="date"
                    required
                    value={form.date}
                    onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium tracking-wide text-[#7a7268] dark:text-[#a09890]">備註（選填）</label>
                  <input
                    type="text"
                    value={form.note}
                    onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
                    className={inputCls}
                    placeholder="備註…"
                  />
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-1">
                <button
                  type="button"
                  onClick={() => { setForm(emptyForm); setEditingId(null); setShowForm(false); }}
                  className="rounded-xl border border-[#d4cdc4] px-4 py-2 text-sm text-[#7a7268] transition-colors hover:bg-[#f0ebe3] dark:border-[#403c36] dark:hover:bg-[#1e1b16]"
                >
                  取消
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-[#c0a09c] px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-[#b09088] disabled:opacity-50 dark:bg-[#c8aaa6] dark:hover:bg-[#b89a98]"
                >
                  {saving ? "儲存中…" : editingId ? "更新" : "新增"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Transaction List */}
        <div className="rounded-2xl border border-[#d4cdc4] bg-[#e8e2d8] overflow-hidden dark:border-[#403c36] dark:bg-[#2a2620]">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#d4cdc4] dark:border-[#403c36]">
            <h2 className="text-sm font-semibold text-[#3d3730] dark:text-[#e8e2d8]">交易紀錄</h2>
            {!showForm && (
              <button
                onClick={() => { setEditingId(null); setForm(emptyForm); setShowForm(true); }}
                className="rounded-lg bg-[#c0a09c] px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-[#b09088] dark:bg-[#c8aaa6] dark:hover:bg-[#b89a98]"
              >
                + 新增
              </button>
            )}
          </div>

          {txLoading ? (
            <p className="py-10 text-center text-sm text-[#a09890]">載入中…</p>
          ) : transactions.length === 0 ? (
            <div className="py-14 text-center">
              <p className="text-sm text-[#a09890] dark:text-[#7a7268]">目前沒有交易紀錄</p>
              <p className="mt-1 text-xs text-[#c0b8b0] dark:text-[#5a5450]">點擊「新增」開始記帳</p>
            </div>
          ) : (
            <ul className="divide-y divide-[#d4cdc4] dark:divide-[#403c36]">
              {transactions.map((t) => (
                <li
                  key={t._id}
                  className="flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-[#ede8e1] dark:hover:bg-[#322d28]"
                >
                  {/* Type indicator */}
                  <div
                    className={`h-8 w-1 flex-none rounded-full ${
                      t.type === "income" ? "bg-[#5a9070]" : "bg-[#b06050]"
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-[#3d3730] dark:text-[#e8e2d8]">{t.category}</span>
                      {t.note && (
                        <span className="text-xs text-[#a09890] dark:text-[#7a7268] truncate">{t.note}</span>
                      )}
                    </div>
                    <p className="mt-0.5 text-xs text-[#a09890] dark:text-[#7a7268]">
                      {new Date(t.date).toLocaleDateString("zh-TW")}
                    </p>
                  </div>
                  <span
                    className={`text-sm font-semibold tabular-nums ${
                      t.type === "income" ? "text-[#5a9070]" : "text-[#b06050]"
                    }`}
                  >
                    {t.type === "income" ? "+" : "-"}{t.amount.toLocaleString()}
                  </span>
                  <div className="flex gap-1 flex-none">
                    <button
                      onClick={() => handleEdit(t)}
                      className="rounded-lg border border-[#d4cdc4] px-2.5 py-1 text-xs text-[#7a7268] transition-colors hover:border-[#c0a09c] hover:text-[#3d3730] dark:border-[#403c36] dark:hover:border-[#c8aaa6] dark:hover:text-[#e8e2d8]"
                    >
                      編輯
                    </button>
                    <button
                      onClick={() => handleDelete(t._id)}
                      className="rounded-lg border border-[#e8c8c0] px-2.5 py-1 text-xs text-[#b06050] transition-colors hover:bg-[#f8ede8] dark:border-[#5a3028] dark:hover:bg-[#3a1810]"
                    >
                      刪除
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
