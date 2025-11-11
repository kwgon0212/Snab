import { defineManifest } from "@crxjs/vite-plugin";
import pkg from "./package.json";

export default defineManifest({
  manifest_version: 3,
  name: pkg.name,
  version: pkg.version,
  description:
    "브라우저를 갑작스레 닫아야하는데 이전의 탭들을 기록해두고 싶을 때! 나만의 그룹으로 탭을 관리하고 싶을 때!",
  icons: {
    48: "public/logo.png",
  },
  action: {
    default_icon: {
      48: "public/logo.png",
    },
    default_popup: "src/popup/index.html",
  },
  permissions: ["tabs", "storage"],
  chrome_url_overrides: {
    newtab: "src/newtab/index.html",
  },
});
