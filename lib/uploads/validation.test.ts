import { describe, expect, it } from "vitest";
import { ApiError } from "@/lib/shared/api-error";
import {
  maxImageUploadBytes,
  parseCreatePostInput,
  parseImageUploadIntentInput
} from "@/lib/uploads/validation";

describe("uploads validation", () => {
  it("parses a valid image upload intent payload", () => {
    expect(
      parseImageUploadIntentInput({
        filename: "meme.png",
        contentType: "image/png",
        sizeBytes: 1024
      })
    ).toEqual({
      filename: "meme.png",
      contentType: "image/png",
      sizeBytes: 1024,
      checksumSha256: undefined
    });
  });

  it("rejects unsupported upload content types with 415", () => {
    expect(() =>
      parseImageUploadIntentInput({
        filename: "meme.gif",
        contentType: "image/gif",
        sizeBytes: 1024
      })
    ).toThrowError(ApiError);

    try {
      parseImageUploadIntentInput({
        filename: "meme.gif",
        contentType: "image/gif",
        sizeBytes: 1024
      });
    } catch (error) {
      expect((error as ApiError).status).toBe(415);
      expect((error as ApiError).code).toBe("UNSUPPORTED_MEDIA_TYPE");
    }
  });

  it("rejects oversized uploads with 413", () => {
    expect(() =>
      parseImageUploadIntentInput({
        filename: "huge.png",
        contentType: "image/png",
        sizeBytes: maxImageUploadBytes + 1
      })
    ).toThrowError(ApiError);

    try {
      parseImageUploadIntentInput({
        filename: "huge.png",
        contentType: "image/png",
        sizeBytes: maxImageUploadBytes + 1
      });
    } catch (error) {
      expect((error as ApiError).status).toBe(413);
      expect((error as ApiError).code).toBe("FILE_TOO_LARGE");
    }
  });

  it("parses a valid create-post payload", () => {
    expect(
      parseCreatePostInput({
        caption: "  Fresh meme  ",
        visibility: "private",
        tags: ["cats", "Cats", "deploy"],
        asset: {
          tempAssetKey: "4e595c7d-53d8-4d42-aaec-715f8f3a5086"
        }
      })
    ).toEqual({
      caption: "Fresh meme",
      overlayTextTop: undefined,
      overlayTextBottom: undefined,
      tags: ["cats", "deploy"],
      visibility: "private",
      tempAssetKey: "4e595c7d-53d8-4d42-aaec-715f8f3a5086"
    });
  });
});
