export const s = /\$|\(|\)|\*|\+|\.|\?|\{|\}|\[|\]|\^|\||\\/gi;
export const newline = /\r|\n|\r\n/gi; // 行
export const multiline = /\r+|\n+|\r\n/gi; // 多空行
export const tripletBreak = /([\r\n]\s*){3,}/gi; // 三个以上的换行 /[\r|\n|\r\n]{3,}/gi 三个以上的换行加空格 /([(\r|\n|\r\n)\s*]){3,}/gi
export const chapterBreak = /[\r\n][^\u4e00-\u9fa5]*(?=第([^\u4e00-\u9fa5]*[\d\u96f6\u58f9\u4e00\u8d30\u4e8c\u53c1\u4e09\u8086\u56db\u4f0d\u4e94\u9646\u516d\u67d2\u4e03\u6252\u516b\u7396\u4e5d\u62fe\u5341\u4f70\u767e\u4edf\u5343\u842c\u4e07\u5104\u4ebf\u5146\u4eac\u5793\u677c\u7a70\u6e9d\u6c9f\u6f97\u6da7\u6b63\u8f09\u8f7d\u6975\u6781]+[^\u4e00-\u9fa5]*)章[^\u4e00-\u9fa5]?)/gi; // 第X章
export const emptyEnd = /(^\s+)|(\s+$)/gi; // 首尾空格
export const redundancy = /\r|\n|\\s/gi; // 空,换行
export const spacing = /\s/gi; // 空
export const parentheses = /\([^\)]*\)/gi; // 小括号
export const bracket = /\[.*\]/gi; // 中括号
export const braces = /\{[^\}]+\}/gi; // 大括号
export const empty = /\r|\n|\\s/gi;
export const htmlA = new RegExp("<(\S*?)[^>]*>.*?|<.*? />", "g");
export const htmlB = new RegExp("<(\S*?)[^>]*>.*|<.*? />", "g");
export const InternetURL = new RegExp(`^([a-zA-Z]\:|\\\\[^\/\\:*?"<>|]+\\[^\/\\:*?"<>|]+)(\\[^\/\\:*?"<>|]+)+(\.[^\/\\:*?"<>|]+)$`, "g");
export const InternetURL2 = new RegExp(`[a-zA-z]+://[^\s]*`, "g");
export const InternetURLHref = /#.*?$/;
export const SpecialCharacter1 = /(&#.*?;)|(&.*?;)|(#.*?;)/gi; // 特殊字符1