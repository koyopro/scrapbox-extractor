import fs from 'fs';
import path from 'path';
import { createObjectCsvWriter } from 'csv-writer';
import type { ExtractedPageData } from '../types/scrapbox.js';

/**
 * ページデータをCSVファイルに出力する
 * @param data 出力するページデータ
 * @param outputPath 出力先ファイルパス
 */
export async function exportToCsv(data: ExtractedPageData[], outputPath: string): Promise<void> {
  try {
    // ディレクトリが存在しない場合は作成
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    const csvWriter = createObjectCsvWriter({
      path: outputPath,
      header: [
        { id: 'title', title: 'タイトル' },
        { id: 'content', title: 'コンテンツ' },
        { id: 'updatedAt', title: '更新日時' },
        { id: 'url', title: 'URL' },
      ],
      encoding: 'utf8',
    });
    
    await csvWriter.writeRecords(data);
    console.log(`CSVファイルを出力しました: ${outputPath}`);
  } catch (error) {
    console.error('CSVファイルの出力に失敗しました:', error);
    throw new Error('Failed to export data to CSV');
  }
}
