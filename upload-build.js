/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
import pkg from "aws-sdk";
import dotenv from "dotenv";
import { readFileSync } from "fs";

dotenv.config();

const { S3 } = pkg;

const s3 = new S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const jsFileContent = readFileSync("dist/index.js.gz");

s3.upload(
  {
    Bucket: process.env.AWS_BUCKET_NAME || "",
    Key: "index.js.gz",
    Body: jsFileContent,
    ContentType: "application/javascript",
    ContentEncoding: "gzip", // Indicate that the content is gzip-compressed
  },
  (err, data) =>
    err
      ? console.log("Error uploading index.js ", err)
      : console.log("index.js uploaded =>", data.Location)
);
