# SETA Craft トップページ デザインモックアップ

トップページデザイン刷新の検討段階で作成した、スタンドアロンHTMLモックアップ。

## 履歴

- **2026-05-13**: 初稿 (`index.html`) — Phantom Display 風 × Hardgraft 風 × 日本語主軸のハイブリッド
- 同日の決定後、Next.js 実装に展開 → PR #142

## 使い方

ブラウザでファイル(`file://...docs/mockup/index.html`)を直接開く。
外部依存は Google Fonts(CDN)のみで、ビルド不要。

## 関連

- 本番実装: [`next/src/app/_home/`](../../next/src/app/_home/) 配下
- デザイントークン: [`next/src/theme/themeConstants.ts`](../../next/src/theme/themeConstants.ts)
- 関連 PR: #142

> このディレクトリは「after」状態の証跡として保持しています。
> 本番デプロイには含まれません(`next/public/` の外に配置)。
