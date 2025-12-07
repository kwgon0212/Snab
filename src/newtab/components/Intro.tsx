import { driver, DriveStep } from "driver.js";
import { useEffect } from "react";
import "driver.js/dist/driver.css";
import i18n from "@/newtab/i18n";

// 튜토리얼 실행 함수
export const startIntro = () => {
  const t = i18n.t;

  const steps: DriveStep[] = [
    {
      element: ".intro-snapshot-button",
      popover: {
        title: t("tutorial.steps.snapshot.title"),
        description: t("tutorial.steps.snapshot.desc"),
        align: "end",
        side: "bottom",
      },
    },
    {
      element: ".intro-snapshot-option",
      popover: {
        title: t("tutorial.steps.snapshotOption.title"),
        description: t("tutorial.steps.snapshotOption.desc"),
        align: "end",
        side: "bottom",
      },
    },
    {
      element: ".intro-options-menu",
      popover: {
        title: t("tutorial.steps.options.title"),
        description: t("tutorial.steps.options.desc"),
        align: "end",
        side: "bottom",
      },
    },
    {
      element: ".intro-browser-header-buttons:first-of-type",
      popover: {
        title: t("tutorial.steps.windowHeader.title"),
        description: t("tutorial.steps.windowHeader.desc"),
        align: "center",
        side: "bottom",
      },
    },
    {
      element: ".intro-browser-tab:first-of-type",
      popover: {
        title: t("tutorial.steps.tab.title"),
        description: t("tutorial.steps.tab.desc"),
        align: "center",
        side: "left",
      },
    },
    {
      element: ".intro-donation-button",
      popover: {
        title: t("tutorial.steps.donation.title"),
        description: t("tutorial.steps.donation.desc"),
        align: "center",
        side: "right",
      },
    },
  ];

  const driverObj = driver({
    showProgress: true,
    showButtons: ["next", "previous", "close"],
    nextBtnText: t("tutorial.buttons.next"),
    prevBtnText: t("tutorial.buttons.prev"),
    doneBtnText: t("tutorial.buttons.done"),
    steps,
    allowClose: true,
    onDestroyStarted: () => {
      const isLastStep = !driverObj.hasNextStep();

      if (isLastStep) {
        // 마지막 단계에서 종료하는 경우 (완료)
        chrome.storage.local.set({ tutorialCompleted: true });
        driverObj.destroy();
        window.location.reload(); // 리로드하여 언어 변경 사항 등이 확실히 반영되게 함 (선택적)
      } else {
        // 중간에 종료하려는 경우 confirm 확인
        if (confirm(t("tutorial.confirmExit"))) {
          // 사용자가 확인을 누른 경우도 완료로 처리
          chrome.storage.local.set({ tutorialCompleted: true });
          driverObj.destroy();
        }
        // 취소를 누른 경우 destroy하지 않음
      }
    },
  });
  driverObj.drive();
};

const Intro = () => {
  useEffect(() => {
    startIntro();
  }, []);

  return null;
};

export default Intro;
