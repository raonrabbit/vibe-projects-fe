"use client";

import { useState } from "react";

const OCR_FIELDS = [
  { key: "gender", label: "성별", value: "수컷" },
  { key: "breed", label: "품종", value: "믹스견" },
  { key: "color", label: "색상", value: "황갈색" },
  { key: "weight", label: "체중 (kg)", value: "5.2" },
  { key: "birthDate", label: "출생연월", value: "2023-06" },
  { key: "features", label: "특징", value: "오른쪽 귀 검은 점" },
];

type Step = "idle" | "uploading" | "processing" | "done";

export function HangbokdogOcrDemo() {
  const [step, setStep] = useState<Step>("idle");
  const [visibleFields, setVisibleFields] = useState<Set<string>>(new Set());

  const handleUpload = () => {
    setStep("uploading");
    setVisibleFields(new Set());

    setTimeout(() => {
      setStep("processing");

      // 필드를 순차적으로 하이라이팅
      OCR_FIELDS.forEach((field, i) => {
        setTimeout(
          () => {
            setVisibleFields((prev) => new Set([...prev, field.key]));
            if (i === OCR_FIELDS.length - 1) {
              setStep("done");
            }
          },
          200 + i * 120,
        );
      });
    }, 1200);
  };

  const reset = () => {
    setStep("idle");
    setVisibleFields(new Set());
  };

  return (
    <div className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-700">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-zinc-200 bg-zinc-50 px-4 py-3 dark:border-zinc-700 dark:bg-zinc-800/60">
        {step === "idle" && (
          <button
            onClick={handleUpload}
            className="flex cursor-pointer items-center gap-2 rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-emerald-600"
          >
            <span>📄</span> 공고 이미지 업로드
          </button>
        )}
        {step === "uploading" && (
          <div className="flex items-center gap-2">
            <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-zinc-300 border-t-emerald-500" />
            <span className="text-xs text-zinc-500">이미지 업로드 중...</span>
          </div>
        )}
        {step === "processing" && (
          <div className="flex items-center gap-2">
            <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-zinc-300 border-t-blue-500" />
            <span className="text-xs text-zinc-500">
              EasyOCR 텍스트 추출 중...
            </span>
          </div>
        )}
        {step === "done" && (
          <>
            <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
              ✓ OCR 완료 —{" "}
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                초록 테두리
              </span>{" "}
              필드가 자동 입력됨
            </span>
            <button
              onClick={reset}
              className="ml-auto cursor-pointer text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
            >
              초기화
            </button>
          </>
        )}
      </div>

      {/* Form fields */}
      <div className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-3">
        {OCR_FIELDS.map(({ key, label, value }) => {
          const isDetected = visibleFields.has(key);
          return (
            <div key={key} className="flex flex-col gap-1">
              <label className="text-xs text-zinc-500 dark:text-zinc-400">
                {label}
              </label>
              <input
                readOnly
                value={isDetected ? value : ""}
                placeholder={
                  step === "processing" || step === "uploading"
                    ? "분석 중..."
                    : "미입력"
                }
                className={`rounded-lg border bg-white px-3 py-2 text-sm transition-all duration-300 dark:bg-zinc-900 ${
                  isDetected
                    ? "border-emerald-400 text-emerald-700 ring-2 ring-emerald-400/30 dark:text-emerald-300"
                    : "border-zinc-200 text-zinc-400 dark:border-zinc-700 dark:text-zinc-500"
                }`}
              />
            </div>
          );
        })}
      </div>

      {/* Footer hint */}
      {step === "idle" && (
        <div className="border-t border-zinc-100 px-4 py-2 dark:border-zinc-800">
          <span className="text-xs text-zinc-400">
            업로드 버튼을 눌러 OCR 자동입력 시뮬레이션을 확인하세요
          </span>
        </div>
      )}
    </div>
  );
}
