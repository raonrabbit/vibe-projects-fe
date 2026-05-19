"use client";

import { useState } from "react";

const NAV_LINKS = ["홈", "아파트 시세", "뉴스", "지도"];

export function EzipDarkModeDemo() {
  const [isDark, setIsDark] = useState(false);

  const bg = isDark ? "bg-gray-900" : "bg-white";
  const headerBg = isDark
    ? "bg-gray-900/80 border-gray-700"
    : "bg-white/80 border-gray-200";
  const text = isDark ? "text-white" : "text-gray-900";
  const subText = isDark ? "text-gray-400" : "text-gray-500";
  const cardBg = isDark
    ? "bg-gray-800 border-gray-700"
    : "bg-white border-gray-200";
  const navHover = isDark
    ? "text-gray-300 hover:text-white"
    : "text-gray-600 hover:text-gray-900";
  const tagBg = isDark
    ? "bg-gray-700 text-gray-300"
    : "bg-gray-100 text-gray-600";

  return (
    <div
      className={`overflow-hidden rounded-xl border transition-colors duration-300 ${
        isDark ? "border-gray-700" : "border-zinc-200"
      }`}
    >
      {/* Simulated browser chrome */}
      <div
        className={`flex items-center justify-between border-b px-4 py-2.5 backdrop-blur transition-colors duration-300 ${headerBg} ${bg}`}
      >
        {/* Logo */}
        <span className={`text-sm font-black transition-colors ${text}`}>
          이집어때
        </span>

        {/* Nav */}
        <div className="hidden items-center gap-4 sm:flex">
          {NAV_LINKS.map((link) => (
            <span
              key={link}
              className={`text-xs transition-colors ${navHover}`}
            >
              {link}
            </span>
          ))}
        </div>

        {/* Dark mode toggle */}
        <button
          onClick={() => setIsDark((v) => !v)}
          className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded-full transition-colors ${
            isDark
              ? "bg-gray-700 text-yellow-300 hover:bg-gray-600"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
          title={isDark ? "라이트 모드" : "다크 모드"}
        >
          {isDark ? "☀️" : "🌙"}
        </button>
      </div>

      {/* Page content preview */}
      <div className={`px-4 py-5 transition-colors duration-300 ${bg}`}>
        {/* Search bar mock */}
        <div
          className={`mb-4 flex items-center gap-3 rounded-xl border px-4 py-2.5 transition-colors duration-300 ${cardBg}`}
        >
          <span className="text-base">🔍</span>
          <span className={`text-sm transition-colors ${subText}`}>
            아파트 이름 또는 지역 검색...
          </span>
        </div>

        {/* Card grid */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { area: "강남구", price: "19.8억", change: "+0.3%", up: true },
            { area: "마포구", price: "9.2억", change: "-0.1%", up: false },
            { area: "용산구", price: "15.4억", change: "+0.8%", up: true },
            { area: "송파구", price: "13.1억", change: "+0.2%", up: true },
          ].map((item) => (
            <div
              key={item.area}
              className={`rounded-xl border p-3 transition-colors duration-300 ${cardBg}`}
            >
              <div className="flex items-start justify-between">
                <span className={`text-xs font-medium ${subText}`}>
                  {item.area}
                </span>
                <span
                  className={`rounded-full px-1.5 py-0.5 text-xs font-medium transition-colors ${tagBg}`}
                >
                  아파트
                </span>
              </div>
              <p
                className={`mt-1 text-base font-bold transition-colors ${text}`}
              >
                {item.price}
              </p>
              <p
                className={`text-xs font-medium ${item.up ? "text-red-500" : "text-blue-500"}`}
              >
                {item.change}
              </p>
            </div>
          ))}
        </div>

        <p className={`mt-3 text-center text-xs transition-colors ${subText}`}>
          {isDark ? "🌙 다크 모드" : "☀️ 라이트 모드"} — 헤더 버튼으로
          전환하세요
        </p>
      </div>
    </div>
  );
}
