/**
 * 指定したキーワードをマスキングする関数
 * @param text マスキング対象のテキスト
 * @param keywords マスキングするキーワードのリスト
 * @returns マスキングされたテキスト
 */
export function maskSensitiveData(text: string, keywords: string[]): string {
  if (!text) return '';
  
  let maskedText = text;
  
  keywords.forEach(keyword => {
    if (keyword.trim()) {
      // 正規表現を使用して大文字小文字を区別せずにキーワードを検索し、マスキング
      const regex = new RegExp(keyword.trim(), 'gi');
      maskedText = maskedText.replace(regex, '***');
    }
  });
  
  return maskedText;
}

/**
 * 日時をフォーマットする関数
 * @param timestamp Unix時間（ミリ秒）
 * @returns YYYY-MM-DD HH:MM:SS形式の文字列
 */
export function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
