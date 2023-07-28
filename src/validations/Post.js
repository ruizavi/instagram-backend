import { z } from "zod";

const NewPost = z.object({
  description: z.string(),
  media: z.any().array(),
  user: z.number(),
});

const NewComment = z.object({
  comment: z.string(),
  postID: z.number(),
  userID: z.number(),
});

export { NewPost, NewComment };
