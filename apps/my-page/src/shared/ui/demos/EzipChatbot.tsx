"use client";

import { useState, useRef, useEffect } from "react";

const PRESET_RESPONSES: Record<string, string> = {
  LTV: "LTV(주택담보대출비율)는 주택 가격 대비 대출 가능 금액의 비율입니다. 예를 들어 LTV 70%라면 5억짜리 주택에 최대 3.5억까지 대출이 가능합니다.",
  DTI: "DTI(총부채상환비율)는 연 소득에서 연간 금융 부채 원리금 상환액이 차지하는 비율입니다. DTI가 낮을수록 대출 여력이 많습니다.",
  전세: "전세는 보증금을 집주인에게 맡기고 일정 기간 거주하는 한국 특유의 임대차 제도입니다. 월세 없이 보증금만으로 거주할 수 있어요.",
  안녕하세요:
    "안녕하세요! 이집어때 부동산 AI입니다. LTV, DTI, 전세, 청약 등 부동산 용어를 물어보세요!",
  청약: "청약이란 신규 분양 아파트를 공급받을 수 있는 권리를 신청하는 절차입니다. 청약통장 가입 기간과 납입 횟수가 중요합니다.",
};

const INITIAL_MESSAGES = [
  {
    sender: "bot" as const,
    text: "안녕하세요! 이집어때 부동산 AI입니다. LTV, DTI, 전세 등 부동산 용어를 물어보세요!",
  },
];

const SUGGESTIONS = ["LTV가 뭔가요?", "전세 설명해줘", "DTI란?"];

export function EzipChatbotDemo() {
  const [messages, setMessages] =
    useState<{ sender: "user" | "bot"; text: string }[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = (text: string) => {
    if (!text.trim() || isTyping) return;

    const userMsg = { sender: "user" as const, text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const keyword = Object.keys(PRESET_RESPONSES).find((k) =>
        text.includes(k),
      );
      const reply = keyword
        ? PRESET_RESPONSES[keyword]
        : "죄송합니다, 해당 용어에 대한 정보가 없습니다. LTV, DTI, 전세, 청약 등을 물어보세요!";
      setMessages((prev) => [...prev, { sender: "bot", text: reply }]);
      setIsTyping(false);
    }, 900);
  };

  return (
    <div className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-700">
      {/* Header */}
      <div className="flex items-center gap-3 bg-[#F37021] px-4 py-3">
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20 text-sm">
          🏠
        </div>
        <span className="text-sm font-semibold text-white">이집어때 Bot</span>
        <span className="ml-auto flex items-center gap-1 text-xs text-white/70">
          <span className="h-1.5 w-1.5 rounded-full bg-green-300" />
          online
        </span>
      </div>

      {/* Messages */}
      <div className="flex h-56 flex-col gap-2 overflow-y-auto bg-zinc-50 p-3 dark:bg-zinc-900">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                msg.sender === "user"
                  ? "rounded-tr-sm bg-orange-100 text-orange-900 dark:bg-orange-900/30 dark:text-orange-200"
                  : "rounded-tl-sm bg-white text-zinc-700 shadow-sm dark:bg-zinc-800 dark:text-zinc-200"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="flex items-center gap-1 rounded-2xl rounded-tl-sm bg-white px-3 py-2.5 shadow-sm dark:bg-zinc-800">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-300 dark:bg-zinc-600"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Quick suggestions */}
      <div className="flex gap-1.5 overflow-x-auto border-t border-zinc-100 bg-zinc-50 px-3 py-2 dark:border-zinc-800 dark:bg-zinc-900">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            onClick={() => sendMessage(s)}
            disabled={isTyping}
            className="shrink-0 cursor-pointer rounded-full border border-zinc-200 bg-white px-2.5 py-1 text-xs text-zinc-600 transition-colors hover:border-orange-300 hover:text-orange-600 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400"
          >
            {s}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="flex gap-2 border-t border-zinc-200 bg-white p-3 dark:border-zinc-700 dark:bg-zinc-800">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
          placeholder="부동산 용어를 물어보세요..."
          disabled={isTyping}
          className="flex-1 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-sm text-zinc-800 transition-all outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 disabled:opacity-50 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-200"
        />
        <button
          onClick={() => sendMessage(input)}
          disabled={isTyping || !input.trim()}
          className="cursor-pointer rounded-lg bg-[#F37021] px-3 py-1.5 text-xs font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          전송
        </button>
      </div>
    </div>
  );
}
