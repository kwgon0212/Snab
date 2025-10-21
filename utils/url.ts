// utils/url.ts
export const normalizeUrl = (url: string): string => {
  let normalized = url.trim();

  // 프로토콜이 없으면 https:// 추가
  if (!normalized.startsWith("http://") && !normalized.startsWith("https://")) {
    normalized = "https://" + normalized;
  }

  return normalized;
};

export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};
