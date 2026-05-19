"use client";

import { HangbokdogVaccinationSearchDemo } from "./demos/HangbokdogVaccinationSearch";
import { HangbokdogOcrDemo } from "./demos/HangbokdogOcr";
import { DonghangSeniorUIDemo } from "./demos/DonghangSeniorUI";
import { DonghangDualWindowDemo } from "./demos/DonghangDualWindow";
import { EzipNewsCardDemo } from "./demos/EzipNewsCard";
import { EzipChatbotDemo } from "./demos/EzipChatbot";
import { EzipDarkModeDemo } from "./demos/EzipDarkMode";
import { KuaRollingDeployDemo } from "./demos/KuaRollingDeploy";

const DEMO_REGISTRY: Record<string, React.ComponentType> = {
  "hangbokdog-vaccination-search": HangbokdogVaccinationSearchDemo,
  "hangbokdog-ocr": HangbokdogOcrDemo,
  "donghang-senior-ui": DonghangSeniorUIDemo,
  "donghang-dual-window": DonghangDualWindowDemo,
  "ezip-news-card": EzipNewsCardDemo,
  "ezip-chatbot": EzipChatbotDemo,
  "ezip-darkmode": EzipDarkModeDemo,
  "kua-rolling-deploy": KuaRollingDeployDemo,
};

export function UIDemoViewer({ id }: { id: string }) {
  const Demo = DEMO_REGISTRY[id];
  if (!Demo) return null;

  return (
    <div className="mt-4">
      <Demo />
    </div>
  );
}
