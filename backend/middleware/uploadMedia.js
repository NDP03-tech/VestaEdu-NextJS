const multer = require("multer");

const MAX_FILE_SIZE = 20 * 1024 * 1024;
const allowedMimeTypes = new Set([
  "audio/mpeg",
  "audio/mp3",
  "audio/wav",
  "audio/x-wav",
  "audio/aac",
  "audio/ogg",
]);

const hasMp3Signature = (buffer) =>
  buffer.length >= 2 &&
  (buffer.subarray(0, 3).toString("ascii") === "ID3" ||
    (buffer[0] === 0xff && (buffer[1] & 0xe0) === 0xe0));
const hasWavSignature = (buffer) =>
  buffer.length >= 12 &&
  buffer.subarray(0, 4).toString("ascii") === "RIFF" &&
  buffer.subarray(8, 12).toString("ascii") === "WAVE";
const hasAacSignature = (buffer) =>
  buffer.length >= 2 &&
  buffer[0] === 0xff &&
  (buffer[1] & 0xf6) === 0xf0;
const hasOggSignature = (buffer) =>
  buffer.length >= 4 && buffer.subarray(0, 4).toString("ascii") === "OggS";

const isValidAudioFile = (mimetype, buffer) => {
  if (!Buffer.isBuffer(buffer) || !allowedMimeTypes.has(mimetype)) return false;
  if (mimetype === "audio/mpeg" || mimetype === "audio/mp3") {
    return hasMp3Signature(buffer);
  }
  if (mimetype === "audio/wav" || mimetype === "audio/x-wav") {
    return hasWavSignature(buffer);
  }
  if (mimetype === "audio/aac") return hasAacSignature(buffer);
  return hasOggSignature(buffer);
};

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE, files: 1 },
  fileFilter: (_request, file, callback) => {
    if (!allowedMimeTypes.has(file.mimetype)) {
      const error = new Error("Unsupported media MIME type");
      error.statusCode = 415;
      callback(error);
      return;
    }
    callback(null, true);
  },
});

const middleware = (request, response, next) => {
  upload.single("file")(request, response, (error) => {
    if (!error) {
      next();
      return;
    }

    if (error.code === "LIMIT_FILE_SIZE") {
      response.status(413).json({ message: "Media file exceeds 20 MB" });
      return;
    }
    if (error.statusCode === 415) {
      response.status(415).json({ message: error.message });
      return;
    }
    if (typeof error.code === "string" && error.code.startsWith("LIMIT_")) {
      response.status(400).json({ message: "Invalid media upload request" });
      return;
    }
    next(error);
  });
};

module.exports = { middleware, isValidAudioFile };
