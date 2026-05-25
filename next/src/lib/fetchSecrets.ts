type SecretValues = Record<string, string>;

/**
 * 現在は環境変数からシークレット値を取得する薄いラッパー。
 * 将来的に外部シークレットストアへ差し替える場合も、呼び出し側はこのAPIを使い続けられる。
 */
async function getSecretValues(secretNames: string[]): Promise<SecretValues> {
  return secretNames.reduce((acc, secretName) => {
    const value = process.env[secretName];
    return { ...acc, [secretName]: value || "" };
  }, {} as SecretValues);
}

export async function fetchSecrets(secretNames: string[]): Promise<SecretValues> {
  return getSecretValues(secretNames);
}

export async function fetchSecret(secretName: string): Promise<string> {
  const secrets = await getSecretValues([secretName]);
  return secrets[secretName] || "";
}
