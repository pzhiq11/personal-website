const postcss = require('postcss');

module.exports = postcss.plugin('postcss-rpx-to-viewport', opts => {
  const options = Object.assign({
    viewportWidth: 750,      // 设计稿宽度
    unitPrecision: 5,        // 精确到小数点后几位
    minPixelValue: 1,        // 小于该值不转换
    multiplier: 1,           // rpx 与 px 的倍数关系
    exclude: [/node_modules/] // 忽略的文件路径
  }, opts);

  // 检查是否需要忽略该文件
  function checkExclude(file) {
    if (!options.exclude) return false;
    return options.exclude.some(item => {
      if (item instanceof RegExp) {
        return item.test(file);
      }
      return file.includes(item);
    });
  }

  // rpx 转换函数
  function rpxToVw(value) {
    const pixels = parseFloat(value) * options.multiplier;
    if (pixels <= options.minPixelValue) return value;
    
    const vw = (pixels / options.viewportWidth) * 100;
    return `${toFixed(vw, options.unitPrecision)}vw`;
  }

  // 数字精确处理
  function toFixed(number, precision) {
    const multiplier = Math.pow(10, precision);
    return (Math.round(number * multiplier) / multiplier).toFixed(precision);
  }

  return root => {
    if (checkExclude(root.source.input.file)) return;

    root.walkDecls(decl => {
      if (!decl.value.includes('rpx')) return;
      
      decl.value = decl.value.replace(/(\d+)rpx/g, (match, group) => {
        return rpxToVw(group);
      });
    });
  };
}); 