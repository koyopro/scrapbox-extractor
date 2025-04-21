import axios from 'axios';
import { ScrapboxPage, ScrapboxPagesResponse } from '../types/scrapbox.js';

export class ScrapboxService {
  private readonly projectName: string;
  private readonly cookie?: string;
  
  constructor(projectName: string, cookie?: string) {
    this.projectName = projectName;
    this.cookie = cookie;
  }

  /**
   * axios用のリクエストヘッダーを生成する
   * @returns HTTPリクエストヘッダー
   */
  private getHeaders() {
    const headers: Record<string, string> = {};
    if (this.cookie) {
      headers['Cookie'] = this.cookie;
    }
    return headers;
  }

  /**
   * 指定された日時以降に更新されたページを取得する
   * @param since 取得する更新日時の起点（Unix時間ミリ秒）
   * @returns 更新されたページの配列
   */
  async getRecentlyUpdatedPages(since: number): Promise<ScrapboxPage[]> {
    try {
      const response = await axios.get<ScrapboxPagesResponse>(
        `https://scrapbox.io/api/pages/${this.projectName}`,
        {
          params: {
            limit: 1000, // 取得上限件数を設定
          },
          headers: this.getHeaders(),
        }
      );
      
      // 指定日時以降に更新されたページをフィルタリング
      const recentPages = response.data.pages.filter(page => page.updated > since);
      
      // 詳細なページ内容を取得
      const pagesWithContent = await Promise.all(
        recentPages.map(async (page) => {
          try {
            const detailResponse = await axios.get<ScrapboxPage>(
              `https://scrapbox.io/api/pages/${this.projectName}/${encodeURIComponent(page.title)}`,
              {
                headers: this.getHeaders(),
              }
            );
            return detailResponse.data;
          } catch (error) {
            console.error(`Failed to fetch page: ${page.title}`, error);
            return { ...page, content: '' };
          }
        })
      );
      
      return pagesWithContent;
    } catch (error) {
      console.error('Failed to fetch updated pages:', error);
      throw new Error('Failed to fetch updated pages from Scrapbox');
    }
  }
  
  /**
   * ページのURLを生成する
   * @param pageTitle ページタイトル
   * @returns ページのURL
   */
  getPageUrl(pageTitle: string): string {
    return `https://scrapbox.io/${this.projectName}/${encodeURIComponent(pageTitle)}`;
  }
}
