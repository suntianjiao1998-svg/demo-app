// 工具函数 — 包含 2 个预埋 Bug

// BUG-006: 日期格式化时区错误
function formatDate(date) {
  // 使用 toISOString 会转为 UTC，导致中国时间差 8 小时
  return date.toISOString().split('T')[0];
}

// BUG-007: 数组去重用 O(n²) 算法
function unique(arr) {
  const result = [];
  for (let i = 0; i < arr.length; i++) {
    let found = false;
    for (let j = 0; j < result.length; j++) {
      if (arr[i] === result[j]) {
        found = true;
        break;
      }
    }
    if (!found) result.push(arr[i]);
  }
  return result;
}

module.exports = { formatDate, unique };
