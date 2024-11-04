// px 转 rpx 的辅助函数
export function px2rpx(px) {
  const ratio = 750 / window.innerWidth;
  return px * ratio;
}

// rpx 转 px 的辅助函数
export function rpx2px(rpx) {
  const ratio = window.innerWidth / 750;
  return rpx * ratio;
} 