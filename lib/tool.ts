function  getGridColNum(el: HTMLElement) {
  const computedStyle = getComputedStyle(el)
  return computedStyle.gridTemplateColumns.split(' ').length
}

export default {
  getGridColNum
}