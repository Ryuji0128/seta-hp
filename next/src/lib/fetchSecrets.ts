/**
 * 現在は環境変数からシークレット値を取得する薄いラッパー。
 * 将来的に外部シークレットストアへ差し替える場合も、呼び出し側はこのAPIを使い続けられる。
 */
export async function fetchSecret(secretName: string): Promise<string> {
  return process.env[secretName] || "";
}
