import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { ScrapboxService } from './services/scrapboxService.js';
import { maskSensitiveData, formatDate } from './utils/maskingUtils.js';
import { exportToCsv } from './utils/csvUtils.js';
import type { ExtractedPageData } from './types/scrapbox.js';

// .env ファイルを読み込む
dotenv.config();

// ESモジュールで __dirname を使うための対応
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * 1週間前のタイムスタンプを取得
 */
function getOneWeekAgoTimestamp(): number {
  const now = new Date();
  const oneWeekAgo = new Date(now);
  oneWeekAgo.setDate(now.getDate() - 7);
  return oneWeekAgo.getTime();
}

/**
 * メインの処理関数
 */
async function main() {
  try {
    // 環境変数から設定を読み込む
    const projectName = process.env.SCRAPBOX_PROJECT_NAME;
    const scrapboxCookie = process.env.SCRAPBOX_COOKIE;
    const maskKeywords = (process.env.MASK_KEYWORDS || '').split(',');
    const outputPath = process.env.OUTPUT_CSV_PATH || path.join(__dirname, '../output.csv');
    
    if (!projectName) {
      throw new Error('SCRAPBOX_PROJECT_NAME が設定されていません。.env ファイルを確認してください。');
    }
    
    console.log(`Scrapbox プロジェクト "${projectName}" から最近1週間の更新ページを抽出します...`);
    
    // 認証情報のステータスを表示
    if (scrapboxCookie) {
      console.log('認証Cookieが設定されています。プライベートプロジェクトにアクセスできます。');
    } else {
      console.log('注意: 認証Cookieが設定されていません。パブリックプロジェクトのみアクセスできます。');
    }
    
    // 1週間前のタイムスタンプを取得
    const oneWeekAgo = getOneWeekAgoTimestamp();
    
    // Scrapbox サービスのインスタンスを作成
    const scrapboxService = new ScrapboxService(projectName, scrapboxCookie);
    
    // 最近更新されたページを取得
    const recentPages = await scrapboxService.getRecentlyUpdatedPages(oneWeekAgo);
    
    console.log(`${recentPages.length}件のページが見つかりました。マスキング処理を行います...`);
    
    // 抽出したデータを処理してマスキング
    const processedData: ExtractedPageData[] = recentPages.map(page => {
      // 敏感な情報をマスキング
      const maskedTitle = maskSensitiveData(page.title, maskKeywords);
      const maskedContent = maskSensitiveData(page.content, maskKeywords);
      
      return {
        title: maskedTitle,
        content: maskedContent,
        updatedAt: formatDate(page.updated),
        url: scrapboxService.getPageUrl(page.title)
      };
    });
    
    // CSVファイルに出力
    await exportToCsv(processedData, outputPath);
    
    console.log('処理が完了しました。');
  } catch (error) {
    console.error('エラーが発生しました:', error);
    process.exit(1);
  }
}

// プログラムを実行
main();
