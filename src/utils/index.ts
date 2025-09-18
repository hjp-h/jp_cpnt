// 缓动函数
export const easeInOut = (
  time: number,
  begin: number,
  change: number,
  duration: number
): number => {
  if ((time /= duration / 2) < 1) {
    return (change / 2) * time * time * time + begin;
  }
  return (change / 2) * ((time -= 2) * time * time + 2) + begin;
};
