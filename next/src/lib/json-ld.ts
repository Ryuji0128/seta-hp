/**
 * JSON-LD を <script type="application/ld+json"> に安全に埋め込むための文字列化。
 *
 * `<`, `>`, `&` を Unicode エスケープすることで、データ中に `</script>` などが
 * 含まれていてもスクリプトタグを閉じられない（XSSブレイクアウトを防ぐ）。
 * 書き込み時の xss() サニタイズに依存せず、seed / prisma studio 等 API を経由しない
 * 経路で入ったデータに対しても防御が効くようにする。
 */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026");
}
