import { readFile } from "fs/promises";
import type { PutObjectCommandInput } from "@aws-sdk/client-s3";
import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
  S3ServiceException,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { env } from "../config/env";

let client: S3Client | null = null;

function getClient(): S3Client {
  if (!client) {
    client = new S3Client({
      region: env.awsRegion,
      credentials: {
        accessKeyId: env.awsAccessKeyId,
        secretAccessKey: env.awsSecretAccessKey,
      },
    });
  }
  return client;
}

/** Safe diagnostic string for logs and non-production API responses */
export function getS3ErrorDetail(err: unknown): string {
  if (err instanceof S3ServiceException) {
    const meta = err.$metadata;
    const region = meta?.requestId ? ` requestId=${meta.requestId}` : "";
    const http = meta?.httpStatusCode ? ` http=${meta.httpStatusCode}` : "";
    return `${err.name}: ${err.message}${region}${http}`;
  }
  if (err instanceof Error) {
    return err.message;
  }
  return String(err);
}

export async function uploadFileFromPath(params: {
  localPath: string;
  key: string;
  contentType: string;
}): Promise<void> {
  const body = await readFile(params.localPath);

  const input: PutObjectCommandInput = {
    Bucket: env.awsBucketName,
    Key: params.key,
    Body: body,
    ContentType: params.contentType,
  };

  if (env.s3PutSseAes256) {
    input.ServerSideEncryption = "AES256";
  }

  await getClient().send(new PutObjectCommand(input));
}

export async function deleteObjectByKey(key: string): Promise<void> {
  await getClient().send(
    new DeleteObjectCommand({
      Bucket: env.awsBucketName,
      Key: key,
    }),
  );
}

/** Time-limited HTTPS URL for private objects (share with client only when appropriate). */
export async function getPresignedDownloadUrl(key: string): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: env.awsBucketName,
    Key: key,
  });
  return getSignedUrl(getClient(), command, { expiresIn: env.presignedUrlTtlSeconds });
}

function streamToBuffer(stream: NodeJS.ReadableStream): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    stream.on("data", (chunk: Buffer | string) => {
      chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
    });
    stream.on("error", reject);
    stream.on("end", () => resolve(Buffer.concat(chunks)));
  });
}

/** Download object bytes (e.g. for OCR). */
export async function getObjectBufferByKey(key: string): Promise<Buffer> {
  const out = await getClient().send(
    new GetObjectCommand({
      Bucket: env.awsBucketName,
      Key: key,
    }),
  );
  const body = out.Body;
  if (!body) {
    throw new Error("S3 GetObject returned empty body");
  }
  return streamToBuffer(body as NodeJS.ReadableStream);
}
