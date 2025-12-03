import { driver, DriveStep } from "driver.js";
import { useState, useEffect } from "react";
import "driver.js/dist/driver.css";

const steps: DriveStep[] = [
  {
    element: ".intro-snapshot-button",
    popover: {
      title: "스냅샷",
      description:
        "현재 열려있는 모든 브라우저를 새로운 워크스페이스에 그룹별로 저장합니다.",
      align: "end",
      side: "bottom",
    },
  },
  {
    element: ".intro-snapshot-option",
    popover: {
      title: "스냅샷 이후",
      description:
        "스냅샷 후 현재 열려있는 모든 윈도우를 유지하거나 닫을 수 있습니다.",
      align: "end",
      side: "bottom",
    },
  },
  {
    element: ".intro-options-menu",
    popover: {
      title: "옵션 메뉴",
      description:
        "워크스페이스 데이터를 내보내거나 가져올 수 있고 사용법을 다시 볼 수 있습니다.",
      align: "end",
      side: "bottom",
    },
  },
  {
    element: ".intro-browser-header-buttons:first-of-type",
    popover: {
      title: "윈도우 헤더",
      description:
        "해당 브라우저 윈도우를 닫거나, 최소화, 전체화면 모드로 변경할 수 있습니다.",
      align: "center",
      side: "bottom",
    },
  },
  {
    element: ".intro-browser-tab:first-of-type",
    popover: {
      title: "탭",
      description: "탭을 드래그하여 순서 변경 및 이동이 가능합니다.",
      align: "center",
      side: "left",
    },
  },
  {
    element: ".intro-donation-button",
    popover: {
      title: "후원 버튼",
      description: "후원을 통해 개발자에게 큰 힘이 됩니다.",
      align: "center",
      side: "right",
    },
  },
];

const Intro = () => {
  useEffect(() => {
    const driverObj = driver({
      showProgress: true,
      showButtons: ["next", "previous", "close"],
      nextBtnText: "다음",
      prevBtnText: "이전",
      doneBtnText: "완료",
      steps,
      allowClose: true,
      onDestroyStarted: () => {
        if (
          !driverObj.hasNextStep() ||
          confirm("튜토리얼을 종료하시겠습니까?")
        ) {
          driverObj.destroy();
        }
      },
    });
    driverObj.drive();

    return () => driverObj.destroy();
  }, []);
};

export default Intro;
