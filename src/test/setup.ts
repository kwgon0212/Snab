import "@testing-library/jest-dom";
import { vi, afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

// Cleanup after each test case (e.g. clearing jsdom)
afterEach(() => {
  cleanup();
});

// Mock Chrome API
const chromeMock = {
  storage: {
    local: {
      get: vi.fn(),
      set: vi.fn(),
    },
  },
  tabs: {
    create: vi.fn(),
    move: vi.fn(),
    remove: vi.fn(),
  },
  runtime: {
    sendMessage: vi.fn(),
  },
};

// Assign to global window object
// @ts-ignore
global.chrome = chromeMock;
