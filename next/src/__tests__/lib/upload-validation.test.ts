import { describe, it, expect } from "vitest";
import {
  getActualMimeType,
  getExtensionFromMimeType,
  ALLOWED_IMAGE_TYPES,
  MAX_IMAGE_SIZE,
} from "@/lib/upload-validation";

describe("getActualMimeType", () => {
  it("JPEGのマジックナンバーを検出", () => {
    const buffer = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10]);
    expect(getActualMimeType(buffer)).toBe("image/jpeg");
  });

  it("PNGのマジックナンバーを検出", () => {
    const buffer = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
    expect(getActualMimeType(buffer)).toBe("image/png");
  });

  it("GIFのマジックナンバーを検出", () => {
    const buffer = Buffer.from([0x47, 0x49, 0x46, 0x38, 0x39, 0x61]);
    expect(getActualMimeType(buffer)).toBe("image/gif");
  });

  it("WebPのマジックナンバーを検出", () => {
    // RIFF....WEBP
    const buffer = Buffer.alloc(12);
    buffer.write("RIFF", 0, "ascii");
    buffer.writeUInt32LE(0, 4);
    buffer.write("WEBP", 8, "ascii");
    expect(getActualMimeType(buffer)).toBe("image/webp");
  });

  it("RIFFヘッダーだがWEBPでない場合はnull", () => {
    const buffer = Buffer.alloc(12);
    buffer.write("RIFF", 0, "ascii");
    buffer.writeUInt32LE(0, 4);
    buffer.write("AVI ", 8, "ascii");
    expect(getActualMimeType(buffer)).toBeNull();
  });

  it("不明なバイト列でnullを返す", () => {
    const buffer = Buffer.from([0x00, 0x00, 0x00, 0x00]);
    expect(getActualMimeType(buffer)).toBeNull();
  });

  it("空バッファでnullを返す", () => {
    expect(getActualMimeType(Buffer.alloc(0))).toBeNull();
  });

  it("バッファが短すぎる場合もnull", () => {
    const buffer = Buffer.from([0xff]);
    expect(getActualMimeType(buffer)).toBeNull();
  });
});

describe("getExtensionFromMimeType", () => {
  it("JPEG → .jpg", () => {
    expect(getExtensionFromMimeType("image/jpeg")).toBe(".jpg");
  });

  it("PNG → .png", () => {
    expect(getExtensionFromMimeType("image/png")).toBe(".png");
  });

  it("GIF → .gif", () => {
    expect(getExtensionFromMimeType("image/gif")).toBe(".gif");
  });

  it("WebP → .webp", () => {
    expect(getExtensionFromMimeType("image/webp")).toBe(".webp");
  });

});

describe("定数", () => {
  it("許可されたMIMEタイプが4種類", () => {
    expect(ALLOWED_IMAGE_TYPES).toEqual(["image/jpeg", "image/png", "image/gif", "image/webp"]);
  });

  it("最大ファイルサイズが5MB", () => {
    expect(MAX_IMAGE_SIZE).toBe(5 * 1024 * 1024);
  });
});
