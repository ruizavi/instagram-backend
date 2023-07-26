import prisma from "../prisma.js";
import { NewPost } from "../validations/Post.js";
import { readFile } from "fs/promises";

async function bufferedFiles(files) {
  return await Promise.all(
    files.map(async (file) => ({ resource: await readFile(file.path) }))
  );
}

async function createPostService(data) {
  const { description, media, user } = NewPost.parse(data);

  const resources = await bufferedFiles(media);

  return await prisma.post.create({
    data: {
      userID: user,
      body: description,
      media: { create: resources },
    },
  });
}

export { createPostService };
