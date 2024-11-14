/**
 * 获取Grid盒子的列数
 * @param el 
 * @returns 
 */
function  getGridColNum(el: HTMLElement) {
  const computedStyle = getComputedStyle(el)
  return computedStyle.gridTemplateColumns.split(' ').length
}

export default {
  getGridColNum
}