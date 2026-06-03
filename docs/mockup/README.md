# トップページ デザインモックアップ(歴史アーカイブ)

トップページのデザイン刷新検討段階で作成した、スタンドアロン HTML モックアップ。

## 履歴

- **2026-05-13**: 初稿 (`index.html`) — Phantom Display 風 × Hardgraft 風 × 日本語主軸のハイブリッド
- 同日 PR #142 で Next.js に展開され本番デプロイ
- **2026-05-13(後刻)**: ブランド名を **SETA Craft → 飾Love(かざらぶ)** に変更([`branding_kaza-love.md`](../file/branding_kaza-love.md))
- **2026-05-14 朝**: 一時的に 瀬田製作所(本業) コーポレートサイトに revert(Issue #159, PR #160)
- **2026-05-14 夕**: 方針再転換。本リポジトリを **飾Love ブランドサイト**として運用する方向に確定(Issue #151)。setaseisakusyo.com ドメインのまま、ブランド表示は 飾Love、法的事業者表記のみ 瀬田製作所(屋号)

## 中身について

`index.html` はモックアップ初稿のスナップショットで、当時の **SETA Craft** 表記のまま保持しています。これは:

- デザインシステム(色 / タイポ / 構成)の検証用に作ったもの
- 屋号変更前の "after" 証跡として保持
- 後続作業(飾Love 新サイト等)で、構成の参照点として使える

## 使い方

ブラウザでファイル(`file://...docs/mockup/index.html`)を直接開く。
外部依存は Google Fonts(CDN)のみで、ビルド不要。

## 関連

- 屋号変更: [`../file/branding_kaza-love.md`](../file/branding_kaza-love.md)
- デザイントークン(飾Love): [`../../next/src/theme/themeConstants.ts`](../../next/src/theme/themeConstants.ts)

> 本ディレクトリは `next/public/` の外に配置されており、本番デプロイには含まれません。
