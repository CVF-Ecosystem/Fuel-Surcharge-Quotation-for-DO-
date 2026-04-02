/**
 * Chuyển số thành chữ (Tiếng Việt) - Nguyên bản từ script.js
 */
export function numberToWords_VI(n: number): string {
  if (n === undefined || n === null || isNaN(n) || n === 0) return "Không";
  const units = ["", "một", "hai", "ba", "bốn", "năm", "sáu", "bảy", "tám", "chín"];
  const teens = ["mười", "mười một", "mười hai", "mười ba", "mười bốn", "mười lăm", "mười sáu", "mười bảy", "mười tám", "mười chín"];
  const tens = ["", "mười", "hai mươi", "ba mươi", "bốn mươi", "năm mươi", "sáu mươi", "bảy mươi", "tám mươi", "chín mươi"];
  const powersOfTen = ["", "ngàn", "triệu", "tỷ"];

  function convertChunk(num: number): string {
    let str = "", h = Math.floor(num / 100), t = Math.floor((num % 100) / 10), u = num % 10;
    if (h > 0) str += units[h] + " trăm ";
    if (t === 1) str += teens[u] + " ";
    else if (t > 1) {
      str += tens[t] + " ";
      if (u === 1) str += "mốt ";
      else if (u > 0) str += units[u] + " ";
    } else if (u > 0) {
      if (h > 0) str += "lẻ ";
      str += units[u] + " ";
    }
    return str.trim();
  }

  function convertInteger(num: number): string {
    if (num === 0) return "không";
    if (num < 0) return "âm " + convertInteger(Math.abs(num));
    let word = "", i = 0, tempNum = num;
    while (tempNum > 0) {
      if (tempNum % 1000 !== 0) {
        const chunkWord = convertChunk(tempNum % 1000);
        if (chunkWord) word = chunkWord + " " + powersOfTen[i] + " " + word;
      }
      tempNum = Math.floor(tempNum / 1000);
      i++;
    }
    return word.trim();
  }

  const integerPart = Math.trunc(n);
  let integerWords = convertInteger(integerPart);
  return integerWords.charAt(0).toUpperCase() + integerWords.slice(1);
}

/**
 * Chuyển số thành chữ (Tiếng Anh) - Nguyên bản từ script.js
 */
export function numberToWords_EN(n: number): string {
  if (n === 0) return 'Zero';
  const below_20 = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  const thousands = ['', 'Thousand', 'Million', 'Billion'];

  function helper(num: number): string {
    if (num === 0) return '';
    if (num < 20) return below_20[num] + ' ';
    if (num < 100) return tens[Math.floor(num / 10)] + ' ' + helper(num % 10);
    return below_20[Math.floor(num / 100)] + ' Hundred ' + helper(num % 100);
  }

  let word = '';
  let i = 0;
  let tempNum = n;
  while (tempNum > 0) {
    if (tempNum % 1000 !== 0) {
      word = helper(tempNum % 1000) + thousands[i] + ' ' + word;
    }
    tempNum = Math.floor(tempNum / 1000);
    i++;
  }
  return word.trim();
}
