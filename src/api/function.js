// 支持await的定时器
export function timeout(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
