import prisma from "../prisma.js";
import { NewPost } from "../validations/Post.js";

async function createPostService(data) {
  const { description, media, user } = NewPost.parse(data);

  const resources = media.map((m) => ({ resource: m.filename }));

  return await prisma.post.create({
    data: {
      userID: user,
      body: description,
      media: { create: resources },
    },
  });
}

export { createPostService };
