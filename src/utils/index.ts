export function buildDateStr(date: Date) {
  return `${date.getFullYear()}-${(date.getMonth() + 1) >= 10 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1) }-${date.getDate() >= 10 ? date.getDate() : '0' + date.getDate()}`
}
