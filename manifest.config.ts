import { defineManifest } from "@crxjs/vite-plugin";
import pkg from "./package.json";

export default defineManifest({
  manifest_version: 3,
  name: pkg.name,
  version: pkg.version,
  icons: {
    48: "public/logo.png",
  },
  action: {
    default_icon: {
      48: "public/logo.png",
    },
    default_popup: "src/popup/index.html",
  },
  // tabs: 탭 정보 읽기, storage: 로컬 저장소 사용, windows: 창 정보 읽기
  permissions: ["tabs", "storage", "windows"],
  chrome_url_overrides: {
    // newtab: "src/newtab/index.html",
    newtab: "src/newtab/index.html",
  },
  // content_scripts: [
  //   {
  //     js: ["src/content/main.tsx"],
  //     matches: ["https://*/*"],
  //   },
  // ],
});
