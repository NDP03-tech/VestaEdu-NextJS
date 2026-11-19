import express from "express";
import request from "supertest";

const uploadMedia = require("../uploadMedia") as {
  middleware: express.RequestHandler;
  isValidAudioFile: (mimetype: string, buffer: Buffer) => boolean;
};

function createUploadApp() {
  const app = express();
  app.post("/", uploadMedia.middleware, (req, res) => {
    res.status(201).json({
      mimetype: (req as express.Request & { file?: { mimetype: string } }).file
        ?.mimetype,
    });
  });
  return app;
}

describe("media upload validation", () => {
  it("accepts supported audio MIME types and matching file signatures", async () => {
    const response = await request(createUploadApp())
      .post("/")
      .attach("file", Buffer.from("ID3\u0004\u0000\u0000"), {
        filename: "lesson.mp3",
        contentType: "audio/mpeg",
      });

    expect(response.status).toBe(201);
    expect(uploadMedia.isValidAudioFile("audio/mpeg", Buffer.from("ID3"))).toBe(
      true,
    );
    expect(
      uploadMedia.isValidAudioFile("audio/mpeg", Buffer.from("not audio")),
    ).toBe(false);
    expect(
      uploadMedia.isValidAudioFile("text/plain", Buffer.from("ID3")),
    ).toBe(false);
  });

  it("rejects unsupported MIME types", async () => {
    const response = await request(createUploadApp())
      .post("/")
      .attach("file", Buffer.from("not audio"), {
        filename: "file.txt",
        contentType: "text/plain",
      });

    expect(response.status).toBe(415);
  });

  it("rejects media larger than 20 MB", async () => {
    const response = await request(createUploadApp())
      .post("/")
      .attach("file", Buffer.alloc(20 * 1024 * 1024 + 1), {
        filename: "large.mp3",
        contentType: "audio/mpeg",
      });

    expect(response.status).toBe(413);
  }, 15000);
});
